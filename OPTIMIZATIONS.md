# Optimizaciones Potenciales para WattWait

## Resumen

Este documento lista todas las optimizaciones identificadas en el código fuente. Revísalas y dime cuáles quieres implementar.

---

## 1. RENDIMIENTO

### 1.1 Debounce en `calculate()`
**Impacto:** Medio | **Dificultad:** Baja

Actualmente `calculate()` se ejecuta en cada evento `input` de los sliders, lo que puede generar muchas llamadas por segundo al arrastrar. Añadir debounce de ~50ms reduciría la carga.

```javascript
// Actual: se ejecuta en cada frame
currentChargeSlider.addEventListener('input', calculate);

// Propuesto: debounce
currentChargeSlider.addEventListener('input', debounce(calculate, 50));
```

### 1.2 Throttle en `saveSettings()`
**Impacto:** Medio | **Dificultad:** Baja

`saveSettings()` se llama en cada `calculate()`, escribiendo a localStorage constantemente. Debería tener throttle de ~500ms para evitar escrituras excesivas.

### 1.3 Cachear referencias DOM en `setLanguage()`
**Impacto:** Bajo | **Dificultad:** Baja

`setLanguage()` hace múltiples `querySelector()` cada vez. Estas referencias podrían cachearse al inicio:

```javascript
// Actual (líneas 1267-1293): querySelector en cada cambio de idioma
document.querySelector('.battery-visual')
document.querySelector('.schedule-mode')
// etc.

// Propuesto: cachear al inicio
const batteryVisualEl = document.querySelector('.battery-visual');
```

### 1.4 `requestAnimationFrame` para actualizaciones visuales
**Impacto:** Bajo | **Dificultad:** Media

Envolver las actualizaciones de DOM en `requestAnimationFrame` para sincronizar con el ciclo de renderizado del navegador.

---

## 2. TAMAÑO DEL BUNDLE

### 2.1 Minificar CSS y JS
**Impacto:** Alto | **Dificultad:** Baja

El archivo actual tiene ~1630 líneas. Minificando se reduciría ~40-50%. Opciones:
- Build step con esbuild/terser
- Servir `.min.html` desde GitHub Actions

### 2.2 Comprimir traducciones duplicadas
**Impacto:** Medio | **Dificultad:** Media

Las traducciones ocupan ~230 líneas. Algunas claves como `hours: 'h'` y `minutes: 'min'` son idénticas en todos los idiomas. Podrían extraerse a valores comunes.

### 2.3 Eliminar CSS no utilizado
**Impacto:** Bajo | **Dificultad:** Baja

- `.danger` (línea 82) no se usa en ningún sitio
- `footer a` (línea 675) no hay enlaces en el footer

---

## 3. CALIDAD DE CÓDIGO

### 3.1 Eliminar handlers inline `onclick`
**Impacto:** Bajo | **Dificultad:** Media

Los botones usan `onclick="setPower(2.3)"` en el HTML. Mejor práctica es añadir event listeners desde JS:

```html
<!-- Actual -->
<button onclick="setPower(2.3)">2.3</button>

<!-- Propuesto -->
<button data-power="2.3">2.3</button>
```

```javascript
document.querySelectorAll('[data-power]').forEach(btn => {
    btn.addEventListener('click', () => setPower(parseFloat(btn.dataset.power)));
});
```

### 3.2 Extraer constantes mágicas
**Impacto:** Bajo | **Dificultad:** Baja

Hay números mágicos dispersos:
- `12` (horas para warning)
- `50` (umbral DC)
- `80` (umbral curva DC)
- `0.3` (timeHours multiplier)

```javascript
const THRESHOLDS = {
    LONG_CHARGE_HOURS: 12,
    DC_POWER_MIN: 50,
    DC_CURVE_TARGET: 80
};
```

### 3.3 Simplificar selectores ARIA en `setLanguage()`
**Impacto:** Bajo | **Dificultad:** Baja

Los selectores multilíngua para ARIA son frágiles (líneas 1271-1272):
```javascript
document.querySelector('[aria-label*="capacidad"], [aria-label*="capacity"]...')
```

Mejor usar `data-aria-key`:
```html
<div class="stepper" data-aria-key="ariaCapacityControl">
```

### 3.4 Usar `const` donde sea posible
**Impacto:** Bajo | **Dificultad:** Baja

`currentScheduleMode` (línea 1330) usa `let` pero podría gestionarse de otra forma.

---

## 4. CSS

### 4.1 Usar `prefers-reduced-motion`
**Impacto:** Bajo | **Dificultad:** Baja

Respetar preferencias de usuarios que prefieren menos animaciones:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
        animation: none !important;
    }
}
```

### 4.2 Consolidar transiciones repetidas
**Impacto:** Bajo | **Dificultad:** Baja

`transition: all 0.2s` aparece 8 veces. Podría definirse una clase reutilizable:

```css
.transition-fast { transition: all 0.2s; }
```

### 4.3 Añadir `will-change` para animaciones
**Impacto:** Bajo | **Dificultad:** Baja

Para elementos que se animan frecuentemente:

```css
.battery-fill {
    will-change: width;
}
```

### 4.4 Usar `font-display: swap`
**Impacto:** Bajo | **Dificultad:** Baja

Aunque usa system fonts, si se añaden fuentes custom en el futuro, incluir `font-display: swap`.

### 4.5 CSS Custom Properties para media queries
**Impacto:** Bajo | **Dificultad:** Baja

El padding del body cambia en `@media (min-width: 480px)`. Podría usar custom properties:

```css
:root {
    --body-padding: 16px;
}
@media (min-width: 480px) {
    :root { --body-padding: 24px; }
}
body { padding: var(--body-padding); }
```

---

## 5. HTML

### 5.1 Añadir `loading="lazy"` a imágenes futuras
**Impacto:** N/A ahora | **Dificultad:** Baja

Si se añaden imágenes en el futuro.

### 5.2 Preconnect para recursos externos
**Impacto:** N/A ahora | **Dificultad:** Baja

Si se añaden analytics o fonts externos:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### 5.3 Añadir `noscript` fallback
**Impacto:** Bajo | **Dificultad:** Baja

Para usuarios con JS deshabilitado:

```html
<noscript>
    <p>Esta aplicación requiere JavaScript para funcionar.</p>
</noscript>
```

---

## 6. JAVASCRIPT

### 6.1 Usar `??` en lugar de `||` para defaults
**Impacto:** Bajo | **Dificultad:** Baja

```javascript
// Actual
const capacity = parseFloat(batteryCapacityInput.value) || 50;

// Propuesto (más preciso para valores 0)
const capacity = parseFloat(batteryCapacityInput.value) ?? 50;
```

### 6.2 Extraer función para formatear tiempo
**Impacto:** Bajo | **Dificultad:** Baja

El formateo de tiempo se repite. Extraer a función:

```javascript
function formatTime(hours, minutes, t) {
    if (hours === 0) return `${minutes}<span>${t.minutes}</span>`;
    if (minutes === 0) return `${hours}<span>${t.hours}</span>`;
    return `${hours}<span>${t.hours}</span> ${minutes}<span>${t.minutes}</span>`;
}
```

### 6.3 Usar template literals consistentemente
**Impacto:** Bajo | **Dificultad:** Baja

Mezcla de concatenación y template literals:
```javascript
// Actual (mezcla)
resultTime.innerHTML = hours + '<span>' + t.hours + '</span>';
batteryFill.style.width = current + '%';

// Propuesto (consistente)
resultTime.innerHTML = `${hours}<span>${t.hours}</span>`;
batteryFill.style.width = `${current}%`;
```

### 6.4 Evitar `innerHTML` cuando sea posible
**Impacto:** Bajo | **Dificultad:** Media

`innerHTML` es más lento y menos seguro que `textContent` + manipulación DOM:

```javascript
// Actual
currentValueDisplay.innerHTML = currentCharge + '<span>%</span>';

// Propuesto
currentValueDisplay.firstChild.textContent = currentCharge;
```

### 6.5 Event delegation para presets
**Impacto:** Bajo | **Dificultad:** Media

En lugar de 10 listeners (uno por preset), usar delegation:

```javascript
document.querySelector('.presets').addEventListener('click', (e) => {
    if (e.target.classList.contains('preset-btn')) {
        setPower(parseFloat(e.target.textContent));
    }
});
```

### 6.6 Lazy initialization del Service Worker
**Impacto:** Bajo | **Dificultad:** Baja

El SW se registra en `load`, pero podría diferirse más con `requestIdleCallback`:

```javascript
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => navigator.serviceWorker.register('sw.js'));
} else {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
```

---

## 7. PWA

### 7.1 Añadir `maskable` icon
**Impacto:** Medio | **Dificultad:** Media

Para Android adaptive icons, añadir icono con purpose `maskable` en manifest.json.

### 7.2 Background sync para offline
**Impacto:** Bajo | **Dificultad:** Alta

Si se añade funcionalidad de guardar histórico, implementar background sync.

### 7.3 Añadir shortcuts en manifest
**Impacto:** Bajo | **Dificultad:** Baja

```json
"shortcuts": [
    {
        "name": "Calculadora rápida",
        "url": "/?quick=true",
        "icons": [...]
    }
]
```

---

## 8. ACCESIBILIDAD (adicional)

### 8.1 Skip link
**Impacto:** Bajo | **Dificultad:** Baja

Añadir link para saltar al contenido principal:

```html
<a href="#main" class="skip-link">Saltar al contenido</a>
```

### 8.2 Focus visible mejorado
**Impacto:** Bajo | **Dificultad:** Baja

Mejorar indicador de foco para navegación por teclado:

```css
:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
```

### 8.3 Añadir `aria-live` con debounce
**Impacto:** Bajo | **Dificultad:** Media

El resultado tiene `aria-live="polite"` pero se actualiza muy frecuentemente. Debounce para screen readers.

---

## 9. SEGURIDAD

### 9.1 Content Security Policy
**Impacto:** Medio | **Dificultad:** Baja

Añadir CSP meta tag para prevenir XSS:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'">
```

### 9.2 Subresource Integrity (SRI)
**Impacto:** N/A ahora | **Dificultad:** Baja

Si se añaden scripts externos, usar SRI.

---

## 10. UX

### 10.1 Feedback háptico
**Impacto:** Bajo | **Dificultad:** Baja

Vibración al cambiar valores en móvil:

```javascript
if (navigator.vibrate) {
    navigator.vibrate(10);
}
```

### 10.2 Animación de carga inicial
**Impacto:** Bajo | **Dificultad:** Media

Skeleton loading o fade-in para evitar flash de contenido.

### 10.3 Tooltip en presets
**Impacto:** Bajo | **Dificultad:** Media

Mostrar tipo de cargador al hacer hover/long-press en los botones de preset.

---

## PRIORIZACIÓN RECOMENDADA

### Alta prioridad (impacto visible):
1. [2.1] Minificar CSS/JS
2. [1.1] Debounce en calculate()
3. [1.2] Throttle en saveSettings()

### Media prioridad (mejoras técnicas):
4. [3.1] Eliminar onclick inline
5. [6.5] Event delegation para presets
6. [4.1] prefers-reduced-motion
7. [5.3] noscript fallback

### Baja prioridad (nice-to-have):
8. [3.2] Extraer constantes mágicas
9. [6.3] Template literals consistentes
10. [8.2] Focus visible mejorado

---

## NOTA

Algunas optimizaciones pueden añadir complejidad. Para una app pequeña como esta, el beneficio de ciertas optimizaciones puede no justificar el código adicional. Evalúa caso por caso.
