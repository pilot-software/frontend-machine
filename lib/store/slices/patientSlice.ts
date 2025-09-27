import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiPatient, patientService } from '../../services/patient';

interface PatientState {
  selectedPatient: ApiPatient | null;
  loading: {
    selectedPatient: boolean;
    updating: boolean;
  };
  error: {
    selectedPatient: string | null;
    updating: string | null;
  };
}

const initialState: PatientState = {
  selectedPatient: null,
  loading: {
    selectedPatient: false,
    updating: false,
  },
  error: {
    selectedPatient: null,
    updating: null,
  },
};

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (patientId: string) => {
    return await patientService.getPatientById(patientId);
  }
);

export const updatePatient = createAsyncThunk(
  'patient/updatePatient',
  async ({ id, data }: { id: string; data: any }) => {
    return await patientService.updatePatient(id, data);
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
      state.error.selectedPatient = null;
      state.error.updating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.loading.selectedPatient = true;
        state.error.selectedPatient = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading.selectedPatient = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading.selectedPatient = false;
        state.error.selectedPatient = action.error.message || 'Failed to fetch patient';
      })
      .addCase(updatePatient.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading.updating = false;
        state.selectedPatient = action.payload;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update patient';
      });
  },
});

export const { clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;