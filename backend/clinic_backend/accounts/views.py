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
