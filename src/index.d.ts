declare namespace NodeJS {
  interface ProcessEnv {
    PLASMO_PUBLIC_GTAG_ID?: string;
  }
}

interface Window {
  dataLayer: unknown[];
  gtag: (a: string, b: unknown, c?: unknown) => void;
  next: unknown;
}
