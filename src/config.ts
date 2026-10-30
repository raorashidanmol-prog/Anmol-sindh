export interface AppConfig {
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
  recoveryCode: string;
  useBackend: boolean;
  firebase?: any;
  supabase?: any;
  siteName: string;
  version: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  adminUsername: 'admin',
  adminEmail: 'raorashid.anmol@gmail.com',
  adminPassword: 'Pakistani1',
  recoveryCode: 'ANMOL-9988-SECURE',
  useBackend: false,
  firebase: null,
  supabase: null,
  siteName: 'ANMOL SINDH | انمول سنڌ',
  version: '2.1.0',
};

export function getAppConfig(): AppConfig {
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
    return { ...DEFAULT_CONFIG, ...(window as any).APP_CONFIG };
  }
  return DEFAULT_CONFIG;
}
