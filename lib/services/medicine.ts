import { api } from '../api';

export interface GenericDrug {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

export interface BrandMedicine {
  id: number;
  brandName: string;
  genericName: string;
  manufacturer?: string;
  strength?: string;
  form?: string;
  route?: string;
  packSize?: string;
  mrp?: number;
}

export interface MedicineSearchResponse {
  genericDrugs: GenericDrug[];
  brandMedicines: BrandMedicine[];
  total: number;
}

export class MedicineService {
  async searchMedicines(query: string, limit: number = 10): Promise<MedicineSearchResponse> {
    if (!query || query.trim().length < 2) {
      return { genericDrugs: [], brandMedicines: [], total: 0 };
    }

    try {
      const response = await api.get(`/api/medicines/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`);
      return this.normalizeResponse(response);
    } catch (error) {
      console.error('Medicine search error:', error);
      return { genericDrugs: [], brandMedicines: [], total: 0 };
    }
  }

  async searchByGeneric(genericName: string, limit: number = 20): Promise<BrandMedicine[]> {
    const response = await this.searchMedicines(genericName, limit);
    return response.brandMedicines.filter(m => 
      m.genericName.toLowerCase().includes(genericName.toLowerCase())
    );
  }

  async searchByBrand(brandName: string, limit: number = 20): Promise<BrandMedicine[]> {
    const response = await this.searchMedicines(brandName, limit);
    return response.brandMedicines.filter(m => 
      m.brandName.toLowerCase().includes(brandName.toLowerCase())
    );
  }

  async searchByManufacturer(manufacturer: string, limit: number = 50): Promise<BrandMedicine[]> {
    const response = await this.searchMedicines(manufacturer, limit);
    return response.brandMedicines.filter(m => 
      m.manufacturer?.toLowerCase().includes(manufacturer.toLowerCase())
    );
  }

  groupByGeneric(medicines: BrandMedicine[]): Map<string, BrandMedicine[]> {
    const grouped = new Map<string, BrandMedicine[]>();
    medicines.forEach(med => {
      const generic = med.genericName;
      if (!grouped.has(generic)) {
        grouped.set(generic, []);
      }
      grouped.get(generic)!.push(med);
    });
    return grouped;
  }

  findCheapestAlternative(medicines: BrandMedicine[]): BrandMedicine | null {
    const withPrice = medicines.filter(m => m.mrp && m.mrp > 0);
    if (withPrice.length === 0) return null;
    return withPrice.reduce((min, med) => med.mrp! < min.mrp! ? med : min);
  }

  private normalizeResponse(response: any): MedicineSearchResponse {
    const genericDrugs: GenericDrug[] = Array.isArray(response.genericDrugs) 
      ? response.genericDrugs 
      : [];
    
    const brandMedicines: BrandMedicine[] = Array.isArray(response.brandMedicines) 
      ? response.brandMedicines 
      : [];

    return {
      genericDrugs,
      brandMedicines,
      total: genericDrugs.length + brandMedicines.length
    };
  }
}

export const medicineService = new MedicineService();
