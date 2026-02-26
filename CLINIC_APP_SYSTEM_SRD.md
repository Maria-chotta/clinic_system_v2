# Software Requirement Document (SRD)
## Clinic Management System

---

## Table of Contents
1. [Software Development Standards](#software-development-standards)
2. [Introduction](#introduction)
3. [Project Background](#project-background)
4. [Project Objectives](#project-objectives)
5. [Project Scope](#project-scope)
6. [Current System Description](#current-system-description)
7. [Proposed System](#proposed-system)
8. [System Design](#system-design)
9. [Process Diagrams](#process-diagrams)
10. [Use Cases](#use-cases)
11. [Data Models](#data-models)
12. [Functional Requirements](#functional-requirements)
13. [Non-Functional Requirements](#non-functional-requirements)
14. [Deployment](#deployment)
15. [Appendices](#appendices)

---

# 1. Software Development Standards

## 1.1 Introduction

This document outlines the comprehensive software requirements for the Clinic Management System developed for the State University of Zanzibar. The system is designed to automate and streamline clinic operations including patient registration, appointment scheduling, doctor management, and payment processing.

---

# 2. Introduction

## 2.1 Purpose

The purpose of this document is to provide a detailed description of the requirements for the Clinic Management System. It specifies the functional and non-functional requirements, system design specifications, and deployment considerations.

## 2.2 Scope

The Clinic Management System is a web-based application that facilitates:
- Patient registration and profile management
- Doctor registration and profile management
- Appointment booking and scheduling
- Payment processing
- Medical report management
- Administrative functions and reporting

---

# 3. Project Background

## 3.1 Organization Context

The State University of Zanzibar requires a modern clinic management system to replace manual/legacy processes for managing student and staff healthcare services.

## 3.2 Problem Statement

Current clinic operations face challenges including:
- Manual appointment scheduling leading to conflicts
- Difficulty in tracking patient history
- Inefficient payment processing
- Limited visibility into clinic operations for administrators
- Lack of integrated doctor availability management

---

# 4. Project Objectives

## 4.1 Primary Objectives

1. **Automate Appointment Scheduling**: Enable patients to book appointments with doctors online with real-time availability checking.

2. **User Management**: Provide separate interfaces and functionality for Patients, Doctors, and Administrators.

3. **Payment Processing**: Support multiple payment methods including Cash, Credit/Debit Card, Insurance, Mobile Money, and Bank Transfer.

4. **Medical Records Management**: Allow patients to upload medical reports and doctors to view/update patient notes.

5. **Dashboard & Analytics**: Provide role-specific dashboards with relevant statistics and insights.

---

# 5. Project Scope

## 5.1 In-Scope Features

| Module | Features |
|--------|----------|
| Authentication | User registration, login, JWT-based authentication, password management |
| Patient Portal | Book appointments, view medical history, upload reports, make payments |
| Doctor Portal | View appointments, approve/reschedule/cancel appointments, add notes |
| Admin Portal | User management, doctor management, view all appointments, system settings |
| Appointment System | Booking, scheduling, status tracking, notifications |
| Payment System | Multiple payment methods, payment status tracking, payment history |
| Reporting | Appointment statistics, user statistics, revenue reports |

## 5.2 Out of Scope

- Telemedicine/video consultation features
- Pharmacy/prescription management
- Inventory management
- SMS/Email notifications (future enhancement)
- Mobile application (future enhancement)

---

# 6. Current System Description

## 6.1 Existing Process

Currently, the clinic operates using manual processes:
- Paper-based patient registration
- Phone/in-person appointment booking
- Cash-based payments only
- Physical file storage for medical records

## 6.2 Limitations

- No centralized database
- Time-consuming appointment scheduling
- High chance of scheduling conflicts
- Difficulty in generating reports
- Limited access to historical data

---

# 7. Proposed System

## 7.1 System Overview

The proposed Clinic Management System is a full-stack web application with:

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js with Material UI |
| Backend | Django REST Framework |
| Database | SQLite (development) / PostgreSQL (production) |
| Authentication | JWT (JSON Web Tokens) |
| API | RESTful API |

### User Roles

1. **Patient**: Can register, book appointments, upload reports, make payments
2. **Doctor**: Can manage appointments, view patient info, add consultation notes
3. **Admin**: Full system access, user management, reports, settings

---

# 8. System Design

## 8.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Patient   │  │   Doctor    │  │    Admin    │              │
│  │    Portal   │  │    Portal   │  │    Portal   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
│              Django REST Framework API                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Accounts   │  │Appointments│  │   Auth     │              │
│  │   API       │  │    API     │  │    API     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│              SQLite / PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 Database Design

### Entity Relationship Diagram (ERD)

**Place the ERD diagram here**

```
┌──────────────────┐       ┌──────────────────┐
│       User       │       │ DoctorProfile    │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │◄──────│ user_id (FK)     │
│ username         │       │ specialization  │
│ email            │       │ license_number   │
│ password         │       │ years_experience │
│ role             │       │ consultation_fee │
│ first_name       │       │ available_days   │
│ last_name        │       │ available_time   │
│ phone_number     │       │ bio              │
│ profile_picture  │       └──────────────────┘
│ address          │
│ date_of_birth    │
└────────┬─────────┘
         │
         │ patient_id
         │ doctor_id
         ▼
┌──────────────────────────────────┐
│         Appointment              │
├──────────────────────────────────┤
│ id (PK)                          │
│ patient_id (FK) ──────────────┐  │
│ doctor_id (FK)               │  │
│ appointment_date              │  │
│ appointment_time              │  │
│ status                        │  │
│ symptoms                     │  │
│ notes                         │  │
│ payment_method               │  │
│ payment_status               │  │
│ payment_amount               │  │
│ payment_reference            │  │
│ is_paid                       │  │
│ report                        │  │
│ report_description           │  │
│ created_at                    │  │
│ updated_at                    │  │
└───────────────────────────────┘
```

## 8.3 System Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM DATA FLOW                                │
└──────────────────────────────────────────────────────────────────────────┘

  [Patient]                    [Doctor]                     [Admin]
     │                           │                            │
     │  1. Register/Login         │                            │
     │───────────────────────────►                            │
     │                           │                            │
     │  2. View Doctors          │                            │
     │◄──────────────────────────                            │
     │                           │                            │
     │  3. Book Appointment ─────────────►                   │
     │                           │                            │
     │                           │  4. Receive Notification   │
     │                           │◄────────────────────────────│
     │                           │                            │
     │                           │  5. Approve/Complete       │
     │◄───────────────────────────                            │
     │                           │                            │
     │  6. View Status           │                            │
     │◄───────────────────────────                            │
     │                           │                            │
     │  7. Make Payment          │                            │
     │───────────────────────────┼────────────────────────────│
     │                           │                            │
     │                      [Database]                        │
     │                           │                            │
```

---

# 9. Process Diagrams

## 9.1 Process Flow Diagram

**Place the Process Flow Diagram here**

### 9.1.1 Appointment Booking Process

```
┌──────────────┐
│    Start     │
└──────┬───────┘
       ▼
┌──────────────┐
│  Login as    │
│   Patient    │
└──────┬───────┘
       ▼
┌──────────────┐
│  Select      │
│   Doctor     │
└──────┬───────┘
       ▼
┌──────────────┐
│  Select Date │
│   & Time     │
└──────┬───────┘
       ▼
┌──────────────┐
│   Enter      │
│  Symptoms    │
└──────┬───────┘
       ▼
┌──────────────┐
│   Select     │
│Payment Method│
└──────┬───────┘
       ▼
┌──────────────┐
│   Submit     │
│  Appointment │
└──────┬───────┘
       ▼
┌──────────────┐
│  Appointment │
│   Created    │
│  (Pending)   │
└──────┬───────┘
       ▼
┌──────────────┐
│    Doctor    │
│   Reviews    │
└──────┬───────┘
       ▼
  ┌────┴────┐
  │ Approved │
  │   or    │
  │Rejected │
  └────┬────┘
       ▼
┌──────────────┐
│     End      │
└──────────────┘
```

## 9.2 Activity Diagram

**Place the Activity Diagram here**

### Patient Booking Activity Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Patient Booking Activity                   │
└─────────────────────────────────────────────────────────────┘

[Start] ──► [Login] ──► [View Doctor List]
                              │
                              ▼
                    [Select Doctor]
                              │
                              ▼
                    [Check Availability]
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        [Available]      [Not Available]   [Cancel]
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    [Select Date/Time]
                              │
                              ▼
                    [Enter Symptoms]
                              │
                              ▼
                    [Upload Reports]
                              │
                              ▼
                    [Select Payment]
                              │
                              ▼
                    [Confirm Booking]
                              │
                              ▼
                    [Pending Approval]
                              │
                              ▼
                         [End]
```

---

# 10. Use Cases

## 10.1 Use Case Diagram

**Place the Use Case Diagram here**

```
┌─────────────────────────────────────────────────────────────────┐
│                      USE CASE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────┐
        │  Patient │
        └────┬─────┘
             │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│ Book  │ │ View  │ │ Upload│
│ Appt  │ │History│ │Report │
└───────┘ └───────┘ └───────┘
    │         │         │
    │         │         │
    ▼         ▼         ▼
┌─────────────────────────────┐
│       Make Payment          │
└─────────────────────────────┘

        ┌──────────┐
        │  Doctor  │
        └────┬─────┘
             │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│ View  │ │Manage │ │ Add   │
│ Appts │ │ Appt  │ │ Notes │
└───────┘ └───────┘ └───────┘

        ┌──────────┐
        │  Admin   │
        └────┬─────┘
             │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│Manage │ │View   │ │ System│
│Users  │ │Reports│ │Settings│
└───────┘ └───────┘ └───────┘
```

## 10.2 Detailed Use Cases

### Use Case 1: Patient Registration

| Attribute | Description |
|-----------|-------------|
| UC-001 | Patient Registration |
| Actor | Unregistered User |
| Pre-condition | User is on the registration page |
| Basic Flow | 1. User enters username, email, password<br>2. User enters personal details (name, phone, DOB)<br>3. User submits registration form<br>4. System validates and creates account |
| Post-condition | Patient account is created successfully |
| Alternative Flow | If email/username exists, display error message |

### Use Case 2: Appointment Booking

| Attribute | Description |
|-----------|-------------|
| UC-002 | Book Appointment |
| Actor | Patient |
| Pre-condition | Patient is logged in |
| Basic Flow | 1. Patient views list of doctors<br>2. Patient selects doctor<br>3. Patient selects date and time<br>4. Patient describes symptoms<br>5. Patient selects payment method<br>6. Patient submits booking |
| Post-condition | Appointment created with "Pending" status |
| Alternative Flow | If time slot unavailable, show error |

### Use Case 3: Appointment Management (Doctor)

| Attribute | Description |
|-----------|-------------|
| UC-003 | Manage Appointments |
| Actor | Doctor |
| Pre-condition | Doctor is logged in |
| Basic Flow | 1. Doctor views appointments<br>2. Doctor selects action (Approve/Complete/Cancel/Reschedule)<br>3. Doctor adds notes<br>4. System updates appointment status |
| Post-condition | Appointment status updated |

### Use Case 4: User Management (Admin)

| Attribute | Description |
|-----------|-------------|
| UC-004 | Manage Users |
| Actor | Administrator |
| Pre-condition | Admin is logged in |
| Basic Flow | 1. Admin views all users<br>2. Admin can create/edit/deactivate users<br>3. Admin can assign roles |
| Post-condition | User records updated |

---

# 11. Data Models

## 11.1 Class Diagram

**Place the Class Diagram here**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLASS DIAGRAM                                    │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│         User            │
├─────────────────────────┤
│ - id: Integer           │
│ - username: String      │
│ - email: String         │
│ - password: String      │
│ - role: Enum            │
│ - phone_number: String  │
│ - profile_picture: Image│
│ - address: Text         │
│ - date_of_birth: Date   │
├─────────────────────────┤
│ + __str__()             │
└───────────┬─────────────┘
            │
            │ 1:1
            ▼
┌─────────────────────────┐
│    DoctorProfile        │
├─────────────────────────┤
│ - user: User            │
│ - specialization: String │
│ - license_number: String│
│ - years_of_experience   │
│ - consultation_fee      │
│ - available_days       │
│ - available_time_start │
│ - available_time_end   │
│ - bio: Text             │
├─────────────────────────┤
│ + __str__()             │
└─────────────────────────┘


┌──────────────────────────────────┐
│        Appointment               │
├──────────────────────────────────┤
│ - id: Integer                   │
│ - patient: User                │
│ - doctor: User                  │
│ - appointment_date: Date       │
│ - appointment_time: Time        │
│ - status│ - symptoms:: Enum                  │
 Text               │
│ - notes: Text                  │
│ - payment_method: Enum          │
│ - payment_status: Enum          │
│ - payment_amount: Decimal      │
│ - payment_reference: String    │
│ - is_paid: Boolean              │
│ - report: File                 │
│ - report_description: Text      │
│ - created_at: DateTime         │
│ - updated_at: DateTime         │
├──────────────────────────────────┤
│ + __str__()                     │
└──────────────────────────────────┘
```

## 11.2 Data Dictionary

### User Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| username | String | Unique, Required | Username |
| email | String | Unique, Required | Email address |
| password | String | Required | Hashed password |
| role | Enum | Required | patient/doctor/admin |
| first_name | String | Optional | First name |
| last_name | String | Optional | Last name |
| phone_number | String | Optional | Phone number |
| profile_picture | Image | Optional | Profile image |
| address | Text | Optional | Address |
| date_of_birth | Date | Optional | Date of birth |
| is_active | Boolean | Default: True | Account status |

### DoctorProfile Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| user_id | Integer | FK, Unique | Foreign key to User |
| specialization | String | Required | Medical specialization |
| license_number | String | Required | Medical license number |
| years_of_experience | Integer | Default: 0 | Years of experience |
| consultation_fee | Decimal | Default: 0 | Consultation fee |
| available_days | String | Optional | Available days (comma-separated) |
| available_time_start | Time | Optional | Start time |
| available_time_end | Time | Optional | End time |
| bio | Text | Optional | Doctor biography |

### Appointment Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| patient_id | Integer | FK | Foreign key to User |
| doctor_id | Integer | FK | Foreign key to User |
| appointment_date | Date | Required | Appointment date |
| appointment_time | Time | Required | Appointment time |
| status | Enum | Default: pending | Appointment status |
| symptoms | Text | Optional | Patient symptoms |
| notes | Text | Optional | Doctor notes |
| payment_method | Enum | Optional | Payment method |
| payment_status | Enum | Default: pending | Payment status |
| payment_amount | Decimal | Default: 0 | Payment amount |
| payment_reference | String | Optional | Payment reference |
| card_last_four | String | Optional | Card last 4 digits |
| is_paid | Boolean | Default: False | Payment status flag |
| report | File | Optional | Medical report file |
| report_description | Text | Optional | Report description |
| created_at | DateTime | Auto | Creation timestamp |
| updated_at | DateTime | Auto | Last update timestamp |

---

# 12. Functional Requirements

## 12.1 Authentication Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Users can register with username, email, and password | High |
| FR-002 | Users can login with username and password | High |
| FR-003 | System uses JWT for authentication | High |
| FR-004 | Users can view and update their profile | High |
| FR-005 | Password must be securely hashed | High |

## 12.2 User Management Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-006 | Admin can view all users | High |
| FR-007 | Admin can create new users (including doctors) | High |
| FR-008 | Admin can edit user details and roles | High |
| FR-009 | Admin can deactivate/reactivate user accounts | Medium |
| FR-010 | Patients can view doctor profiles | High |
| FR-011 | Doctors can manage their profiles | High |

## 12.3 Appointment Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-012 | Patients can view list of available doctors | High |
| FR-013 | Patients can book appointments with selected doctor | High |
| FR-014 | Patients can select date and time for appointment | High |
| FR-015 | Patients can describe symptoms when booking | High |
| FR-016 | Patients can upload medical reports | Medium |
| FR-017 | Doctors receive appointment notifications | High |
| FR-018 | Doctors can approve appointments | High |
| FR-019 | Doctors can complete appointments | High |
| FR-020 | Doctors can cancel appointments | High |
| FR-021 | Doctors can reschedule appointments | High |
| FR-022 | Doctors can add notes to appointments | Medium |
| FR-023 | Patients can view their appointment history | High |
| FR-024 | Patients can cancel their appointments | Medium |

## 12.4 Payment Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-025 | Patients can select payment method | High |
| FR-026 | Support Cash payment method | High |
| FR-027 | Support Credit/Debit Card payment method | High |
| FR-028 | Support Insurance payment method | High |
| FR-029 | Support Mobile Money payment method | Medium |
| FR-030 | Support Bank Transfer payment method | Medium |
| FR-031 | System tracks payment status | High |
| FR-032 | Patients can view payment history | Medium |

## 12.5 Dashboard Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-033 | Admin dashboard shows total users, doctors, patients | High |
| FR-034 | Admin dashboard shows total appointments | High |
| FR-035 | Doctor dashboard shows today's appointments | High |
| FR-036 | Doctor dashboard shows pending appointments | High |
| FR-037 | Patient dashboard shows upcoming appointments | High |
| FR-038 | Patient dashboard shows appointment history | High |

---

# 13. Non-Functional Requirements

## 13.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page load time | < 3 seconds |
| NFR-002 | API response time | < 1 second |
| NFR-003 | Support concurrent users | 100+ users |

## 13.2 Security

| ID | Requirement |
|----|-------------|
| NFR-004 | Passwords must be hashed using strong algorithms (PBKDF2) |
| NFR-005 | JWT tokens must expire after configured time |
| NFR-006 | Role-based access control must be implemented |
| NFR-007 | All sensitive data must be encrypted |
| NFR-008 | Input validation to prevent SQL injection and XSS |

## 13.3 Usability

| ID | Requirement |
|----|-------------|
| NFR-009 | User interface must be intuitive |
| NFR-010 | System must be accessible via modern browsers |
| NFR-011 | Responsive design for different screen sizes |

## 13.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-012 | System must handle errors gracefully |
| NFR-013 | Data must be validated before processing |
| NFR-014 | Appropriate error messages displayed to users |

## 13.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-015 | Code must follow clean code practices |
| NFR-016 | Modular architecture for easy updates |
| NFR-017 | Proper documentation for code and APIs |

---

# 14. Deployment

## 14.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   Internet/WEB  │
                    │     Server      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Nginx/Apache   │
                    │   (Reverse      │
                    │    Proxy)       │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │   Frontend       │         │   Backend        │
    │   (React.js)     │         │   (Django)       │
    │   Port 5173      │         │   Port 8000      │
    └──────────────────┘         └────────┬─────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │   Database      │
                                 │  (PostgreSQL)   │
                                 │   Port 5432     │
                                 └─────────────────┘
```

## 14.2 System Requirements

### Development Environment
- Node.js 18+
- Python 3.10+
- Django 4.2+
- SQLite (for development)

### Production Environment
- Node.js 18+
- Python 3.10+
- Django 4.2+
- PostgreSQL 14+
- Nginx
- Gunicorn

## 14.3 Installation Steps

### Backend Setup
```
bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup
```
bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 14.4 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DEBUG | Debug mode | True/False |
| SECRET_KEY | Django secret key | random-string |
| DATABASE_URL | Database connection | postgresql://user:pass@localhost:5432/db |
| ALLOWED_HOSTS | Allowed hosts | localhost,127.0.0.1 |

---

# 15. Appendices

## 15.1 Glossary

| Term | Definition |
|------|------------|
| JWT | JSON Web Token - a compact URL-safe means of representing claims |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete operations |
| ERD | Entity Relationship Diagram |
| UI | User Interface |

## 15.2 References

1. Django Documentation: https://docs.djangoproject.com/
2. React Documentation: https://react.dev/
3. Material UI: https://mui.com/
4. Django REST Framework: https://www.django-rest-framework.org/

## 15.3 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | [Date] | [Author] | Initial document creation |

---

## Placeholders for Diagrams

### ================================================================
### DIAGRAM 1: USE CASE DIAGRAM
### ================================================================

[INSERT USE CASE DIAGRAM HERE]

This diagram should show:
- All actors: Patient, Doctor, Admin
- All use cases: Register, Login, Book Appointment, Manage Appointment, View Reports, etc.
- Relationships between actors and use cases
- System boundaries

Example tools: Lucidchart, Draw.io, Microsoft Visio

--------------------------------------------------------------------
### DIAGRAM 2: CLASS DIAGRAM
### ================================================================

[INSERT CLASS DIAGRAM HERE]

This diagram should show:
- User class with all attributes
- DoctorProfile class with all attributes  
- Appointment class with all attributes
- Relationships: User (1:1) DoctorProfile, User (1:N) Appointment
- Methods for each class

--------------------------------------------------------------------
### DIAGRAM 3: SEQUENCE DIAGRAM
### ================================================================

[INSERT SEQUENCE DIAGRAM HERE]

Recommended sequence diagrams:
1. Patient Booking Sequence
   - Patient → System: Login
   - Patient → System: View Doctors
   - Patient → System: Select Doctor
   - Patient → System: Book Appointment
   - System → Doctor: Send Notification
   - Doctor → System: Approve/Reject
   - System → Patient: Send Status Update

2. Payment Processing Sequence
   - Patient → System: Select Payment Method
   - System → Payment Gateway: Process Payment
   - Payment Gateway → System: Payment Confirmation
   - System → Database: Update Payment Status

--------------------------------------------------------------------
### DIAGRAM 4: ACTIVITY DIAGRAM
### ================================================================

[INSERT ACTIVITY DIAGRAM HERE]

Recommended activity diagrams:
1. Appointment Booking Activity
2. Appointment Management Activity (Doctor)
3. Payment Processing Activity

--------------------------------------------------------------------
### DIAGRAM 5: ENTITY RELATIONSHIP DIAGRAM (ERD)
### ================================================================

[INSERT ERD HERE]

This diagram should show:
- User entity with all attributes
- DoctorProfile entity with all attributes
- Appointment entity with all attributes
- Relationships with cardinalities
- Primary keys and foreign keys

--------------------------------------------------------------------
### DIAGRAM 6: STATE CHART DIAGRAM
### ================================================================

[INSERT STATE CHART DIAGRAM HERE]

This diagram should show:
- Appointment State Transitions:
  * Pending → Approved
  * Pending → Cancelled
  * Approved → Completed
  * Approved → Cancelled
  * Approved → Rescheduled
  * Rescheduled → Approved
  
- Payment State Transitions:
  * Pending → Paid
  * Pending → Failed
  * Paid → Refunded

---

**Document Prepared By:** [Student Name]
**Student Registration:** [Registration Number]
**Institution:** The State University of Zanzibar
**Date:** [Submission Date]

---

*End of Software Requirement Document*
