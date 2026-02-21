import React from 'react';
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
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
} from '@mui/icons-material';

const ManageUsers = () => {
  // Mock data - replace with actual API calls
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'patient', status: 'active' },
    { id: 2, name: 'Dr. Jane Smith', email: 'jane@example.com', role: 'doctor', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'patient', status: 'inactive' },
    { id: 4, name: 'Dr. Mike Wilson', email: 'mike@example.com', role: 'doctor', status: 'active' },
  ];

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
          <Button variant="contained" color="primary">
            Add New User
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'doctor' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
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
    </Box>
  );
};

export default ManageUsers;