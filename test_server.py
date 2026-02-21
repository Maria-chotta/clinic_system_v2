#!/usr/bin/env python
import os
import sys

# Add the clinic_backend directory to the path
sys.path.insert(0, 'c:/Users/CHOTTA/Desktop/CLINIC_APP_SYSTEM/backend/clinic_backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_backend.settings')

try:
    import django
    django.setup()
    print("Django setup successful!")
    
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', '8000'])
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
