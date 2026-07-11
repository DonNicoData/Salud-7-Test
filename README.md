# Salud en 7 Parámetros

Aplicación **100% local** (PWA + APK Android + iOS) para que
profesionales de la salud registren y den seguimiento a 7 métricas
corporales de sus clientes con visualización por semáforo y exportación
a Excel/PDF.

> 📖 **Guía completa de instalación local en celular** →
> [`INSTALL.md`](./INSTALL.md) (iOS, Android, GitHub Pages, todo paso a paso).

> **Estado:** Plan aprobado — implementación en curso.
> Ver [`PLAN.md`](./PLAN.md) para la planificación completa y
> [`MILESTONES.md`](./MILESTONES.md) para el historial.

## 🆕 Novedades: Instalación local en celular

Esta versión del proyecto está lista para que la app se instale en
**iPhone y Android** sin pasar por App Store ni Play Store:

| Plataforma | Método | Resultado |
|---|---|---|
| **iOS** (iPhone/iPad) | Safari → Compartir → "Añadir a pantalla de inicio" | Ícono en la pantalla, abre sin barra de Safari, datos locales |
| **Android** (Chrome/Edge) | Menú → "Instalar app" (o banner automático) | APK web instalable, ícono en launcher, datos locales |
| **Android** (APK compartible) | `bash scripts/build-android.sh` → WhatsApp/USB/Drive | `.apk` firmado, instalable en cualquier Android |

**No necesitás:** App Store, Play Store, Xcode, ni subir la app a
ningún servicio externo. Todo queda en el dispositivo del usuario.

> Detalles técnicos, requisitos y solución de problemas:
> [`INSTALL.md`](./INSTALL.md)

## Características planificadas

- 7 métricas: Peso, IMC, % Grasa, % Masa muscular, Calorías, Edad
  biológica, Grasa visceral
- Datos básicos: nombre, fecha de nacimiento, edad (auto), altura,
  género, contextura de muñeca
- Resultados con semáforo (verde / ámbar / coral) y tooltips
  explicativos
- Sección de evolución cuando los datos básicos coinciden con un
  cliente existente
- Exportación a Excel (`.xlsx`) y PDF con formato
  `NombreApellido_Fecha_Hora`
- Panel de administración con CRUD, filtro por nombre y "Ver todos"
- Identidad visual cálida, paleta de verdes y tonos suaves
- Bilingüe: Español (por defecto) / Inglés
- **100% local**: IndexedDB (vía Dexie), sin servidor, sin envío
  automático de datos
- **PWA instalable** en iOS y Android + **APK Android compartible**

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Dexie.js (IndexedDB)
- SheetJS (Excel) + jsPDF (PDF)
- i18next (ES/EN)
- **vite-plugin-pwa** (service worker + offline)
- **Capacitor** (wrap APK Android)

## Privacidad

Todos los datos se guardan **únicamente en el dispositivo**. Nada se
envía a internet. La exportación a Excel/PDF es siempre una acción
manual del usuario.

## Desarrollo

### Entorno estándar (Linux/macOS)

```bash
npm install
npm run dev          # desarrollo (http://localhost:5173)
npm run build        # build de producción → dist/
npm run preview      # preview local con SW
npm run typecheck    # verificación de tipos
npm run test         # tests unitarios (Vitest)
```

### Entorno WSL (este equipo)

```bash
bash scripts/run.sh install     # instalar dependencias
bash scripts/run.sh dev         # servidor de desarrollo
bash scripts/run.sh build       # build de producción
bash scripts/run.sh typecheck   # verificación de tipos
bash scripts/run.sh test        # tests unitarios (Vitest)
bash scripts/run.sh preview     # preview local
```

### Generar APK Android local

```bash
bash scripts/build-android.sh
```

APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Ver
[`INSTALL.md`](./INSTALL.md) §B para más detalles.

### Deploy a GitHub Pages (hosting gratuito para PWA)

1. Subí el repo a GitHub.
2. Settings → Pages → Source: **GitHub Actions**.
3. Push a `main` → deploy automático.

La app queda en `https://<usuario>.github.io/<repo>/` con HTTPS (la
PWA requiere HTTPS para ser instalable).

## Licencia

Privado / Personal.
