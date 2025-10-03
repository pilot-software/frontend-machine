import {FeatureConfig, TextConfig} from '../config/features';
import {api} from './api';

interface ConfigFile {
    features: FeatureConfig;
    text: TextConfig;
}

export const loadConfigFromFile = async (configPath: string): Promise<ConfigFile> => {
    try {
        // For local config files, still use fetch directly
        if (configPath.startsWith('/') || configPath.startsWith('./')) {
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.statusText}`);
            }
            return await response.json();
        }
        // For API endpoints, use the configured API client
        return await api.get(configPath);
    } catch (error) {
        console.error('Error loading config file:', error);
        throw error;
    }
};

export const setHospitalType = (type: 'clinic' | 'hospital' | 'big-hospital') => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('hospitalType', type);
        window.location.reload();
    }
};
