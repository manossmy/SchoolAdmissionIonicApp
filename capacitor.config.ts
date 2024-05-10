import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  plugins: {
    GoogleAuth:{
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive'],
      serverClientId: '70874249042-1lji9itiifjsl1b0g9d9b5obh8ujcc4d.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },

  appId: 'com.international.school',
  appName: 'School Admission',
  webDir: 'www',
  bundledWebRuntime: true,
  overrideUserAgent: "Mozilla/5.0 Google"
};

export default config;
