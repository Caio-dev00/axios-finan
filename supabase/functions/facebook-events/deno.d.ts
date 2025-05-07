/// <reference types="https://deno.land/x/deno@v1.40.5/mod.d.ts" />

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): Record<string, string>;
  }
  const env: Env;
}

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "https://deno.land/std@0.168.0/crypto/mod.ts" {
  export const crypto: {
    subtle: {
      digestSync(algorithm: string, data: Uint8Array): ArrayBuffer;
    };
  };
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): any;
}

declare module "https://esm.sh/axios@1.9.0" {
  const axios: {
    post: (url: string, data: unknown, config?: unknown) => Promise<{ data: unknown }>;
    get: (url: string, config?: unknown) => Promise<{ data: unknown }>;
  };
  export default axios;
} 