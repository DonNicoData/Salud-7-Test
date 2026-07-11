# Guía de instalación local — iOS y Android

> Esta guía explica cómo instalar la app en tu celular **sin Play Store ni
> App Store**, y sin subir la app a ningún servicio externo. Todo queda
> 100% en tu dispositivo.

## Índice

1. [Opción A: PWA (recomendada) — funciona en iOS y Android](#opción-a-pwa)
2. [Opción B: APK Android local (Capacitor)](#opción-b-apk-android)
3. [Desarrollo local (modo dev)](#desarrollo-local)
4. [Publicar en GitHub Pages (opcional)](#github-pages)
5. [Solución de problemas](#solución-de-problemas)

---

## Opción A: PWA (recomendada) ✅

**Por qué PWA:** un solo build sirve para iOS y Android. No necesitás
compilar nada nativo, no necesitás Android Studio, no necesitás Xcode.
Solo necesitás un servidor HTTPS para hostear la app (o usar GitHub
Pages, que es gratis).

### A.1 — Probar en el celular en 2 minutos (con tu compu)

```bash
# 1. Instalar dependencias
npm install

# 2. Build de producción
npm run build

# 3. Servir localmente
npm run preview -- --host 0.0.0.0 --port 4173
```

Vite va a mostrar algo como:

```
➜  Local:   http://localhost:4173/
➜  Network: http://192.168.0.50:4173/
```

Abrí `http://192.168.0.50:4173/` en el navegador del celular
(**mismo WiFi que tu compu**).

> ⚠️ Los service workers PWA **requieren HTTPS** o `localhost`.
> Si no podés usar HTTPS, podés probar la app igual, pero el botón
> "Instalar" no va a aparecer en Android. Para iOS, HTTPS es
> obligatorio para "Add to Home Screen".

### A.2 — Instalar en **Android** (Chrome / Edge / Samsung Internet)

1. Abrí la URL de la app en Chrome.
2. Andá al menú (⋮ arriba a la derecha) → **"Instalar app"** o
   **"Añadir a la pantalla principal"**.
3. Aceptá. La app aparece como un ícono más en el launcher, abre sin
   barra de Chrome, y funciona offline.

Alternativa: aparece un banner automático en la parte inferior que dice
"Instalar la app" (lo provee `InstallPrompt.tsx`).

### A.3 — Instalar en **iOS** (iPhone / iPad, Safari)

iOS **no** muestra el banner automático. Hay que hacerlo manual:

1. Abrí la URL en **Safari** (no en Chrome iOS, no funciona).
2. Tocá el botón **Compartir** (el cuadrado con la flecha hacia arriba,
   en la barra inferior).
3. Elegí **"Añadir a pantalla de inicio"** (`Add to Home Screen`).
4. Confirmá el nombre "Salud 7" → tocá **Añadir**.

La app aparece como un ícono en tu pantalla, abre en modo standalone
(sin barra de Safari) y guarda los datos localmente con IndexedDB.

> 💡 La primera vez que el usuario abre la app, aparece un cartel
> automático (en `InstallPrompt.tsx`) recordándole el paso.

---

## Opción B: APK Android (Capacitor) 📦

Esta opción genera un archivo `.apk` que podés:
- copiar por USB
- mandar por WhatsApp
- subir a Drive
- pasar por cable

Y se instala directamente sin Play Store. **El usuario tiene que
activar "Instalar apps de orígenes desconocidos" en Ajustes.**

### B.1 — Requisitos (una sola vez)

| Herramienta | Versión | Cómo instalar |
|---|---|---|
| **Node.js** | 20+ | https://nodejs.org |
| **JDK** | 17 | `brew install openjdk@17` (macOS) o `choco install temurin17` (Windows) o `sudo apt install openjdk-17-jdk` (Linux) |
| **Android Studio** | Hedgehog o + | https://developer.android.com/studio |
| **Android SDK** | Platform 34, build-tools 34.0.0 | Se instala desde Android Studio → SDK Manager |

Configurá `ANDROID_HOME` apuntando al SDK. Por ejemplo en `~/.bashrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
```

Verificá con:

```bash
node --version    # v20+
java -version     # 17+
adb --version     # Android Debug Bridge
```

### B.2 — Generar APK debug (compartible, sin firma)

```bash
bash scripts/build-android.sh
```

O paso a paso:

```bash
npm install
npm run build
npx cap add android        # solo la primera vez
npx cap sync android
cd android
./gradlew assembleDebug
```

El APK queda en:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Para instalarlo en un celular por USB:**

```bash
# 1. Activá "Depuración USB" en el celular
#    Ajustes → Opciones de desarrollador (activarlos con 7 toques en Build Number)
#    Ajustes → Opciones de desarrollador → Depuración USB → ON

# 2. Conectá por USB y autorizá la depuración en el celular

# 3. Verificá que se detecta
adb devices

# 4. Instalá
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

**Para compartirlo sin USB** (WhatsApp, Drive, etc.):

El `app-debug.apk` se puede mandar por cualquier medio. En el celular
receptor:

1. Abrir el APK desde el archivo descargado.
2. Android pregunta: "Permitir instalar apps de esta fuente" → Ajustes →
   activar permiso.
3. Volver y tocar "Instalar".

### B.3 — Generar APK release (firmado, listo para distribuir)

```bash
# 1. Generar keystore (una sola vez, guardalo bien — sin él no podés
#    actualizar la app en el futuro)
keytool -genkey -v \
  -keystore release.keystore \
  -alias salud7 \
  -keyalg RSA -keysize 2048 \
  -validity 10000

# 2. Compilar release
bash scripts/build-android.sh release

# 3. Firmar el APK
$ANDROID_HOME/build-tools/34.0.0/apksigner sign \
  --ks release.keystore \
  --out app-release.apk \
  android/app/build/outputs/apk/release/app-release-unsigned.apk

# 4. (Opcional) Verificar firma
$ANDROID_HOME/build-tools/34.0.0/apksigner verify app-release.apk
```

---

## Desarrollo local

```bash
# Linux / macOS
npm install
npm run dev

# WSL (este equipo)
bash scripts/run.sh dev
```

Abre `http://localhost:5173`. El service worker **no se registra en
modo dev** (ver `vite.config.ts` → `devOptions.enabled: false`). Si
querés probar la PWA en dev:

```bash
# 1. Habilitar SW en dev (cambiar devOptions.enabled a true en vite.config.ts)
npm run dev

# 2. En Chrome: DevTools → Application → Service Workers
#    Verás el SW registrado. Marcar "Update on reload" para iterar.
```

---

## GitHub Pages (hosting gratuito para la PWA)

GitHub Pages sirve la app en HTTPS, que es lo que necesita la PWA para
ser instalable. Es **gratis y no requiere tarjeta**.

### Setup una sola vez

1. Subí el repo a GitHub.
2. Settings → Pages → Source: **GitHub Actions**.
3. El workflow `.github/workflows/deploy-pwa.yml` ya está configurado.
   Cada push a `main` deploya automáticamente.
4. Esperá ~2 min. Tu app queda en
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

### Notas

- El workflow usa `VITE_BASE=/<nombre-del-repo>/` automáticamente.
- Si tu repo es privado, GitHub Pages no funciona — hacelo público
  (la app es 100% local, no hay backend que filtrear).
- El dominio custom es opcional: Settings → Pages → Custom domain.

### Alternativas a GitHub Pages (todas con HTTPS gratis)

- **Netlify** — drop a la carpeta `dist/` desde la web.
- **Vercel** — importar el repo, build command `npm run build`,
  output dir `dist`.
- **Cloudflare Pages** — similar a Netlify.
- **Tu propio dominio** — `dist/` es estático, serví con nginx, Caddy,
  o cualquier hosting con HTTPS (Let's Encrypt).

---

## Solución de problemas

### "No me aparece el botón de instalar" (Android)

- Asegurate de estar en **HTTPS** o **localhost**. Los service workers
  no funcionan en HTTP.
- El manifest debe estar bien servido. Abrí DevTools → Application →
  Manifest y revisá que no haya errores.
- La app debe tener un service worker activo. DevTools → Application →
  Service Workers → debe figurar `sw.js` con status "activated".

### "En iOS no se puede instalar" (Safari)

- iOS sólo permite instalar PWAs desde **Safari**, no desde Chrome iOS.
- El sitio debe ser HTTPS.
- El `apple-touch-icon` debe existir. Ver
  `public/icons/apple-touch-icon-180x180.png`.

### "El APK no instala" (Android)

- El celular debe permitir instalar de "orígenes desconocidos" (Ajustes
  → Seguridad → Orígenes desconocidos / Instalar apps desconocidas).
- En Android 8+, el permiso es por app: Ajustes → Apps → Chrome (o la
  app con la que abriste el APK) → Instalar apps desconocidas → ON.
- El APK debe estar firmado (incluso el debug lo está, con la debug
  keystore de Android Studio).

### "El build falla: capacitor no encuentra dist/"

```bash
npm run build      # primero construir
npx cap sync android
```

### "iOS no guarda los datos"

- Verificá que no estés en "Modo Privado" de Safari (deshabilita
  IndexedDB).
- El modo "Add to Home Screen" usa almacenamiento persistente, pero si
  el usuario fuerza la app y la reabre, los datos siguen ahí.

---

## Privacidad y datos

**Todos los datos quedan en el dispositivo.** Nada se envía a internet.
La exportación a Excel/PDF es una acción manual del usuario.

| Plataforma | Almacenamiento |
|---|---|
| Web / PWA (navegador) | IndexedDB del navegador |
| PWA instalada (Add to Home Screen) | IndexedDB persistente (no se borra al cerrar) |
| APK Android (Capacitor) | IndexedDB dentro del data dir de la app Android |

Para **borrar todos los datos**:

- **Web/PWA:** DevTools → Application → Storage → Clear site data.
- **PWA iOS:** borrar la app desde la pantalla de inicio borra los datos.
- **APK Android:** Ajustes → Apps → Salud 7 → Almacenamiento → Borrar datos.
