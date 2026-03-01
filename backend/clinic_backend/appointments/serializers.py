from rest_framework import serializers
from datetime import date, datetime
from django.utils import timezone
from .models import Appointment
from accounts.serializers import UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = UserSerializer(source='patient', read_only=True)
    doctor_details = UserSerializer(source='doctor', read_only=True)
    doctor_name = serializers.SerializerMethodField()
    report_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'patient', 'payment_status', 'payment_reference')
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"
        return "Unknown Doctor"
    
    def get_report_url(self, obj):
        if obj.report:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.report.url)
        return None
    
    def validate(self, data):
        appointment_date = data.get('appointment_date')
        appointment_time = data.get('appointment_time')
        doctor = data.get('doctor')
        
        # Skip validation if appointment_date is not provided
        if not appointment_date:
            return data
            
        # Convert to date if it's a string
        if isinstance(appointment_date, str):
            try:
                appointment_date = datetime.strptime(appointment_date, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError({"appointment_date": "Invalid date format. Use YYYY-MM-DD"})
        
        # Check if date is in the past
        if appointment_date < date.today():
            raise serializers.ValidationError({"appointment_date": "Appointment date cannot be in the past"})
        
        # Check for conflicting appointments with the same doctor at the same date and time
        if doctor and appointment_time:
            # Get the doctor instance if only ID was passed
            if isinstance(doctor, int):
                from accounts.models import User
                try:
                    doctor = User.objects.get(id=doctor, role='doctor')
                except User.DoesNotExist:
                    pass  # Will be caught by other validation
            
            # Check for existing appointments (excluding cancelled ones)
            conflicting_appointments = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time
            ).exclude(status='cancelled')
            
            # If updating an existing appointment, exclude it from the check
            if self.instance:
                conflicting_appointments = conflicting_appointments.exclude(pk=self.instance.pk)
            
            if conflicting_appointments.exists():
                raise serializers.ValidationError({
                    "non_field_errors": f"Dr. {doctor.first_name} {doctor.last_name} already has an appointment at this date and time."
                })
        
        return data
    
    def create(self, validated_data):
        # Get the request context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Set the patient to the current user
            validated_data['patient'] = request.user
        return super().create(validated_data)
