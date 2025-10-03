import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  patientModal: {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    patientId?: string;
    patientData?: any;
    origin?: { x: number; y: number } | null;
  };
  doctorModal: {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    doctorId?: string;
    origin?: { x: number; y: number } | null;
  };
  appointmentModal: {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    appointmentId?: string;
    origin?: { x: number; y: number } | null;
  };
  prescriptionModal: {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    prescriptionId?: string;
    origin?: { x: number; y: number } | null;
  };
}

const initialState: ModalState = {
  patientModal: {
    isOpen: false,
    mode: 'add',
    patientId: undefined,
    patientData: undefined,
    origin: null,
  },
  doctorModal: {
    isOpen: false,
    mode: 'add',
    doctorId: undefined,
    origin: null,
  },
  appointmentModal: {
    isOpen: false,
    mode: 'add',
    appointmentId: undefined,
    origin: null,
  },
  prescriptionModal: {
    isOpen: false,
    mode: 'add',
    prescriptionId: undefined,
    origin: null,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openPatientModal: (state, action: PayloadAction<{
      mode: 'add' | 'edit' | 'view';
      patientId?: string;
      patientData?: any;
      origin?: { x: number; y: number } | null;
    }>) => {
      state.patientModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closePatientModal: (state) => {
      state.patientModal = initialState.patientModal;
    },
    openDoctorModal: (state, action: PayloadAction<{
      mode: 'add' | 'edit' | 'view';
      doctorId?: string;
      origin?: { x: number; y: number } | null;
    }>) => {
      state.doctorModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeDoctorModal: (state) => {
      state.doctorModal = initialState.doctorModal;
    },
    openAppointmentModal: (state, action: PayloadAction<{
      mode: 'add' | 'edit' | 'view';
      appointmentId?: string;
      origin?: { x: number; y: number } | null;
    }>) => {
      state.appointmentModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeAppointmentModal: (state) => {
      state.appointmentModal = initialState.appointmentModal;
    },
    openPrescriptionModal: (state, action: PayloadAction<{
      mode: 'add' | 'edit' | 'view';
      prescriptionId?: string;
      origin?: { x: number; y: number } | null;
    }>) => {
      state.prescriptionModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closePrescriptionModal: (state) => {
      state.prescriptionModal = initialState.prescriptionModal;
    },
  },
});

export const {
  openPatientModal,
  closePatientModal,
  openDoctorModal,
  closeDoctorModal,
  openAppointmentModal,
  closeAppointmentModal,
  openPrescriptionModal,
  closePrescriptionModal,
} = modalSlice.actions;

export default modalSlice.reducer;
