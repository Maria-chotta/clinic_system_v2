import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  People,
  CalendarToday,
  MedicalServices,
  Assessment,
  PersonAdd,
  LocalHospital,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all users
      const usersResponse = await api.get('/accounts/users/');
      const users = usersResponse.data;
      
      // Fetch all appointments
      const appointmentsResponse = await api.get('/appointments/');
      const appointments = appointmentsResponse.data;
      
      // Fetch doctors
      const doctorsResponse = await api.get('/accounts/doctors/');
      const doctorList = doctorsResponse.data;
      
      setStats({
        totalUsers: users.length,
        totalDoctors: doctorList.length,
        totalPatients: users.filter(u => u.role === 'patient').length,
        totalAppointments: appointments.length,
      });
      
      setDoctors(doctorList.slice(0, 5)); // Show top 5 doctors
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar color based on doctor name
  const getAvatarColor = (name) => {
    const colors = ['#00897b', '#43a047', '#1976d2', '#ed6c02', '#9c27b0', '#d32f2f'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Overview of the clinic management system
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Users
                    </Typography>
                    <Typography variant="h4">{stats.totalUsers}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                    <People />
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Doctors
                    </Typography>
                    <Typography variant="h4">{stats.totalDoctors}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                    <MedicalServices />
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Patients
                    </Typography>
                    <Typography variant="h4">{stats.totalPatients}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                    <People />
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Appointments
                    </Typography>
                    <Typography variant="h4">{stats.totalAppointments}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#9c27b0', width: 56, height: 56 }}>
                    <CalendarToday />
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Doctors Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Our Doctors
                </Typography>
              </Box>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/users')}
                sx={{ color: 'primary.main' }}
              >
                Manage All
              </Button>
            </Box>
            
            {loading ? (
              <Box>
                {[1, 2, 3, 4].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2 }}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : doctors.length > 0 ? (
              <List>
                {doctors.map((doctor) => (
                  <ListItem
                    key={doctor.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: 'rgba(0, 137, 123, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 137, 123, 0.08)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={doctor.profile_picture}
                        sx={{ 
                          bgcolor: getAvatarColor(doctor.first_name + doctor.last_name),
                          width: 50,
                          height: 50,
                        }}
                      >
                        {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          {doctor.specialization || 'General Physician'} • {doctor.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No doctors registered yet
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/register')}
                >
                  Add Doctor
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<PersonAdd />}
                fullWidth
                onClick={() => navigate('/register')}
              >
                Add New User
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<People />}
                fullWidth
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<CalendarToday />}
                fullWidth
              >
                View All Appointments
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
