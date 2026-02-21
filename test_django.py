import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_backend.settings')

try:
    django.setup()
    print("Django setup successful!")
except Exception as e:
    print(f"Error: {e}")
