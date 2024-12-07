import axios from 'axios';
import { Tag, TagFormData } from '../types/Tag';

const API_URL = 'http://localhost:3001/api';

export const tagService = {
    getAllTags: async (): Promise<Tag[]> => {
        const response = await axios.get(`${API_URL}/tags`);
        return response.data;
    },

    getTagById: async (id: number): Promise<Tag> => {
        const response = await axios.get(`${API_URL}/tags/${id}`);
        return response.data;
    },

    createTag: async (tag: TagFormData): Promise<Tag> => {
        const response = await axios.post(`${API_URL}/tags`, tag);
        return response.data;
    },

    updateTag: async (id: number, tag: TagFormData): Promise<Tag> => {
        const response = await axios.put(`${API_URL}/tags/${id}`, tag);
        return response.data;
    },

    deleteTag: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/tags/${id}`);
    }
}; 