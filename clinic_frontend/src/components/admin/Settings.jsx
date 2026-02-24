import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  TextField,
} from '@mui/material';
import {
  Language,
  Notifications,
  Security,
  Business,
  Save,
} from '@mui/icons-material';
import { useLanguage, languages } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    language: language,
    emailNotifications: true,
    smsNotifications: false,
    clinicName: 'City Medical Center',
    clinicAddress: '',
    clinicPhone: '',
  });

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setSettings({ ...settings, language: newLang });
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast.success(t('profileUpdated'));
    }, 1000);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('settings')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your application settings
        </Typography>
      </Paper>

      {/* Language Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Language sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h6">
            {t('language')} {t('settings')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('language')}</InputLabel>
              <Select
                value={settings.language}
                label={t('language')}
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Notification Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Notifications sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h6">
            Notification Settings
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSwitchChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleSwitchChange}
                  name="smsNotifications"
                  color="primary"
                />
              }
              label="SMS Notifications"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Clinic Settings - Admin Only */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Business sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h6">
            Clinic Information
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Clinic Name"
                name="clinicName"
                value={settings.clinicName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="clinicPhone"
                value={settings.clinicPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="clinicAddress"
                multiline
                rows={2}
                value={settings.clinicAddress}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Security Settings */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Security sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h6">
            Security Settings
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button variant="outlined" color="primary">
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : t('save')}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
