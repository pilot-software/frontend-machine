import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Doctor, Patient} from '../../types';
import {dashboardService} from '../../services/dashboard';
import {doctorService} from '../../services/doctor';
import {patientService} from '../../services/patient';

interface AppState {
    stats: any;
    doctors: Doctor[];
    patients: Patient[];
    loading: {
        stats: boolean;
        doctors: boolean;
        patients: boolean;
    };
    error: {
        stats: string | null;
        doctors: string | null;
        patients: string | null;
    };
}

const initialState: AppState = {
    stats: null,
    doctors: [],
    patients: [],
    loading: {
        stats: false,
        doctors: false,
        patients: false,
    },
    error: {
        stats: null,
        doctors: null,
        patients: null,
    },
};

export const fetchStats = createAsyncThunk('app/fetchStats', async () => {
    return await dashboardService.getDashboardStats();
});

export const fetchDoctors = createAsyncThunk('app/fetchDoctors', async () => {
    return await doctorService.getDoctors();
});

export const fetchPatients = createAsyncThunk('app/fetchPatients', async () => {
    return await patientService.getPatients();
});

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading.stats = true;
                state.error.stats = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading.stats = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading.stats = false;
                state.error.stats = action.error.message || 'Failed to fetch stats';
            })
            .addCase(fetchDoctors.pending, (state) => {
                state.loading.doctors = true;
                state.error.doctors = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading.doctors = false;
                state.doctors = action.payload as any;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading.doctors = false;
                state.error.doctors = action.error.message || 'Failed to fetch doctors';
            })
            .addCase(fetchPatients.pending, (state) => {
                state.loading.patients = true;
                state.error.patients = null;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.loading.patients = false;
                state.patients = (action.payload || []) as any;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading.patients = false;
                state.error.patients = action.error.message || 'Failed to fetch patients';
            });
    },
});

export default appSlice.reducer;
