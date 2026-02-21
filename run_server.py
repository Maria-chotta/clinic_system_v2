import os
import sys

# Add clinic_backend to path
sys.path.insert(0, 'c:/Users/CHOTTA/Desktop/CLINIC_APP_SYSTEM/backend/clinic_backend')
os.chdir('c:/Users/CHOTTA/Desktop/CLINIC_APP_SYSTEM/backend/clinic_backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_backend.settings')

try:
    import django
    print(f"Django version: {django.VERSION}")
    django.setup()
    print("Django setup successful!")
    
    from django.core.management import call_command
    call_command('check')
    print("All checks passed!")
    
    print("Starting server at http://localhost:8000")
    call_command('runserver', '8000')
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
