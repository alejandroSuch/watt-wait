# Análisis del Informe Lighthouse

## Resumen de Puntuaciones

La mayoría de auditorías pasaron (77 con score 1), pero hay algunos problemas:

| Score | Cantidad |
|-------|----------|
| 1 (perfecto) | 77 |
| 0 (fallo) | 8 |
| 0.04-0.99 | 8 |

---

## Problemas Detectados

### 1. Speed Index: 20.8s (score: 0) ⚠️ IGNORAR

**Mi opinión: NO es un problema real**

El informe incluye esta advertencia:
> "Chrome extensions negatively affected this page's load performance"

El Speed Index de 20.8s es artificialmente alto por las extensiones del navegador. En condiciones reales (incógnito o sin extensiones), debería ser <2s dado que FCP=1.2s y LCP=1.3s están perfectos.

---

### 2. Max Potential FID: 590ms (score: 0.04) ⚠️ IGNORAR

**Mi opinión: Probablemente falso positivo**

Mismo caso que Speed Index. Las extensiones de Chrome pueden bloquear el hilo principal. En una app tan ligera sin frameworks, esto no debería ser un problema real.

---

### 3. Color Contrast (score: 0) ✅ CORREGIR

**Mi opinión: DE ACUERDO - Fallo garrafal**

```
Element has insufficient color contrast of 3.21
foreground color: #6a6a7a
background color: #1a1a2e
Expected contrast ratio of 4.5:1
```

El `--text-muted` tiene contraste insuficiente. Afecta a:
- `.section-title` (títulos de sección)
- `.presets-label` (etiquetas AC/DC)
- Otros textos secundarios

**Solución**: Cambiar `--text-muted: #6a6a7a` a un color más claro como `#8a8a9a` o `#9a9aaa`.

---

### 4. meta-viewport: user-scalable=no (score: 0) ✅ CORREGIR

**Mi opinión: DE ACUERDO - Fallo garrafal**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

Bloquear el zoom es problemático para usuarios con baja visión. WCAG lo considera un fallo de accesibilidad.

**Solución**: Eliminar `user-scalable=no`.

---

### 5. landmark-one-main: No tiene <main> (score: 0) ✅ CORREGIR

**Mi opinión: DE ACUERDO - Fallo menor pero fácil de arreglar**

La página no tiene un landmark `<main>`. Esto ayuda a los lectores de pantalla a navegar.

**Solución**: Envolver el contenido principal en `<main>`.

---

### 6. label-content-name-mismatch (score: 0) ⚠️ PARCIAL

**Mi opinión: PARCIALMENTE DE ACUERDO**

Algunos elementos tienen `aria-label` que no coincide con el texto visible. Esto puede confundir a usuarios de lectores de pantalla.

Ejemplo: Un botón que dice "2.3" pero tiene `aria-label="2.3 kW - Enchufe doméstico"`.

En este caso, tener más información en el aria-label es útil, no problemático. Sin embargo, Lighthouse lo marca como fallo técnico.

**Solución**: No es crítico, pero podríamos usar `aria-describedby` en lugar de `aria-label` para información adicional.

---

### 7. errors-in-console (score: 0) ⚠️ IGNORAR

**Mi opinión: Probablemente de extensiones**

Los errores en consola suelen venir de extensiones del navegador durante el test. Verificar en modo incógnito.

---

### 8. inspector-issues (score: 0) ⚠️ REVISAR

**Mi opinión: Necesita investigación**

Hay "issues" en DevTools. Podría ser:
- Cookies sin SameSite (de GitHub Pages)
- Recursos de terceros
- Otros problemas del navegador

No necesariamente es un problema del código.

---

## Acciones Recomendadas

### Inmediatas (Fallos Garrafales):

1. **Corregir contraste de color** - Cambiar `--text-muted`
2. **Eliminar `user-scalable=no`** - Permitir zoom
3. **Añadir `<main>`** - Landmark para accesibilidad

### Opcionales:

4. Re-ejecutar Lighthouse en modo incógnito para verificar métricas de rendimiento
5. Revisar `label-content-name-mismatch` caso por caso

---

## Lo que ya estaba en OPTIMIZATIONS.md

- Skip link (8.1) - relacionado con landmark-one-main
- Focus visible (8.2) - relacionado con accesibilidad
- prefers-reduced-motion (4.1) - no reportado pero buena práctica
