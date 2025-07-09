import { registerPlugin } from '@capacitor/core';

export interface LaunchOptions {
  package_name: string;
  class_name: string;
  language: string;
  patient_id: string;
  real_id: string;
}

export const NovaIcareLauncher = registerPlugin<{
  launchStethoWithResult(options: LaunchOptions): Promise<void>;
}>('NovaIcareLauncherPlugin');
