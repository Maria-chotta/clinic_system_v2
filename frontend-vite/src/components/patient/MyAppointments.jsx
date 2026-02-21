import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Info,
  Download,
  CreditCard,
  Receipt,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const toggleRow = (id) => {
    setOpenRows({
      ...openRows,
      [id]: !openRows[id],
    });
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  const downloadReport = (reportUrl) => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View and manage your appointments
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <React.Fragment key={appointment.id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(appointment.id)}>
                      {openRows[appointment.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    Dr. {appointment.doctor_details?.first_name} {appointment.doctor_details?.last_name}
                  </TableCell>
                  <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard fontSize="small" color="action" />
                      <Chip
                        label={appointment.payment_status || 'pending'}
                        color={getPaymentStatusColor(appointment.payment_status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => toggleRow(appointment.id)}>
                      <Info />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openRows[appointment.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Appointment Details
                        </Typography>
                        <Grid container spacing={2}>
                          {/* Symptoms */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                  Symptoms
                                </Typography>
                                <Typography variant="body2">
                                  {appointment.symptoms || 'No symptoms provided'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          {/* Doctor's Notes */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                  Doctor's Notes
                                </Typography>
                                <Typography variant="body2">
                                  {appointment.notes || 'No notes yet'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Payment Info */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <CreditCard color="primary" />
                                  <Typography color="textSecondary">
                                    Payment Information
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  <strong>Method:</strong> {appointment.payment_method || 'Not specified'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Amount:</strong> ${appointment.payment_amount || 0}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Status:</strong> {appointment.payment_status || 'pending'}
                                </Typography>
                                {appointment.card_last_four && (
                                  <Typography variant="body2">
                                    <strong>Card:</strong> **** {appointment.card_last_four}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Medical Report */}
                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Receipt color="primary" />
                                  <Typography color="textSecondary">
                                    Medical Report
                                  </Typography>
                                </Box>
                                {appointment.report_url || appointment.report ? (
                                  <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      {appointment.report_description || 'Medical report attached'}
                                    </Typography>
                                    <Button
                                      variant="outlined"
                                      startIcon={<Download />}
                                      size="small"
                                      onClick={() => downloadReport(appointment.report_url)}
                                    >
                                      Download Report
                                    </Button>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    No report uploaded yet
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary" py={3}>
                    No appointments found
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/patient/book-appointment')}
                    sx={{ mb: 2 }}
                  >
                    Book Your First Appointment
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyAppointments;
