import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  EventAvailable,
  CheckCircle,
  Cancel,
  Schedule,
  MoreVert,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    total: 0,
    completed: 0,
  });
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, tabValue]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data);
      
      // Calculate stats
      const today = new Date().toDateString();
      const calculatedStats = response.data.reduce(
        (acc, app) => {
          acc.total++;
          if (new Date(app.appointment_date).toDateString() === today) {
            acc.today++;
          }
          if (app.status === 'pending') acc.pending++;
          if (app.status === 'completed') acc.completed++;
          return acc;
        },
        { today: 0, pending: 0, total: 0, completed: 0 }
      );
      
      setStats(calculatedStats);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const filterAppointments = () => {
    const today = new Date().toDateString();
    let filtered = [];
    
    switch (tabValue) {
      case 0: // Today
        filtered = appointments.filter(
          (app) => new Date(app.appointment_date).toDateString() === today
        );
        break;
      case 1: // Upcoming
        filtered = appointments.filter(
          (app) => 
            new Date(app.appointment_date) > new Date() && 
            ['pending', 'approved'].includes(app.status)
        );
        break;
      case 2: // Pending
        filtered = appointments.filter((app) => app.status === 'pending');
        break;
      case 3: // Completed
        filtered = appointments.filter((app) => app.status === 'completed');
        break;
      default:
        filtered = appointments;
    }
    
    setFilteredAppointments(filtered);
  };

  const handleMenuClick = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNotes('');
    setSelectedAppointment(null);
    setDialogAction('');
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;

    try {
      let newStatus = '';
      let updateData = {};
      
      switch (dialogAction) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'complete':
          newStatus = 'completed';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        case 'reschedule':
          newStatus = 'rescheduled';
          break;
        default:
          newStatus = selectedAppointment.status;
      }

      updateData = {
        status: newStatus,
      };

      // Only add notes if they were provided
      if (notes.trim()) {
        updateData.notes = notes;
      }

      await api.patch(`/appointments/${selectedAppointment.id}/`, updateData);

      toast.success(`Appointment ${dialogAction}d successfully`);
      fetchAppointments();
      handleDialogClose();
    } catch (error) {
      toast.error(`Failed to ${dialogAction} appointment`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
          color: 'white',
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{ width: 60, height: 60, bgcolor: 'white', color: '#2e7d32' }}
            >
              {user?.first_name?.[0] || ''}
              {user?.last_name?.[0] || ''}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4">
              Dr. {user?.first_name || ''} {user?.last_name || ''}
            </Typography>
            <Typography variant="subtitle1">
              Manage your appointments and patient consultations
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Today's Appointments
                  </Typography>
                  <Typography variant="h4">{stats.today}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">{stats.pending}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02', width: 56, height: 56 }}>
                  <AccessTime />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4">{stats.completed}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#0288d1', width: 56, height: 56 }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Patients
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#9c27b0', width: 56, height: 56 }}>
                  <Person />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments Section */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Today" />
              <Tab label="Upcoming" />
              <Tab label="Pending" />
              <Tab label="Completed" />
            </Tabs>
          </Box>

          <List>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => handleMenuClick(e, appointment)}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={appointment.patient_details?.profile_picture}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography variant="subtitle1">
                            {appointment.patient_details?.first_name || 'Unknown'} {appointment.patient_details?.last_name || ''}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={getStatusColor(appointment.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textSecondary">
                            {formatDate(appointment.appointment_date)} at {appointment.appointment_time}
                          </Typography>
                          <br />
                          {appointment.symptoms && (
                            <Typography component="span" variant="body2">
                              Symptoms: {appointment.symptoms.substring(0, 100)}
                              {appointment.symptoms.length > 100 ? '...' : ''}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < filteredAppointments.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography color="textSecondary" align="center" py={3}>
                No appointments found
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('approve')}>
          <CheckCircle sx={{ mr: 1, color: '#2e7d32' }} /> Approve
        </MenuItem>
        <MenuItem onClick={() => handleAction('complete')}>
          <EventAvailable sx={{ mr: 1, color: '#0288d1' }} /> Mark Complete
        </MenuItem>
        <MenuItem onClick={() => handleAction('reschedule')}>
          <Schedule sx={{ mr: 1, color: '#ed6c02' }} /> Reschedule
        </MenuItem>
        <MenuItem onClick={() => handleAction('cancel')}>
          <Cancel sx={{ mr: 1, color: '#d32f2f' }} /> Cancel
        </MenuItem>
      </Menu>

      {/* Action Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogAction === 'approve' && 'Approve Appointment'}
          {dialogAction === 'complete' && 'Complete Appointment'}
          {dialogAction === 'cancel' && 'Cancel Appointment'}
          {dialogAction === 'reschedule' && 'Reschedule Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              <strong>Patient:</strong> {selectedAppointment?.patient_details?.first_name || 'Unknown'} {selectedAppointment?.patient_details?.last_name || ''}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {selectedAppointment && formatDate(selectedAppointment.appointment_date)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Time:</strong> {selectedAppointment?.appointment_time || ''}
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Add Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
              placeholder="Add any notes or comments about this appointment..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard;