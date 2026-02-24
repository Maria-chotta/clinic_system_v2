import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Collapse,
} from '@mui/material';
import {
  Edit,
  CheckCircle,
  Cancel,
  CloudUpload,
  CreditCard,
  Receipt,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [openRows, setOpenRows] = useState({});
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

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

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setStatus(appointment.status);
    setNotes(appointment.notes || '');
    setPaymentStatus(appointment.payment_status || 'pending');
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/appointments/${selectedAppointment.id}/`, {
        status,
        notes,
        payment_status: paymentStatus,
      });
      toast.success('Appointment updated successfully');
      setOpenDialog(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const toggleRow = (id) => {
    setOpenRows({
      ...openRows,
      [id]: !openRows[id],
    });
  };

  const handleReportUpload = async (appointmentId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPEG, and PNG files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('report', file);

      await api.patch(`/appointments/${appointmentId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Report uploaded successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to upload report');
      console.error(error);
    } finally {
      setUploading(false);
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Appointments
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View and manage all your appointments
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Patient</TableCell>
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
                      {openRows[appointment.id] ? <Edit /> : <Edit />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {appointment.patient_details?.first_name} {appointment.patient_details?.last_name}
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
                    <Chip
                      label={appointment.payment_status || 'pending'}
                      color={getPaymentStatusColor(appointment.payment_status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit />
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
                          {/* Patient Info */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                  Patient Information
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Name:</strong> {appointment.patient_details?.first_name} {appointment.patient_details?.last_name}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Email:</strong> {appointment.patient_details?.email}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Phone:</strong> {appointment.patient_details?.phone_number || 'N/A'}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Symptoms & Notes */}
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                  Symptoms
                                </Typography>
                                <Typography variant="body2">
                                  {appointment.symptoms || 'No symptoms provided'}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom sx={{ mt: 2 }}>
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
                                      size="small"
                                      href={appointment.report_url || appointment.report}
                                      target="_blank"
                                    >
                                      View Report
                                    </Button>
                                  </Box>
                                ) : (
                                  <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                      No report uploaded yet
                                    </Typography>
                                    <input
                                      type="file"
                                      ref={fileInputRef}
                                      onChange={(e) => handleReportUpload(appointment.id, e)}
                                      accept=".pdf,.jpeg,.jpg,.png"
                                      style={{ display: 'none' }}
                                    />
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<CloudUpload />}
                                      onClick={() => fileInputRef.current?.click()}
                                      disabled={uploading}
                                    >
                                      {uploading ? 'Uploading...' : 'Upload Report'}
                                    </Button>
                                  </Box>
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
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="rescheduled">Rescheduled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                label="Payment Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAppointments;
