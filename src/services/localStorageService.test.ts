import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { localStorageService } from './localStorageService';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const searchSchema = z.object({ route: z.string(), passengers: z.number().int().positive() });

describe('localStorageService', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('window', globalThis);
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('guarda, lee y sobrescribe valores JSON tipados', () => {
    expect(localStorageService.save('search', { route: 'LIM-CUZ', passengers: 1 })).toBe(true);
    expect(localStorageService.read('search', searchSchema)).toEqual({ route: 'LIM-CUZ', passengers: 1 });

    expect(localStorageService.save('search', { route: 'LIM-AQP', passengers: 2 })).toBe(true);
    expect(localStorageService.read('search', searchSchema)).toEqual({ route: 'LIM-AQP', passengers: 2 });
  });

  it('elimina un valor guardado', () => {
    localStorageService.save('search', { route: 'LIM-CUZ', passengers: 1 });

    expect(localStorageService.remove('search')).toBe(true);
    expect(localStorageService.read('search', searchSchema)).toBeNull();
  });

  it('descarta JSON corrupto o payload inválido', () => {
    storage.setItem('broken-json', '{not-json');
    storage.setItem('invalid-payload', JSON.stringify({ route: 'LIM-CUZ', passengers: 0 }));

    expect(localStorageService.read('broken-json', searchSchema)).toBeNull();
    expect(storage.getItem('broken-json')).toBeNull();
    expect(localStorageService.read('invalid-payload', searchSchema)).toBeNull();
    expect(storage.getItem('invalid-payload')).toBeNull();
  });

  it('no falla cuando LocalStorage no está disponible', () => {
    vi.stubGlobal('window', undefined);

    expect(localStorageService.save('search', { route: 'LIM-CUZ', passengers: 1 })).toBe(false);
    expect(localStorageService.read('search', searchSchema)).toBeNull();
    expect(localStorageService.remove('search')).toBe(false);
  });
});
