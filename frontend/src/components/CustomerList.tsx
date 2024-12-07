import React, { useEffect, useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Box, TextField,
    InputAdornment, Chip, Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../types/Customer';
import { Tag } from '../types/Tag';
import { customerService } from '../services/customerService';
import { tagService } from '../services/tagService';

export const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    const loadCustomers = async () => {
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
            setCustomers([]);
            setFilteredCustomers([]);
        }
    };

    const loadTags = async () => {
        try {
            const tags = await tagService.getAllTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
            setAvailableTags([]);
        }
    };

    useEffect(() => {
        loadCustomers();
        loadTags();
    }, []);

    const filterCustomers = useCallback(() => {
        let filtered = customers;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm) ||
                (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply tag filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(customer => 
                selectedTags.every(selectedTag => 
                    customer.tags?.some(tag => tag.id === selectedTag.id)
                )
            );
        }

        setFilteredCustomers(filtered);
    }, [customers, searchTerm, selectedTags]);

    useEffect(() => {
        filterCustomers();
    }, [filterCustomers]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Customers</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/customers/new')}
                >
                    Add Customer
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search customers..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Autocomplete
                    multiple
                    options={availableTags}
                    getOptionLabel={(option) => option.name}
                    value={selectedTags}
                    onChange={(_, newValue) => setSelectedTags(newValue)}
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
                            placeholder="Filter by tags"
                            sx={{ minWidth: 200 }}
                        />
                    )}
                    sx={{ minWidth: 200 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.company}</TableCell>
                                <TableCell>
                                    {customer.tags?.map(tag => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.name}
                                            size="small"
                                            style={{
                                                backgroundColor: tag.color,
                                                marginRight: '4px'
                                            }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/customers/edit/${customer.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}; 