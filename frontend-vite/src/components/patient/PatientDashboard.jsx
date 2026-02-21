import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Skeleton,
} from '@mui/material';
import {
  CalendarToday,
  BookOnline,
  AccessTime,
  Person,
  LocalHospital,
  ArrowForward,
  Notifications,
  HealthAndSafety,
  Star,
  MedicalServices,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch doctors
      const doctorsResponse = await api.get('/accounts/doctors/');
      setDoctors(doctorsResponse.data);

      // Fetch patient's appointments
      const appointmentsResponse = await api.get('/appointments/');
      setAppointments(appointmentsResponse.data.slice(0, 3)); // Only show first 3
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId) => {
    // Navigate to book appointment with doctor pre-selected
    navigate(`/patient/book-appointment?doctor=${doctorId}`);
  };

  const quickActions = [
    { 
      text: 'Book Appointment', 
      icon: <BookOnline />, 
      path: '/patient/book-appointment',
      color: '#00897b'
    },
    { 
      text: 'My Appointments', 
      icon: <CalendarToday />, 
      path: '/patient/appointments',
      color: '#43a047'
    },
    { 
      text: 'My Profile', 
      icon: <Person />, 
      path: '/profile',
      color: '#1976d2'
    },
  ];

  const healthTips = [
    'Stay hydrated - drink at least 8 glasses of water daily',
    'Get regular check-ups to maintain good health',
    'Exercise for at least 30 minutes every day',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate avatar color based on doctor name
  const getAvatarColor = (name) => {
    const colors = ['#00897b', '#43a047', '#1976d2', '#ed6c02', '#9c27b0', '#d32f2f'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" color="primary" gutterBottom>
          Welcome back, {user?.first_name || 'Patient'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's an overview of your health dashboard and upcoming appointments.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.08) 0%, rgba(67, 160, 71, 0.08) 100%)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={12} sm={4} key={action.text}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 137, 123, 0.2)',
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: action.color,
                          color: 'white',
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {action.text}
                        </Typography>
                      </Box>
                      <ArrowForward color="action" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Our Doctors Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Our Expert Doctors
                </Typography>
              </Box>
              <Button 
                size="small" 
                onClick={() => navigate('/patient/book-appointment')}
                sx={{ color: 'primary.main' }}
              >
                Book Now
              </Button>
            </Box>
            
            {loading ? (
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
                        <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : doctors.length > 0 ? (
              <Grid container spacing={2}>
                {doctors.slice(0, 4).map((doctor) => (
                  <Grid item xs={12} sm={6} md={3} key={doctor.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 137, 123, 0.2)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Avatar
                          src={doctor.profile_picture}
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: getAvatarColor(doctor.first_name + doctor.last_name),
                            fontSize: 28,
                            fontWeight: 600,
                          }}
                        >
                          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="600">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </Typography>
                        <Chip 
                          label={doctor.specialization || 'General Physician'} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mt: 1, mb: 1 }}
                        />
                        {/* Show consultation fee */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                          <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" fontWeight="600" color="success.main">
                            ${doctor.consultation_fee || 0}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            consultation
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} sx={{ fontSize: 16, color: '#ffc107' }} />
                          ))}
                        </Box>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          Book Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No doctors available at the moment
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                My Upcoming Appointments
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/patient/appointments')}
                sx={{ color: 'primary.main' }}
              >
                View All
              </Button>
            </Box>
            
            {loading ? (
              <Box>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(0, 137, 123, 0.04)' }}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                ))}
              </Box>
            ) : appointments.length > 0 ? (
              <List>
                {appointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem
                      sx={{
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: 'rgba(0, 137, 123, 0.04)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 137, 123, 0.08)',
                        },
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarColor(appointment.doctor_details?.first_name || ''), 
                          mr: 2,
                          width: 50,
                          height: 50,
                        }}
                      >
                        <LocalHospital />
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="600">
                            Dr. {appointment.doctor_details?.first_name || 'Unknown'} {appointment.doctor_details?.last_name || ''}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="textSecondary">
                              {appointment.doctor_details?.specialization || 'General Physician'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 16, color: 'textSecondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {formatDate(appointment.appointment_date)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 16, color: 'textSecondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {appointment.appointment_time}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="body2" color="success.main" fontWeight="600">
                                  ${appointment.payment_amount || 0}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                      <Chip 
                        label={appointment.status} 
                        color={getStatusColor(appointment.status)} 
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </ListItem>
                    {index < appointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No upcoming appointments
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/patient/book-appointment')}
                >
                  Book an Appointment
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Health Tips & Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <HealthAndSafety color="primary" />
              <Typography variant="h6" fontWeight="600">
                Health Tips
              </Typography>
            </Box>
            <List>
              {healthTips.map((tip, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={tip}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'textSecondary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Notifications color="primary" />
              <Typography variant="h6" fontWeight="600">
                Notifications
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              No new notifications
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
