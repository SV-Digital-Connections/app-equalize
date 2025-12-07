import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';
import { Platform } from 'react-native';
import { log } from '../utils/log';

const APP_CENTER_CONFIG = {
  ios: 'YOUR_IOS_APP_SECRET',
  android: 'YOUR_ANDROID_APP_SECRET',
};

export async function initializeAppCenter() {
  try {
    const appSecret = Platform.select({
      ios: APP_CENTER_CONFIG.ios,
      android: APP_CENTER_CONFIG.android,
    });

    if (!appSecret || appSecret.startsWith('YOUR_')) {
      log.warn('App Center not configured. Skipping initialization.');
      return;
    }

    await Analytics.setEnabled(true);
    await Crashes.setEnabled(true);

    log.info('App Center initialized successfully');
  } catch (error) {
    log.error('Failed to initialize App Center:', error);
  }
}

export async function trackEvent(name: string, properties?: Record<string, string>) {
  try {
    await Analytics.trackEvent(name, properties);
  } catch (error) {
    log.error('Failed to track event:', error);
  }
}

export async function trackError(error: Error, properties?: Record<string, string>) {
  try {
    const errorReport = {
      type: error.name,
      message: error.message,
      stackTrace: error.stack || '',
      wrapperSdkName: 'React Native',
    };
    await Crashes.trackError(errorReport, properties);
  } catch (err) {
    log.error('Failed to track error:', err);
  }
}

export async function isAnalyticsEnabled(): Promise<boolean> {
  try {
    return await Analytics.isEnabled();
  } catch (error) {
    log.error('Failed to check analytics status:', error);
    return false;
  }
}

export async function setAnalyticsEnabled(enabled: boolean): Promise<void> {
  try {
    await Analytics.setEnabled(enabled);
  } catch (error) {
    log.error('Failed to set analytics status:', error);
  }
}
