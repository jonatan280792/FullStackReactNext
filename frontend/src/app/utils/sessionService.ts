interface Persistence {
  set(key: string, value: object | string): void;  // Acepta tanto objetos como strings
  get(key: string): object | null;
  setRawString(key: string, value: string): void;
  delete(key: string): void;
  deleteAll(): void;
}

const sessionPersistence: Persistence = {
  set: (key: string, value: object | string) => {
    if (typeof value === 'object') {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  get: (key: string) => {
    const value = sessionStorage.getItem(key);
    
    if (!value) return null;

    try {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      return value;
    }
  },
  setRawString: (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  },
  delete: (key: string) => {
    sessionStorage.removeItem(key);
  },
  deleteAll: () => {
    Object.keys(sessionStorage).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }
};

export { sessionPersistence };
