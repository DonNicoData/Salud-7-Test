import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Configuración de Capacitor para empaquetar la build web como APK Android.
 *
 * - `webDir: 'dist'` apunta al output de `npm run build` (Vite).
 * - `appId` debe ser único y en formato reverse-DNS. Cambialo por tu dominio.
 * - `appName` aparece debajo del ícono en el launcher.
 * - `bundledWebRuntime: false` deshabilita el runtime web embebido en desuso
 *   de Capacitor 6. Usamos la WebView del sistema (Android System WebView).
 * - `android.allowMixedContent: false` por seguridad.
 * - `server.androidScheme: 'https'` para que los service workers y
 *   características modernas (Web APIs) funcionen correctamente dentro
 *   de la WebView. Necesario para que la PWA funcione offline en APK.
 */
const config: CapacitorConfig = {
  appId: 'com.salud7parametros.app',
  appName: 'Salud 7',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#FAF8F5',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
}

export default config
