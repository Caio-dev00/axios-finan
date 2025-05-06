
/// <reference types="vite/client" />

// Definição para o Facebook Pixel
interface Window {
  fbq?: any; // Usando any para permitir propriedades dinâmicas
  _fbq?: any;
}
