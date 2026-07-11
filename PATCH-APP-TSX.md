# Parche para integrar el banner PWA en `App.tsx`

> Este proyecto está en mid-implementación (Fase 8 cerrada, faltan las
> páginas principales `HomePage`, `FormPage`, `MetricsPage`,
> `ResultsPage`, `HistoryPage`). Por eso **no** modifiqué `App.tsx`
> automáticamente — habría roto el build. Cuando termines la
> implementación de esas páginas, hacé los siguientes cambios:

## 1. Importar el wrapper

Al tope de `src/App.tsx`, junto a los otros imports:

```ts
import { PWAWrapper } from '@/components/pwa/PWAWrapper'
```

## 2. Envolver el `<ToastProvider>` en el return final

Buscá el bloque al final de la función `App` que devuelve el JSX y
envolvé el contenido en `<PWAWrapper>`. La forma actual es:

```tsx
return (
  <ToastProvider>
    <Header ... />
    <main>...</main>
    <DiscardConfirmDialog ... />
  </ToastProvider>
)
```

Cambialo a:

```tsx
return (
  <ToastProvider>
    <PWAWrapper>
      <Header ... />
      <main>...</main>
      <DiscardConfirmDialog ... />
    </PWAWrapper>
  </ToastProvider>
)
```

## 3. (Opcional) Claves i18n

Si usás `i18next`, agregá las claves `pwa.ios.title`, `pwa.ios.body`,
`pwa.android.title`, `pwa.android.body`, `pwa.android.button` en tus
archivos de traducción `src/i18n/es.json` y `src/i18n/en.json`. Si no
las agregás, el banner usa los textos en español por defecto (ver
`src/components/pwa/InstallPrompt.tsx`).

## 4. Verificar

```bash
npm run build
npm run preview
```

Abrí `http://localhost:4173/` en Chrome desktop, mirá DevTools →
Application → Manifest, y debería figurar "Salud en 7 Parámetros" con
todos los íconos. En la pestaña "Service Workers" debería aparecer
`/sw.js` (o similar) como activado.

Para probar el banner en Android: abrí la preview desde el celular
(vía IP de red) y tocá el banner inferior.

## 5. Si querés probar el SW en dev

Cambiá en `vite.config.ts`:

```ts
devOptions: {
  enabled: true,   // estaba en false
  type: 'module',
},
```

Y en Chrome DevTools → Application → Service Workers → marcá
"Update on reload" para iterar.
