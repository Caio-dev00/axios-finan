interface FacebookPixelEvent {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData?: Record<string, unknown>;
  customData?: Record<string, unknown>;
}

interface FacebookPixel {
  (eventName: string, ...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: FacebookPixel;
  track: (eventName: string, eventData?: Record<string, unknown>) => void;
  trackCustom: (eventName: string, eventData?: Record<string, unknown>) => void;
  init: (pixelId: string) => void;
}

declare global {
  interface Window {
    fbq: FacebookPixel;
    _fbq: FacebookPixel;
  }
}

export type { FacebookPixel, FacebookPixelEvent }; 