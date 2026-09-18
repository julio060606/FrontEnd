import { z } from 'zod';

const getBrowserStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
};

const removeSafely = (storage: Storage, key: string): void => {
  try {
    storage.removeItem(key);
  } catch {
    // El almacenamiento puede estar bloqueado por la configuración del navegador.
  }
};

export const localStorageService = {
  read<T>(key: string, schema: z.ZodType<T>): T | null {
    const storage = getBrowserStorage();
    if (!storage) {
      return null;
    }

    try {
      const rawValue = storage.getItem(key);
      if (rawValue === null) {
        return null;
      }

      const parsedValue: unknown = JSON.parse(rawValue);
      const validation = schema.safeParse(parsedValue);

      if (!validation.success) {
        removeSafely(storage, key);
        return null;
      }

      return validation.data;
    } catch {
      removeSafely(storage, key);
      return null;
    }
  },

  save<T>(key: string, value: T): boolean {
    const storage = getBrowserStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    const storage = getBrowserStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

export default localStorageService;
