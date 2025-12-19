# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [Unreleased]

### Added
- Warning cuando el tiempo de inicio programado está en el pasado (modo "Terminar a las X")
- Muestra el porcentaje alcanzable si empiezas a cargar ahora

### Fixed
- Corrección de variable `batteryCapacity` → `capacity` en el cálculo de porcentaje alcanzable

## [1.2.0] - 2025-12-19

### Added
- Botón de compartir (Web Share API) - solo visible en navegadores compatibles
- Warning para carga DC rápida cuando el objetivo supera 80%
- Etiquetas ARIA para accesibilidad
- Internacionalización de ARIA labels en 5 idiomas

### Fixed
- Contraste de color insuficiente (`--text-muted`: #6a6a7a → #8a8a9a)
- `user-scalable=no` eliminado para permitir zoom (accesibilidad)
- Añadido landmark `<main>` para lectores de pantalla

## [1.1.0] - 2025-12-18

### Added
- Presets de cargadores DC rápidos (50, 100, 150, 250, 350 kW)
- Licencia MIT
- README

### Fixed
- Archivos de análisis eliminados del repositorio

## [1.0.0] - 2025-12-17

### Added
- Calculadora de tiempo de carga para vehículos eléctricos
- Sliders para nivel de batería actual y objetivo
- Presets de cargadores AC (2.3, 3.7, 7.4, 11, 22 kW)
- Capacidad de batería y eficiencia configurables
- Programación de carga con modos "Empezar a las" / "Terminar a las"
- Soporte PWA (instalable como app)
- Internacionalización en 5 idiomas (ES, EN, FR, IT, PT)
- Diseño responsive mobile-first
- Modo oscuro/claro automático
- Persistencia de configuración en localStorage
- Mejoras SEO (meta tags, Open Graph, Schema.org)
