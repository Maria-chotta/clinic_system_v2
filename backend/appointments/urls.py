from django.urls import path
from . import views

urlpatterns = [
    path('', views.AppointmentListCreateView.as_view(), name='appointment-list'),
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('doctor/<int:doctor_id>/', views.DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('patient/<int:patient_id>/', views.PatientAppointmentsView.as_view(), name='patient-appointments'),
]