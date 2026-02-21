from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, DoctorProfile

class UserSerializer(serializers.ModelSerializer):
    specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone_number', 'profile_picture', 'address', 'date_of_birth',
                  'specialization')
        read_only_fields = ('id', 'username', 'role')
    
    def get_specialization(self, obj):
        if obj.role == 'doctor':
            try:
                return obj.doctor_profile.specialization
            except DoctorProfile.DoesNotExist:
                return None
        return None

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone_number', 'profile_picture', 'address', 'date_of_birth',
                  'specialization')
        read_only_fields = ('id', 'username', 'role')
    
    def get_specialization(self, obj):
        if obj.role == 'doctor':
            try:
                return obj.doctor_profile.specialization
            except DoctorProfile.DoesNotExist:
                return None
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    # Doctor specific fields - all optional in the serializer (validated separately)
    specialization = serializers.CharField(write_only=True, required=False, allow_blank=True)
    license_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    years_of_experience = serializers.CharField(write_only=True, required=False, allow_blank=True)
    consultation_fee = serializers.CharField(write_only=True, required=False, allow_blank=True)
    available_days = serializers.CharField(write_only=True, required=False, allow_blank=True)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 
                  'last_name', 'role', 'phone_number', 'specialization', 'license_number',
                  'years_of_experience', 'consultation_fee', 'available_days', 'bio')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
    def create(self, validated_data):
        # Extract doctor-specific fields
        doctor_fields = {}
        
        # Get role with default 'patient'
        role = validated_data.get('role', 'patient')
        
        # Only create DoctorProfile if role is doctor AND specialization is provided
        if role == 'doctor' and validated_data.get('specialization'):
            # Handle empty strings for numeric fields
            years_exp = validated_data.pop('years_of_experience', '0')
            consult_fee = validated_data.pop('consultation_fee', '0')
            
            # Convert to appropriate types
            try:
                years_exp = int(years_exp) if years_exp else 0
            except (ValueError, TypeError):
                years_exp = 0
            
            try:
                consult_fee = float(consult_fee) if consult_fee else 0
            except (ValueError, TypeError):
                consult_fee = 0
            
            doctor_fields = {
                'specialization': validated_data.pop('specialization', ''),
                'license_number': validated_data.pop('license_number', ''),
                'years_of_experience': years_exp,
                'consultation_fee': consult_fee,
                'available_days': validated_data.pop('available_days', 'Monday,Tuesday,Wednesday,Thursday,Friday'),
                'bio': validated_data.pop('bio', ''),
            }
        else:
            # Remove doctor-specific fields for non-doctors
            validated_data.pop('specialization', None)
            validated_data.pop('license_number', None)
            validated_data.pop('years_of_experience', None)
            validated_data.pop('consultation_fee', None)
            validated_data.pop('available_days', None)
            validated_data.pop('bio', None)
        
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        # Create DoctorProfile if user is a doctor and specialization was provided
        if user.role == 'doctor' and doctor_fields:
            DoctorProfile.objects.create(
                user=user,
                **doctor_fields
            )
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'
