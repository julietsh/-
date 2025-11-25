import { PoeticEntry } from '../types';

const STORAGE_KEY = 'poetic_moments_db';

export const storageService = {
  getAll: (): PoeticEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load from storage", e);
      return [];
    }
  },

  add: (entry: PoeticEntry): void => {
    const current = storageService.getAll();
    const updated = [entry, ...current]; // Newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  update: (id: string, newPoem: string): void => {
    const current = storageService.getAll();
    const updated = current.map(item => 
      item.id === id ? { ...item, poem: newPoem } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  delete: (id: string): void => {
    const current = storageService.getAll();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
