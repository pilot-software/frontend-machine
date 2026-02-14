import { api } from '../api';

export interface ApiVitalSign {
  id: string;
  organizationId: string;
  patientId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  temperatureUnit?: 'CELSIUS' | 'FAHRENHEIT';
  oxygenSaturation?: number;
  respiratoryRate?: number;
  weight?: number;
  weightUnit?: 'KG' | 'LBS';
  height?: number;
  heightUnit?: 'CM' | 'INCHES';
  bmi?: number;
  bloodGlucose?: number;
  pain?: number;
  notes?: string;
  recordedAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateVitalSign = Omit<ApiVitalSign, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'bmi'>;
export type UpdateVitalSign = Partial<CreateVitalSign>;

export interface VitalSignsStats {
  averageBloodPressure?: { systolic: number; diastolic: number };
  averageHeartRate?: number;
  averageTemperature?: number;
  averageOxygenSaturation?: number;
  latestWeight?: number;
  latestHeight?: number;
  latestBmi?: number;
}

export class VitalSignService {
  async getPatientVitals(patientId: string): Promise<ApiVitalSign[]> {
    return api.get(`/api/vital-signs/patient/${patientId}`);
  }

  async getLatestVitals(patientId: string): Promise<ApiVitalSign | null> {
    try {
      return await api.get(`/api/vital-signs/patient/${patientId}/latest`);
    } catch (error) {
      return null;
    }
  }

  async getVitalsInRange(patientId: string, start: string, end: string): Promise<ApiVitalSign[]> {
    return api.get(`/api/vital-signs/patient/${patientId}/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
  }

  async getVitalById(id: string): Promise<ApiVitalSign> {
    return api.get(`/api/vital-signs/${id}`);
  }

  async createVitalSign(vital: CreateVitalSign): Promise<ApiVitalSign> {
    const payload = this.calculateBMI(vital);
    return api.post('/api/vital-signs', payload);
  }

  async updateVitalSign(id: string, vital: UpdateVitalSign): Promise<ApiVitalSign> {
    const payload = this.calculateBMI(vital);
    return api.put(`/api/vital-signs/${id}`, payload);
  }

  async deleteVitalSign(id: string): Promise<void> {
    return api.delete(`/api/vital-signs/${id}`);
  }

  async getVitalSignsStats(patientId: string, days: number = 30): Promise<VitalSignsStats> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vitals = await this.getVitalsInRange(
      patientId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    return this.calculateStats(vitals);
  }

  private calculateBMI(vital: Partial<CreateVitalSign>): Partial<CreateVitalSign> {
    if (vital.weight && vital.height) {
      const weightKg = vital.weightUnit === 'LBS' ? vital.weight * 0.453592 : vital.weight;
      const heightM = vital.heightUnit === 'INCHES' ? vital.height * 0.0254 : vital.height / 100;
      return { ...vital, bmi: parseFloat((weightKg / (heightM * heightM)).toFixed(2)) };
    }
    return vital;
  }

  private calculateStats(vitals: ApiVitalSign[]): VitalSignsStats {
    if (vitals.length === 0) return {};

    const stats: VitalSignsStats = {};
    const bpReadings = vitals.filter(v => v.bloodPressureSystolic && v.bloodPressureDiastolic);
    const hrReadings = vitals.filter(v => v.heartRate);
    const tempReadings = vitals.filter(v => v.temperature);
    const o2Readings = vitals.filter(v => v.oxygenSaturation);

    if (bpReadings.length > 0) {
      stats.averageBloodPressure = {
        systolic: Math.round(bpReadings.reduce((sum, v) => sum + v.bloodPressureSystolic!, 0) / bpReadings.length),
        diastolic: Math.round(bpReadings.reduce((sum, v) => sum + v.bloodPressureDiastolic!, 0) / bpReadings.length)
      };
    }

    if (hrReadings.length > 0) {
      stats.averageHeartRate = Math.round(hrReadings.reduce((sum, v) => sum + v.heartRate!, 0) / hrReadings.length);
    }

    if (tempReadings.length > 0) {
      stats.averageTemperature = parseFloat((tempReadings.reduce((sum, v) => sum + v.temperature!, 0) / tempReadings.length).toFixed(1));
    }

    if (o2Readings.length > 0) {
      stats.averageOxygenSaturation = Math.round(o2Readings.reduce((sum, v) => sum + v.oxygenSaturation!, 0) / o2Readings.length);
    }

    const latest = vitals[vitals.length - 1];
    if (latest.weight) stats.latestWeight = latest.weight;
    if (latest.height) stats.latestHeight = latest.height;
    if (latest.bmi) stats.latestBmi = latest.bmi;

    return stats;
  }

  isAbnormal(vital: ApiVitalSign): { field: string; value: number; status: 'high' | 'low' | 'critical' }[] {
    const abnormalities: { field: string; value: number; status: 'high' | 'low' | 'critical' }[] = [];

    if (vital.bloodPressureSystolic) {
      if (vital.bloodPressureSystolic >= 180) abnormalities.push({ field: 'Systolic BP', value: vital.bloodPressureSystolic, status: 'critical' });
      else if (vital.bloodPressureSystolic >= 140) abnormalities.push({ field: 'Systolic BP', value: vital.bloodPressureSystolic, status: 'high' });
      else if (vital.bloodPressureSystolic < 90) abnormalities.push({ field: 'Systolic BP', value: vital.bloodPressureSystolic, status: 'low' });
    }

    if (vital.bloodPressureDiastolic) {
      if (vital.bloodPressureDiastolic >= 120) abnormalities.push({ field: 'Diastolic BP', value: vital.bloodPressureDiastolic, status: 'critical' });
      else if (vital.bloodPressureDiastolic >= 90) abnormalities.push({ field: 'Diastolic BP', value: vital.bloodPressureDiastolic, status: 'high' });
      else if (vital.bloodPressureDiastolic < 60) abnormalities.push({ field: 'Diastolic BP', value: vital.bloodPressureDiastolic, status: 'low' });
    }

    if (vital.heartRate) {
      if (vital.heartRate > 120) abnormalities.push({ field: 'Heart Rate', value: vital.heartRate, status: 'high' });
      else if (vital.heartRate < 60) abnormalities.push({ field: 'Heart Rate', value: vital.heartRate, status: 'low' });
    }

    if (vital.temperature) {
      const tempC = vital.temperatureUnit === 'FAHRENHEIT' ? (vital.temperature - 32) * 5/9 : vital.temperature;
      if (tempC >= 39) abnormalities.push({ field: 'Temperature', value: vital.temperature, status: 'high' });
      else if (tempC < 36) abnormalities.push({ field: 'Temperature', value: vital.temperature, status: 'low' });
    }

    if (vital.oxygenSaturation) {
      if (vital.oxygenSaturation < 90) abnormalities.push({ field: 'Oxygen Saturation', value: vital.oxygenSaturation, status: 'critical' });
      else if (vital.oxygenSaturation < 95) abnormalities.push({ field: 'Oxygen Saturation', value: vital.oxygenSaturation, status: 'low' });
    }

    if (vital.respiratoryRate) {
      if (vital.respiratoryRate > 20) abnormalities.push({ field: 'Respiratory Rate', value: vital.respiratoryRate, status: 'high' });
      else if (vital.respiratoryRate < 12) abnormalities.push({ field: 'Respiratory Rate', value: vital.respiratoryRate, status: 'low' });
    }

    return abnormalities;
  }
}

export const vitalSignService = new VitalSignService();
