
/// <reference types="vite/client" />

// Definição para o Facebook Pixel
interface Window {
  fbq?: (
    eventType: string,
    eventName: string,
    params?: Record<string, any>
  ) => void;
  _fbq?: any;
}
