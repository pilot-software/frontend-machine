import {clinicConfig, FeatureConfig, hospitalConfig, TextConfig} from '../config/features';
import {clinicText, hospitalText} from '../config/text-configs';
import brandingConfig from '../config/branding.json';

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

    // Check domain mapping first
    const hostname = window.location.host;
    const domainType = domainConfig[hostname];
    if (domainType) {
        return configs[domainType];
    }

    // Check localStorage override (only for localhost without subdomain)
    if (hostname === 'localhost:3000' || hostname === 'localhost') {
        const localOverride = localStorage.getItem('hospitalType') as HospitalType;
        if (localOverride && configs[localOverride]) {
            return configs[localOverride];
        }
    }

    // Default fallback
    return configs.hospital;
};

export const getHospitalOrgId = (): string => {
    if (typeof window === 'undefined') {
        return 'hospital_org1';
    }

    const hostname = window.location.host;
    if (hostname.startsWith('hospital.localhost')) {
        return 'hospital_org1';
    } else if (hostname.startsWith('clinic.localhost')) {
        return 'hospital_org2';
    }

    // For localhost, use config-based org
    const config = getRuntimeConfig();
    return config.features.type === 'clinic' ? 'hospital_org2' : 'hospital_org1';
};

export const isSubdomainMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.host;
    return hostname.startsWith('hospital.localhost') || hostname.startsWith('clinic.localhost');
};

export const getBranding = () => {
    if (typeof window === 'undefined') {
        return brandingConfig.hospital;
    }

    const hostname = window.location.host;
    if (hostname.startsWith('clinic.localhost')) {
        return brandingConfig.clinic;
    } else if (hostname.startsWith('hospital.localhost')) {
        return brandingConfig.hospital;
    }

    // For localhost, use config-based branding
    const config = getRuntimeConfig();
    return config.features.type === 'clinic' ? brandingConfig.clinic : brandingConfig.hospital;
};

export const setLocalConfig = (type: HospitalType) => {
    if (typeof window !== 'undefined' && !isSubdomainMode()) {
        localStorage.setItem('hospitalType', type);
    }
};
