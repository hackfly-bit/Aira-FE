import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const dateUtils = {
  format: (date: string | Date, format: 'short' | 'long' | 'time' | 'datetime' = 'short') => {
    const d = new Date(date);
    
    switch (format) {
      case 'short':
        return d.toLocaleDateString('id-ID');
      case 'long':
        return d.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return d.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'datetime':
        return d.toLocaleString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return d.toLocaleDateString('id-ID');
    }
  },

  isToday: (date: string | Date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  },

  isYesterday: (date: string | Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const d = new Date(date);
    return d.toDateString() === yesterday.toDateString();
  },

  timeAgo: (date: string | Date) => {
    const now = new Date();
    const d = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    
    return dateUtils.format(date, 'short');
  },
};

// String utilities
export const stringUtils = {
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  titleCase: (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  kebabCase: (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  camelCase: (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },

  truncate: (str: string, length: number, suffix: string = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  slugify: (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  removeHtml: (str: string) => {
    return str.replace(/<[^>]*>/g, '');
  },

  highlight: (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
};

// Number utilities
export const numberUtils = {
  format: (num: number, locale: string = 'id-ID') => {
    return new Intl.NumberFormat(locale).format(num);
  },

  currency: (num: number, currency: string = 'IDR', locale: string = 'id-ID') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(num);
  },

  percentage: (num: number, decimals: number = 1) => {
    return `${(num * 100).toFixed(decimals)}%`;
  },

  abbreviate: (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  },

  clamp: (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
  },

  random: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

// Array utilities
export const arrayUtils = {
  unique: <T>(arr: T[]): T[] => {
    return [...new Set(arr)];
  },

  groupBy: <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  },

  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  intersection: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => arr2.includes(item));
  },

  difference: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => !arr2.includes(item));
  },
};

// Object utilities
export const objectUtils = {
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
    return Object.keys(obj).length === 0;
  },

  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
      const cloned = {} as T;
      Object.keys(obj).forEach(key => {
        (cloned as any)[key] = objectUtils.deepClone((obj as any)[key]);
      });
      return cloned;
    }
    return obj;
  },

  merge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    return sources.reduce((acc, source) => ({ ...acc, ...source }), target);
  },
};

// URL utilities
export const urlUtils = {
  buildQuery: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  },

  parseQuery: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  getBaseUrl: (): string => {
    if (typeof window === 'undefined') return '';
    return `${window.location.protocol}//${window.location.host}`;
  },
};

// File utilities
export const fileUtils = {
  formatSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  getExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  isImage: (filename: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return imageExtensions.includes(ext);
  },

  isDocument: (filename: string): boolean => {
    const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return docExtensions.includes(ext);
  },
};

// Validation utilities
export const validationUtils = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf besar');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password harus mengandung angka');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password harus mengandung karakter khusus');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// All utilities are already exported above