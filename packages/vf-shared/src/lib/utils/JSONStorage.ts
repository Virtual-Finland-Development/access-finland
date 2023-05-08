class JSONStorage {
  driver: Storage;

  constructor(driver: Storage) {
    this.driver = driver;
  }

  get(key: string) {
    const value = this.driver.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  set(key: string, value: any) {
    this.driver.setItem(key, JSON.stringify(value));
  }
  clear() {
    this.driver.clear();
  }
  has(key: string): boolean {
    return !!this.driver.getItem(key);
  }
  remove(key: string) {
    this.driver.removeItem(key);
  }
}

// class instance invokement inside self-executing function
// this way window object should be defined, once client side code is loaded
export const JSONLocalStorage = (() => {
  if (typeof window !== 'undefined') {
    return new JSONStorage(localStorage);
  } else {
    return {} as JSONStorage; // Fails if used in server-side runtime
  }
})();

export const JSONSessionStorage = (() => {
  if (typeof window !== 'undefined') {
    return new JSONStorage(sessionStorage);
  } else {
    return {} as JSONStorage; // Fails if used in server-side runtime
  }
})();
