import {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../store';
import {fetchDoctors, fetchPatients, fetchStats} from '../store/slices/appSlice';

// Global flags to prevent duplicate requests
let statsRequested = false;
let doctorsRequested = false;
let patientsRequested = false;

export function useAppData() {
  const dispatch = useAppDispatch();
  const { stats, doctors, patients, loading, error } = useAppSelector((state) => state.app);
  const mounted = useRef(true);

  useEffect(() => {
    if (!stats && !loading.stats && !error.stats && !statsRequested) {
      statsRequested = true;
      dispatch(fetchStats()).finally(() => {
        if (mounted.current) statsRequested = false;
      });
    }
  }, [dispatch, stats, loading.stats, error.stats]);

  useEffect(() => {
    if (!doctors.length && !loading.doctors && !error.doctors && !doctorsRequested) {
      doctorsRequested = true;
      dispatch(fetchDoctors()).finally(() => {
        if (mounted.current) doctorsRequested = false;
      });
    }
  }, [dispatch, doctors.length, loading.doctors, error.doctors]);

  useEffect(() => {
    if (!patients.length && !loading.patients && !error.patients && !patientsRequested) {
      patientsRequested = true;
      dispatch(fetchPatients()).finally(() => {
        if (mounted.current) patientsRequested = false;
      });
    }
  }, [dispatch, patients.length, loading.patients, error.patients]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    stats,
    doctors,
    patients,
    loading,
    error,
    refetch: {
      stats: () => dispatch(fetchStats()),
      doctors: () => dispatch(fetchDoctors()),
      patients: () => dispatch(fetchPatients()),
    },
  };
}
