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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editForm, setEditForm] = useState({
    consultation_fee: '',
    specialization: '',
    license_number: '',
    years_of_experience: '',
    available_days: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/accounts/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    if (user.role === 'doctor') {
      setSelectedDoctor(user);
      setEditForm({
        consultation_fee: user.consultation_fee || '',
        specialization: user.specialization || '',
        license_number: '',
        years_of_experience: '',
        available_days: '',
        bio: '',
      });
      setEditDialog(true);
    }
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/accounts/doctors/${selectedDoctor.id}/update/`, editForm);
      toast.success('Doctor updated successfully');
      setEditDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              Manage Users
            </Typography>
            <Typography variant="body1" color="textSecondary">
              View and manage all users in the system
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'doctor' ? 'primary' : user.role === 'admin' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.specialization || '-'}</TableCell>
                <TableCell>
                  {user.role === 'doctor' ? (
                    <Chip
                      label={`$${user.consultation_fee || '0'}`}
                      color="success"
                      size="small"
                    />
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.role === 'doctor' && (
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(user)}>
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton size="small" color="warning">
                    <Block />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Doctor Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Doctor - {selectedDoctor?.first_name} {selectedDoctor?.last_name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Consultation Fee ($)"
              name="consultation_fee"
              value={editForm.consultation_fee}
              onChange={handleEditFormChange}
              fullWidth
              type="number"
            />
            <TextField
              label="Specialization"
              name="specialization"
              value={editForm.specialization}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="License Number"
              name="license_number"
              value={editForm.license_number}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField
              label="Years of Experience"
              name="years_of_experience"
              value={editForm.years_of_experience}
              onChange={handleEditFormChange}
              fullWidth
              type="number"
            />
            <TextField
              label="Available Days"
              name="available_days"
              value={editForm.available_days}
              onChange={handleEditFormChange}
              fullWidth
              placeholder="Monday,Tuesday,Wednesday"
            />
            <TextField
              label="Bio"
              name="bio"
              value={editForm.bio}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
