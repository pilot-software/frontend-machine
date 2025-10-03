import {clinicConfig, FeatureConfig, hospitalConfig, TextConfig} from '../config/features';
import {clinicText, hospitalText} from '../config/text-configs';

export type HospitalType = 'clinic' | 'hospital';

interface ConfigSet {
    features: FeatureConfig;
    text: TextConfig;
}

const configs: Record<HospitalType, ConfigSet> = {
    clinic: {features: clinicConfig, text: clinicText},
    hospital: {features: hospitalConfig, text: hospitalText},
};

// Domain-based configuration mapping
const domainConfig: Record<string, HospitalType> = {
    'clinic.localhost:3000': 'clinic',
    'hospital.localhost:3000': 'hospital',
    // Add production domains here
    'smallclinic.com': 'clinic',
    'cityhospital.com': 'hospital',
};

export const getRuntimeConfig = (): ConfigSet => {
    if (typeof window === 'undefined') {
        return configs.hospital; // Default for SSR
    }

    // Check localStorage override first (for development)
    const localOverride = localStorage.getItem('hospitalType') as HospitalType;
    if (localOverride && configs[localOverride]) {
        return configs[localOverride];
    }

    // Check domain mapping
    const hostname = window.location.host;
    const domainType = domainConfig[hostname];
    if (domainType) {
        return configs[domainType];
    }

    // Default fallback
    return configs.hospital;
};

export const setLocalConfig = (type: HospitalType) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('hospitalType', type);
    }
};
