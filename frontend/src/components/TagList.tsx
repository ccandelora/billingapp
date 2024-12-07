import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Box, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../types/Tag';
import { tagService } from '../services/tagService';

export const TagList: React.FC = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const data = await tagService.getAllTags();
            setTags(data);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await tagService.deleteTag(id);
                loadTags();
            } catch (error) {
                console.error('Error deleting tag:', error);
            }
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Tags</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/tags/new')}
                >
                    Create Tag
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell>
                                    <Chip
                                        label={tag.name}
                                        style={{ backgroundColor: tag.color }}
                                    />
                                </TableCell>
                                <TableCell>{tag.color}</TableCell>
                                <TableCell>{tag.description}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/tags/edit/${tag.id}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(tag.id)}
                                    >
                                        Delete
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