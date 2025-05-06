
/// <reference types="vite/client" />

// Definição para o Facebook Pixel
interface Window {
  fbq?: {
    (arg1: string, arg2: string, arg3?: any): void;
    callMethod?: (...args: any[]) => void;
    queue?: any[];
    push?: any;
    loaded?: boolean;
    version?: string;
  }; 
  _fbq?: any;
}

