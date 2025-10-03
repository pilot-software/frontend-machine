export interface IStorageService {
    getItem(key: string): string | null;

    setItem(key: string, value: string): void;

    removeItem(key: string): void;

    clear(): void;
}

export class LocalStorageService implements IStorageService {
    getItem(key: string): string | null {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('LocalStorage getItem error:', error);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('LocalStorage setItem error:', error);
        }
    }

    removeItem(key: string): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('LocalStorage removeItem error:', error);
        }
    }

    clear(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.clear();
        } catch (error) {
            console.error('LocalStorage clear error:', error);
        }
    }
}

export const storageService = new LocalStorageService();
