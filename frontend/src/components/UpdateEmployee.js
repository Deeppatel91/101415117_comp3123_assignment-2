import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, Button, Container, Typography, Alert, Box, 
  Grid, Paper
} from '@mui/material';

const UpdateEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
        salary: '',
        date_of_joining: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/emp/employees/${id}`);
                const { __v, created_at, updated_at, ...employeeData } = response.data;
                setFormData(employeeData);
                setError('');
            } catch (error) {
                setError('Error fetching employee details');
                console.error('Fetch Employee Error:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/v1/emp/employees/${id}`, formData);
            navigate('/employees');
        } catch (error) {
            setError('Error updating employee');
            console.error('Update Employee Error:', error.response?.data || error.message);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                    Update Employee
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {Object.entries(formData).map(([key, value]) => (
                            <Grid item xs={12} sm={6} key={key}>
                                <TextField
                                    id={key}
                                    label={key.replace(/_/g, ' ').toUpperCase()}
                                    variant="outlined"
                                    type={key === 'date_of_joining' ? 'date' : 'text'}
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Update Employee
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default UpdateEmployee;
