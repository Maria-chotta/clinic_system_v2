from django.shortcuts import render

from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, DoctorProfileSerializer, UserProfileUpdateSerializer
from .models import DoctorProfile

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Don't require authentication for registration
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # DoctorProfile is now created in the serializer's create method
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Don't require authentication for login
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return updated user data
        return Response(UserSerializer(instance).data)

class DoctorListView(generics.ListAPIView):
    queryset = User.objects.filter(role='doctor', is_active=True).select_related('doctor_profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class DoctorDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(role='doctor')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

class DoctorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        doctor_profile, created = DoctorProfile.objects.get_or_create(user=self.request.user)
        return doctor_profile

class UserListView(generics.ListAPIView):
    """
    API endpoint for admin to view all users
    """
    queryset = User.objects.all().select_related('doctor_profile')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can list all users
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all().select_related('doctor_profile')

class AdminUpdateDoctorView(APIView):
    """
    API endpoint for admin to update doctor profile including consultation_fee
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, user_id):
        # Only admins can update doctor profiles
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id, role='doctor')
        except User.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            doctor_profile = user.doctor_profile
        except DoctorProfile.DoesNotExist:
            doctor_profile = DoctorProfile.objects.create(user=user)
        
        # Update doctor profile fields
        consultation_fee = request.data.get('consultation_fee')
        specialization = request.data.get('specialization')
        license_number = request.data.get('license_number')
        years_of_experience = request.data.get('years_of_experience')
        available_days = request.data.get('available_days')
        bio = request.data.get('bio')
        
        if consultation_fee:
            try:
                doctor_profile.consultation_fee = float(consultation_fee)
            except (ValueError, TypeError):
                pass
        
        if specialization:
            doctor_profile.specialization = specialization
        if license_number:
            doctor_profile.license_number = license_number
        if years_of_experience:
            try:
                doctor_profile.years_of_experience = int(years_of_experience)
            except (ValueError, TypeError):
                pass
        if available_days:
            doctor_profile.available_days = available_days
        if bio:
            doctor_profile.bio = bio
        
        doctor_profile.save()
        
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
