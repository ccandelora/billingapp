import axios from 'axios';
import { Settings } from '../types/Settings';

const API_URL = 'http://localhost:3001/api';

export const settingsService = {
    getSettings: async (): Promise<Settings> => {
        console.log('Fetching settings...');
        const response = await axios.get(`${API_URL}/settings`);
        console.log('Received settings:', response.data);
        return response.data;
    },

    updateSettings: async (settings: Settings): Promise<Settings> => {
        console.log('Sending settings update:', settings);
        const response = await axios.put(`${API_URL}/settings`, settings);
        console.log('Update response:', response.data);
        return response.data;
    }
}; 