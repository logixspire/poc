import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.logixspire.remedi',
  appName: 'ReMeDi-POC',
  webDir: 'www',
  cordova: {},
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    // NovaIcareLauncher: {
    //   classPath: 'com.logixspire.remedi.plugins.NovaIcareLauncherPlugin',
    // },
  },
};

export default config;
