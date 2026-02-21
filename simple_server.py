import os
import sys

# Set up path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, 'backend', 'clinic_backend'))
os.chdir(os.path.join(BASE_DIR, 'backend', 'clinic_backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_backend.settings')

# Run the server
if __name__ == '__main__':
    import django
    from django.core.management import execute_from_command_line
    
    django.setup()
    execute_from_command_line(sys.argv)
