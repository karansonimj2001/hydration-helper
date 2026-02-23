import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.karansonimj.hydrationhelper',
  appName: 'Hydration Helper',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;