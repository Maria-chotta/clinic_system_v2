import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  CalendarToday,
  Person,
  BookOnline,
  People,
  Settings,
  LocalHospital,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth = 260 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'patient':
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: '/patient' },
          { text: 'Book Appointment', icon: <BookOnline />, path: '/patient/book-appointment' },
          { text: 'My Appointments', icon: <CalendarToday />, path: '/patient/appointments' },
          { text: 'Profile', icon: <Person />, path: '/profile' },
        ];
      case 'doctor':
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: '/doctor' },
          { text: 'Appointments', icon: <CalendarToday />, path: '/doctor/appointments' },
          { text: 'Profile', icon: <Person />, path: '/profile' },
        ];
      case 'admin':
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
          { text: 'Manage Users', icon: <People />, path: '/admin/users' },
          { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
        ];
      default:
        return [];
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hospital Branding */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          px: 2,
          background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.08) 0%, rgba(67, 160, 71, 0.08) 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #00897b 30%, #4db6ac 90%)',
            boxShadow: '0 4px 12px rgba(0, 137, 123, 0.3)',
            mr: 1.5,
          }}
        >
          <LocalHospital sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            GLOBAL Medical Center
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.7rem',
            }}
          >
            Appointment System
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* User Info */}
      {user && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 1 }}>
            Welcome, {user.first_name}
          </Typography>
        </Box>
      )}

      <List sx={{ px: 1, flexGrow: 1 }}>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle();
              }}
              sx={{
                borderRadius: 2,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 137, 123, 0.08)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? 'white' : 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
          © 2024 GLOBAL Medical Center
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
