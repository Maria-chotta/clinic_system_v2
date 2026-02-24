import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  FormControl,
  Select,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Person as PersonIcon,
  LocalHospital,
  Settings,
  Logout,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, languages } from '../../contexts/LanguageContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleDashboard = () => {
    const path = getDashboardPath();
    navigate(path);
    handleClose();
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'doctor':
        return '/doctor';
      case 'admin':
        return '/admin';
      default:
        return '/patient';
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 2px 12px rgba(0, 137, 123, 0.15)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Hospital Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            mr: 2,
          }}
          onClick={() => navigate(getDashboardPath())}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              mr: 1.5,
            }}
          >
            <LocalHospital sx={{ fontSize: 24 }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                lineHeight: 1.2,
                fontSize: '1.1rem',
              }}
            >
              City Medical Center
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8,
                fontSize: '0.7rem',
                lineHeight: 1,
              }}
            >
              Appointment System
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            display: { xs: 'block', sm: 'none' },
          }}
          onClick={() => navigate(getDashboardPath())}
        >
          Clinic
        </Typography>

        {user ? (
          <Box>
            <Box
              onClick={handleMenu}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 1.5, 
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 500,
                }}
              >
                {user.first_name} {user.last_name}
              </Typography>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                {user.profile_picture ? (
                  <Avatar 
                    src={user.profile_picture} 
                    sx={{ width: 36, height: 36 }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: 'secondary.main',
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                )}
              </IconButton>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <MenuItem disabled>
                <Box sx={{ py: 0.5 }}>
                  <Typography variant="body2" fontWeight="600">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                    {user.role}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                {t('dashboard')}
              </MenuItem>
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                {t('profile')}
              </MenuItem>
              
              {/* Language Selector in Menu */}
              <Divider />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {t('language')}
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                {t('logout')}
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
            <Button 
              color="secondary" 
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                boxShadow: '0 2px 8px rgba(67, 160, 71, 0.4)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(67, 160, 71, 0.5)',
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
