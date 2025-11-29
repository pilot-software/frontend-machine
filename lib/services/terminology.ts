const TERMINOLOGY_API_BASE = 'http://localhost:8001';
const API_KEY = 'dev-key-123';

interface ICDCode {
  code: string;
  title: string;
  system: 'icd10' | 'icd11';
  chapter?: string;
}

interface Drug {
  id: number;
  brand_name: string;
  generic_name: string;
  manufacturer?: string;
  dosage_form?: string;
  strength?: string;
  mrp?: number;
  pack_size?: string;
}

interface Procedure {
  package_code: string;
  package_name: string;
  specialty?: string;
  price?: number;
}

class TerminologyService {
  private headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  };

  async searchICD(query: string, limit = 10): Promise<ICDCode[]> {
    try {
      const response = await fetch(
        `${TERMINOLOGY_API_BASE}/api/v1/icd/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.headers }
      );
      if (!response.ok) return [];
      const data = await response.json();
      
      const results: ICDCode[] = [];
      if (data.results?.icd10) {
        results.push(...data.results.icd10.map((item: any) => ({
          code: item.code,
          title: item.term || item.short_desc,
          system: 'icd10' as const,
          chapter: item.chapter,
        })));
      }
      if (data.results?.icd11) {
        results.push(...data.results.icd11.map((item: any) => ({
          code: item.code,
          title: item.term,
          system: 'icd11' as const,
          chapter: item.chapter,
        })));
      }
      return results;
    } catch (error) {
      console.error('ICD search error:', error);
      return [];
    }
  }

  async searchDrugs(query: string): Promise<Drug[]> {
    try {
      const response = await fetch(
        `${TERMINOLOGY_API_BASE}/api/v1/drugs/search?q=${encodeURIComponent(query)}`,
        { headers: this.headers }
      );
      if (!response.ok) return [];
      const data = await response.json();
      console.log('Drug API Response:', data);
      
      if (data.drugs && Array.isArray(data.drugs)) {
        const results = data.drugs.map((drug: any) => ({
          id: drug.brand_id,
          brand_name: drug.brand_name,
          generic_name: drug.generic_name,
          manufacturer: drug.manufacturer,
          dosage_form: drug.dosage_form,
          strength: drug.strength,
          mrp: drug.mrp,
          pack_size: drug.pack_size,
        }));
        console.log('Drug Results:', results);
        return results;
      }
      return [];
    } catch (error) {
      console.error('Drug search error:', error);
      return [];
    }
  }

  async searchProcedures(query: string, limit = 20): Promise<Procedure[]> {
    try {
      const response = await fetch(
        `${TERMINOLOGY_API_BASE}/api/v1/abhbp/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.headers }
      );
      if (!response.ok) return [];
      const data = await response.json();
      console.log('Procedure API Response:', data);
      const results = Array.isArray(data) ? data : (data.results || data.data || []);
      console.log('Procedure Results:', results);
      return results;
    } catch (error) {
      console.error('Procedure search error:', error);
      return [];
    }
  }

  async checkDrugInteractions(drugIds: number[]): Promise<any> {
    const response = await fetch(
      `${TERMINOLOGY_API_BASE}/api/v1/drugs/interactions`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ drug_ids: drugIds }),
      }
    );
    if (!response.ok) throw new Error('Interaction check failed');
    return response.json();
  }
}

export const terminologyService = new TerminologyService();
export type { ICDCode, Drug, Procedure };
