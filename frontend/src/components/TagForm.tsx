import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export const TagForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        color: '#e57373',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('Field changed:', name, value); // Debug log
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData); // Debug log
        try {
            const response = await api.post('/api/tags', formData);
            console.log('API response:', response); // Debug log
            navigate('/tags');
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleCancel = () => {
        navigate('/tags');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Stack spacing={3}>
                <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                
                <TextField
                    fullWidth
                    type="color"
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                />
                
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        CREATE
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                    >
                        CANCEL
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}; 