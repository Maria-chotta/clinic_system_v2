from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates demo users for testing'

    def handle(self, *args, **options):
        # Create Demo Patient
        patient, created = User.objects.get_or_create(
            username='patient1',
            defaults={
                'email': 'patient1@clinic.com',
                'first_name': 'John',
                'last_name': 'Patient',
                'role': 'patient',
                'phone_number': '1234567890',
            }
        )
        if created:
            patient.set_password('patient123')
            patient.save()
            self.stdout.write(self.style.SUCCESS(f'Created patient: patient1 / patient123'))
        else:
            self.stdout.write(f'Patient patient1 already exists')

        # Create Demo Doctor
        doctor, created = User.objects.get_or_create(
            username='doctor1',
            defaults={
                'email': 'doctor1@clinic.com',
                'first_name': 'Sarah',
                'last_name': 'Smith',
                'role': 'doctor',
                'phone_number': '9876543210',
            }
        )
        if created:
            doctor.set_password('doctor123')
            doctor.save()
            
            # Create doctor profile
            from accounts.models import DoctorProfile
            DoctorProfile.objects.create(
                user=doctor,
                specialization='Cardiology',
                license_number='MD123456',
                years_of_experience=10,
                consultation_fee=100.00,
                available_days='Monday,Tuesday,Wednesday,Thursday,Friday',
                bio='Experienced cardiologist with 10+ years of practice.'
            )
            self.stdout.write(self.style.SUCCESS(f'Created doctor: doctor1 / doctor123'))
        else:
            self.stdout.write(f'Doctor doctor1 already exists')

        # Create Demo Admin
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@clinic.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'phone_number': '1112223333',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin: admin / admin123'))
        else:
            self.stdout.write(f'Admin admin already exists')

        self.stdout.write(self.style.SUCCESS('\nDemo accounts created successfully!'))
        self.stdout.write('Patient: patient1 / patient123')
        self.stdout.write('Doctor: doctor1 / doctor123')
        self.stdout.write('Admin: admin / admin123')
