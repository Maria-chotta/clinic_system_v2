from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import Appointment
from .serializers import AppointmentSerializer
from accounts.models import User

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()
    
    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctor')
        
        # Validate doctor exists and is actually a doctor
        try:
            doctor = User.objects.get(id=doctor_id, role='doctor', is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError({"doctor": "Invalid doctor selected."})
        
        # Save with current user as patient
        serializer.save(patient=self.request.user, doctor=doctor)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()
    
    def perform_update(self, serializer):
        if self.request.user.role in ['doctor', 'admin']:
            serializer.save()
        else:
            # Patients can only update certain fields
            serializer.save(patient=self.request.user)

class DoctorAppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return Appointment.objects.filter(doctor_id=doctor_id)

class PatientAppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        return Appointment.objects.filter(patient_id=patient_id)
