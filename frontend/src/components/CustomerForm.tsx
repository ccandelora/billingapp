import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField, Button, Container, Typography,
    Box, CircularProgress, Autocomplete, Chip
} from '@mui/material';
import { Customer } from '../types/Customer';
import { Tag } from '../types/Tag';
import { customerService } from '../services/customerService';
import { tagService } from '../services/tagService';

interface CustomerFormData extends Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'invoices'> {
    tags: Tag[];
}

export const CustomerForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [formData, setFormData] = useState<CustomerFormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
        tags: []
    });

    useEffect(() => {
        loadTags();
        if (id) {
            loadCustomer(parseInt(id));
        }
    }, [id]);

    const loadTags = async () => {
        try {
            const tags = await tagService.getAllTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const loadCustomer = async (customerId: number) => {
        try {
            setLoading(true);
            const customer = await customerService.getCustomerById(customerId);
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                company: customer.company || '',
                notes: customer.notes || '',
                tags: customer.tags || []
            });
        } catch (error) {
            console.error('Error loading customer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await customerService.updateCustomer(parseInt(id), formData);
            } else {
                await customerService.createCustomer(formData);
            }
            navigate('/customers');
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                {id ? 'Edit Customer' : 'Create Customer'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                />

                <Autocomplete
                    multiple
                    options={availableTags}
                    getOptionLabel={(option) => option.name}
                    value={formData.tags}
                    onChange={(_, newValue) => {
                        setFormData(prev => ({
                            ...prev,
                            tags: newValue
                        }));
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option.name}
                                {...getTagProps({ index })}
                                style={{ backgroundColor: option.color }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                />

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        {id ? 'Update' : 'Create'}
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/customers')}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </Container>
    );
}; 