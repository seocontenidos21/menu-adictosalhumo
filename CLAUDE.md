# CLAUDE.md — Adictos al Humo Smokehouse

Contexto y reglas para Claude Code en este proyecto.

## Proyecto

Menú digital web para **Adictos al Humo Smokehouse**. SPA estática (HTML/CSS/JS vanilla) optimizada para móvil, accesible por QR desde las mesas. Deploy en cualquier hosting estático (Netlify, GitHub Pages, etc.).

## Stack

- **Frontend:** HTML5 / CSS3 / JavaScript vanilla (sin frameworks, sin backend)
- **Base de datos:** Supabase (tablas `exchange_rate` y `admin_settings`)
- **Auth admin:** Funciones RPC en PostgreSQL (`verify_admin`, `update_exchange_rate`) con `SECURITY DEFINER`
- **Tipografía:** Bebas Neue (Google Fonts) + Inter
- **Deploy:** Hosting estático (sin servidor)

## Estructura de archivos

```
index.html                  # Menú público (QR)
admin.html                  # Panel admin protegido con contraseña
desarrollo.html             # Menú en desarrollo
css/style.css               # Estilos globales
js/config.js                # Credenciales Supabase (anon key pública)
js/menu-data.js             # Datos del menú (productos y precios)
js/app.js                   # Render del menú + toggle USD/Bs
js/admin.js                 # Lógica del panel admin (llama a Supabase RPC)
js/cart.js                  # Carrito (localStorage)
```

## Supabase

| Tabla | Propósito |
|---|---|
| `exchange_rate` | Tasas USD/Bs (tasa_paralela, tasa_bcv, created_at) |
| `admin_settings` | Contraseña admin (RLS bloquea lectura directa) |

| Función RPC | Propósito |
|---|---|
| `verify_admin(p_password)` | Verifica contraseña, retorna `{ok: true/false}` |
| `update_exchange_rate(p_password, p_tasa_paralela, p_tasa_bcv)` | Verifica + inserta tasa |

Ambas funciones usan `SECURITY DEFINER` — se ejecutan con permisos elevados aunque se llamen con la anon key pública. La tabla `admin_settings` tiene RLS activo sin políticas, así que nadie puede leerla directamente.

## Identidad visual

- Fondo: `#080808` (negro carbón)
- Acento principal: `#cc1111` (rojo BBQ)
- Texto: `#f2f2f2`
- Tipografía headings: **Bebas Neue**, letra espaciada
- Estética: dark theme, borde izquierdo rojo en cards, gradientes sutiles

## Convenciones de código

- Sin frameworks, bundlers ni backend — todo debe funcionar abriendo el HTML directamente
- Los precios en `menu-data.js` siempre en USD (número); la conversión a Bs. se hace en runtime en `app.js`
- No se necesitan variables de entorno ni service role key — toda la lógica sensible vive en funciones RPC de Supabase
- La anon key de Supabase es pública — va en `js/config.js`

---

## Reglas de Integración Figma MCP (CRÍTICO PARA LÍMITES DE API)

Estas reglas definen cómo interactuar con la API de Figma a través del MCP y deben seguirse rigurosamente para conservar la cuota de la API.

### Flujo de trabajo obligatorio (no omitir ningún paso)

1. **Extracción de ID:** Extraer siempre el `node-id` directamente de la URL proporcionada. Nunca escanear a ciegas la raíz del documento.
2. **Mapeo ligero:** Ejecutar `get_metadata` PRIMERO, y únicamente sobre el `node-id` específico, para obtener un mapa de alto nivel de la estructura del nodo.
3. **Extracción profunda:** Solo después de entender la estructura, ejecutar `get_design_context` exclusivamente en los sub-nodos requeridos. Si la respuesta es demasiado grande, apoyarse en el metadata anterior para segmentar la búsqueda.
4. **Verificación visual:** Ejecutar `get_screenshot` exactamente UNA VEZ del nodo o frame objetivo. Usar esa imagen como única fuente de verdad visual.
5. **Ejecución:** Solo después de tener el contexto de diseño y la captura de pantalla, proceder a la implementación del código.

### Prohibiciones

- **Sin reiteración visual:** No volver a llamar a la API de Figma para verificar márgenes, colores o tipografías en fases posteriores. Confiar en el contexto inicial.
- **Sin extracción de tokens:** No usar `get_variable_defs`. El proyecto ya tiene su propio sistema de tokens en `style.css`.
- **Output de Figma = referencia conceptual:** Traducir siempre el código devuelto (React + Tailwind) a las convenciones del proyecto (HTML/CSS/JS vanilla).
- **Assets locales:** Si el MCP devuelve fuentes localhost para imágenes o SVGs, usarlas directamente. Si falta un asset, detener y solicitar al usuario que lo provea.
