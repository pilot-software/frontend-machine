import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchStats, fetchDoctors, fetchPatients } from '../store/slices/appSlice';

export function useAppData() {
  const dispatch = useAppDispatch();
  const { stats, doctors, patients, loading, error } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (!stats && !loading.stats && !error.stats) {
      dispatch(fetchStats());
    }
  }, [dispatch, stats, loading.stats, error.stats]);

  useEffect(() => {
    if (!doctors.length && !loading.doctors && !error.doctors) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length, loading.doctors, error.doctors]);

  useEffect(() => {
    if (!patients.length && !loading.patients && !error.patients) {
      dispatch(fetchPatients());
    }
  }, [dispatch, patients.length, loading.patients, error.patients]);

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