# ⚡ WattWait

Calculadora de tiempo de carga para coches eléctricos.

**[Usar la app →](https://alejandrosuch.github.io/watt-wait/)**

## Características

- **Cálculo de tiempo de carga** según capacidad de batería y potencia del cargador
- **Eficiencia configurable** para estimaciones realistas
- **Programación de carga**: "Empezar a las" o "Terminar a las"
- **5 idiomas**: Español, English, Français, Italiano, Português
- **PWA instalable**: funciona offline en móvil y escritorio
- **Persistencia**: guarda tu configuración automáticamente

## Presets de potencia

### AC (Carga lenta/semi-rápida)

| Potencia | Tipo de cargador |
|----------|------------------|
| 2.3 kW   | Enchufe doméstico |
| 3.7 kW   | Wallbox monofásico |
| 7.4 kW   | Wallbox monofásico |
| 11 kW    | Wallbox trifásico |
| 22 kW    | Wallbox trifásico |

### DC (Carga rápida)

| Potencia | Tipo de cargador |
|----------|------------------|
| 50 kW    | CCS/CHAdeMO básico |
| 100 kW   | CCS estándar |
| 150 kW   | CCS alta potencia |
| 250 kW   | Tesla Supercharger V3 |
| 350 kW   | Ionity / CCS ultrarrápido |

## Instalación como app

### Android (Chrome)
Visita la URL → Menú ⋮ → "Instalar app"

### iOS (Safari)
Visita la URL → Compartir ↑ → "Añadir a pantalla de inicio"

### Desktop (Chrome/Edge)
Icono de instalación en la barra de direcciones

## Tecnologías

- HTML/CSS/JS vanilla (sin frameworks)
- PWA con Service Worker
- LocalStorage para persistencia
- Responsive design mobile-first

## Licencia

MIT
