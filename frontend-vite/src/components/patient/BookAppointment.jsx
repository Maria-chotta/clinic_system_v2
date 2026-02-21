import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, CreditCard, Receipt, AttachMoney } from '@mui/icons-material';
import api from '../../services/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
  
  // Get pre-selected doctor from URL query parameter
  const preselectedDoctor = searchParams.get('doctor') || '';
  
  const [formData, setFormData] = useState({
    doctor: preselectedDoctor,
    appointment_date: null,
    appointment_time: null,
    symptoms: '',
    payment_method: 'cash',
    payment_amount: '',
    card_last_four: '',
    report_description: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch available doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await api.get('/accounts/doctors/');
        setDoctors(response.data);
        
        // If doctor is pre-selected, set the info
        if (preselectedDoctor) {
          const doctor = response.data.find(d => d.id === parseInt(preselectedDoctor));
          if (doctor) {
            setSelectedDoctorInfo(doctor);
            setFormData(prev => ({
              ...prev,
              payment_amount: doctor.consultation_fee || ''
            }));
          }
        }
      } catch (error) {
        toast.error('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [preselectedDoctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id === doctorId);
    
    setFormData((prev) => ({ 
      ...prev, 
      doctor: doctorId,
      payment_amount: doctor?.consultation_fee || ''
    }));
    setSelectedDoctorInfo(doctor || null);
    
    if (errors.doctor) {
      setErrors((prev) => ({ ...prev, doctor: '' }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, appointment_date: date }));
    if (errors.appointment_date) {
      setErrors((prev) => ({ ...prev, appointment_date: '' }));
    }
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, appointment_time: time }));
    if (errors.appointment_time) {
      setErrors((prev) => ({ ...prev, appointment_time: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctor) newErrors.doctor = 'Please select a doctor';
    if (!formData.appointment_date) newErrors.appointment_date = 'Please select a date';
    if (!formData.appointment_time) newErrors.appointment_time = 'Please select a time';
    if (!formData.symptoms.trim()) newErrors.symptoms = 'Please describe your symptoms';
    
    // Payment validation
    if (!formData.payment_method) newErrors.payment_method = 'Please select payment method';
    if (formData.payment_method === 'card' && !formData.card_last_four) {
      newErrors.card_last_four = 'Please enter card last 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('doctor', formData.doctor);
      formDataToSend.append('appointment_date', formData.appointment_date.toISOString().split('T')[0]);
      formDataToSend.append('appointment_time', formData.appointment_time.toTimeString().slice(0, 5));
      formDataToSend.append('symptoms', formData.symptoms);
      formDataToSend.append('payment_method', formData.payment_method);
      formDataToSend.append('payment_amount', formData.payment_amount || 0);
      formDataToSend.append('card_last_four', formData.card_last_four || '');
      formDataToSend.append('report_description', formData.report_description || '');
      
      // Append file if selected
      if (selectedFile) {
        formDataToSend.append('report', selectedFile);
      }

      await api.post('/appointments/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Booking error:', error);
      
      // Handle DRF validation errors
      if (error.response?.data) {
        const responseData = error.response.data;
        
        // Check for non-field errors
        if (responseData.non_field_errors) {
          toast.error(responseData.non_field_errors[0]);
        } 
        // Check for field-specific errors
        else {
          const fieldErrors = Object.entries(responseData).map(
            ([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          );
          toast.error(fieldErrors.join(' | '));
        }
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Book an Appointment
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Doctor Selection with Fee Info */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.doctor} required>
                  <InputLabel>Select Doctor</InputLabel>
                  <Select
                    name="doctor"
                    value={formData.doctor}
                    label="Select Doctor"
                    onChange={handleDoctorChange}
                  >
                    {doctors.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            Dr. {doc.first_name} {doc.last_name} 
                            {doc.specialization ? ` - ${doc.specialization}` : ''}
                          </Box>
                          <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ${doc.consultation_fee || 0}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.doctor && <Typography color="error" variant="caption">{errors.doctor}</Typography>}
                </FormControl>
              </Grid>

              {/* Show Doctor Info Card when selected */}
              {selectedDoctorInfo && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'rgba(0, 137, 123, 0.04)' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Doctor
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            Dr. {selectedDoctorInfo.first_name} {selectedDoctorInfo.last_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Specialization
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {selectedDoctorInfo.specialization || 'General Physician'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Consultation Fee
                          </Typography>
                          <Typography variant="body1" fontWeight="600" color="primary.main">
                            ${selectedDoctorInfo.consultation_fee || 0}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Date Picker */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Appointment Date"
                  value={formData.appointment_date}
                  onChange={handleDateChange}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.appointment_date,
                      helperText: errors.appointment_date,
                    },
                  }}
                />
              </Grid>

              {/* Time Picker */}
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Appointment Time"
                  value={formData.appointment_time}
                  onChange={handleTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.appointment_time,
                      helperText: errors.appointment_time,
                    },
                  }}
                />
              </Grid>

              {/* Symptoms */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Symptoms / Reason for visit"
                  name="symptoms"
                  multiline
                  rows={4}
                  value={formData.symptoms}
                  onChange={handleChange}
                  error={!!errors.symptoms}
                  helperText={errors.symptoms}
                  placeholder="Please describe your symptoms or reason for the appointment"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard color="primary" />
                    <Typography variant="subtitle1" fontWeight="600">Payment Information</Typography>
                  </Box>
                </Divider>
              </Grid>

              {/* Payment Method */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    label="Payment Method"
                    onChange={handleChange}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                    <MenuItem value="insurance">Insurance</MenuItem>
                    <MenuItem value="momo">Mobile Money</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Payment Amount - Pre-filled with doctor's fee */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Amount"
                  name="payment_amount"
                  type="number"
                  value={formData.payment_amount}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="This is the consultation fee for the selected doctor"
                />
              </Grid>

              {/* Card Last Four (only show for card payment) */}
              {formData.payment_method === 'card' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Card Last 4 Digits"
                    name="card_last_four"
                    value={formData.card_last_four}
                    onChange={handleChange}
                    inputProps={{ maxLength: 4 }}
                    error={!!errors.card_last_four}
                    helperText={errors.card_last_four || 'Last 4 digits of your card'}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt color="primary" />
                    <Typography variant="subtitle1" fontWeight="600">Medical Reports (Optional)</Typography>
                  </Box>
                </Divider>
              </Grid>

              {/* Report Upload */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(0, 137, 123, 0.04)',
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={handleFileChange}
                    hidden
                  />
                  <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                  <Typography variant="body1" color="textSecondary">
                    {selectedFile ? selectedFile.name : 'Click to upload medical reports (PDF, JPEG, PNG)'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Max file size: 10MB
                  </Typography>
                </Box>
              </Grid>

              {/* Report Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Description"
                  name="report_description"
                  multiline
                  rows={2}
                  value={formData.report_description}
                  onChange={handleChange}
                  placeholder="Describe any reports you are uploading"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting || loading}
                  sx={{ py: 1.5 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Book Appointment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default BookAppointment;
