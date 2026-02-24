import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    save: 'Save',
    cancel: 'Cancel',
    settings: 'Settings',
    language: 'Language',
    role: 'Role',
    // Navigation
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    profile: 'Profile',
    logout: 'Logout',
    // Patient
    bookAppointment: 'Book Appointment',
    myAppointments: 'My Appointments',
    // Doctor
    manageAppointments: 'Manage Appointments',
    // Admin
    manageUsers: 'Manage Users',
    // Profile
    myProfile: 'My Profile',
    updateProfile: 'Update Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    address: 'Address',
    // Messages
    profileUpdated: 'Profile updated successfully',
    profileUpdateFailed: 'Failed to update profile',
  },
  es: {
    // Common
    welcome: 'Bienvenido',
    save: 'Guardar',
    cancel: 'Cancelar',
    settings: 'Configuracion',
    language: 'Idioma',
    // Navigation
    dashboard: 'Panel',
    appointments: 'Citas',
    profile: 'Perfil',
    logout: 'Cerrar Sesion',
    // Patient
    bookAppointment: 'Reservar Cita',
    myAppointments: 'Mis Citas',
    // Doctor
    manageAppointments: 'Gestionar Citas',
    // Admin
    manageUsers: 'Gestionar Usuarios',
    // Profile
    myProfile: 'Mi Perfil',
    updateProfile: 'Actualizar Perfil',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo',
    phoneNumber: 'Telefono',
    address: 'Direccion',
    // Messages
    profileUpdated: 'Perfil actualizado correctamente',
    profileUpdateFailed: 'Error al actualizar el perfil',
  },
  fr: {
    // Common
    welcome: 'Bienvenue',
    save: 'Enregistrer',
    cancel: 'Annuler',
    settings: 'Parametres',
    language: 'Langue',
    // Navigation
    dashboard: 'Tableau de bord',
    appointments: 'Rendez-vous',
    profile: 'Profil',
    logout: 'Deconnexion',
    // Patient
    bookAppointment: 'Prendre Rendez-vous',
    myAppointments: 'Mes Rendez-vous',
    // Doctor
    manageAppointments: 'Gerer les Rendez-vous',
    // Admin
    manageUsers: 'Gerer les Utilisateurs',
    // Profile
    myProfile: 'Mon Profil',
    updateProfile: 'Mettre a jour le Profil',
    firstName: 'Prenom',
    lastName: 'Nom',
    email: 'Email',
    phoneNumber: 'Telephone',
    address: 'Adresse',
    // Messages
    profileUpdated: 'Profil mis a jour avec succes',
    profileUpdateFailed: 'Echec de la mise a jour du profil',
  },
  de: {
    // Common
    welcome: 'Willkommen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    settings: 'Einstellungen',
    language: 'Sprache',
    // Navigation
    dashboard: 'Dashboard',
    appointments: 'Termine',
    profile: 'Profil',
    logout: 'Abmelden',
    // Patient
    bookAppointment: 'Termin Buchen',
    myAppointments: 'Meine Termine',
    // Doctor
    manageAppointments: 'Termine Verwalten',
    // Admin
    manageUsers: 'Benutzer Verwalten',
    // Profile
    myProfile: 'Mein Profil',
    updateProfile: 'Profil Aktualisieren',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phoneNumber: 'Telefon',
    address: 'Adresse',
    // Messages
    profileUpdated: 'Profil erfolgreich aktualisiert',
    profileUpdateFailed: 'Profilaktualisierung fehlgeschlagen',
  },
  sw: {
    // Common
    welcome: 'Karibu',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    settings: 'Mipangilio',
    language: 'Lugha',
    role: 'Jukumu',
    // Navigation
    dashboard: 'Dashibodi',
    appointments: 'Miadi',
    profile: 'Wasifu',
    logout: 'Toka',
    // Patient
    bookAppointment: 'Panga Kipenzi',
    myAppointments: 'Miadi Yangu',
    // Doctor
    manageAppointments: 'Dhibiti Miadi',
    // Admin
    manageUsers: 'Dhibiti Watumiaji',
    // Profile
    myProfile: 'Wasifu Wangu',
    updateProfile: 'Sasisha Wasifu',
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    email: 'Barua Pepe',
    phoneNumber: 'Nambari ya Simu',
    address: 'Anwani',
    // Messages
    profileUpdated: 'Wasifu umesasishwa vizuri',
    profileUpdateFailed: 'Imeshindwa kusasisha wasifu',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espanol' },
  { code: 'fr', name: 'Francais' },
  { code: 'de', name: 'Deutsch' },
  { code: 'sw', name: 'Kiswahili' },
];
