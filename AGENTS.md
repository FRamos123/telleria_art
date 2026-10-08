# AGENTS.md — AF Tellería (portfolio de Alejandro Fernández Tellería)

Web portfolio bilingüe (ES/EN) del pintor figurativo expresionista Alejandro Fernández Tellería (Vigo). Presenta su obra por series, con ficha técnica de cada pieza, textos críticos y exposiciones. Su objetivo es dar visibilidad (SEO), captar consultas de coleccionistas e instituciones y permitir comprar obras originales disponibles o prints configurados mediante pasarela de pago. Los detalles comerciales pendientes deben cerrarse en una spec aprobada antes de implementarse.

## Principios y flujo de trabajo

- Principios innegociables: `docs/constitution.md`. Léelo antes de tocar código.
- Metodología SDD (skill `sdd`): cada funcionalidad vive en `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`. Lee la spec activa antes de tocar código.
- Estado del proyecto y decisiones entre sesiones: `MEMORY.md`.

## Stack y estructura

- **Astro** (generación estática, TypeScript estricto). Versiones exactas en `web/package.json`.
- **Sanity** (plan gratuito) como CMS headless. El contenido lo edita el artista desde el Studio.
- **Cloudflare Pages** (hosting) con webhook de Sanity que dispara rebuild al publicar.
- **Pages Functions** para el formulario de consultas, con **Resend** (email) y **Cloudflare Turnstile** (anti-spam). La integración de compra y pasarela queda pendiente de una spec aprobada; no se ha elegido proveedor.
- **i18n:** ES (por defecto) y EN, con `hreflang`.
- **Estilos:** Tailwind CSS v4 con tokens declarados en `@theme` dentro de `web/src/styles/global.css`.

Estructura (solo lo no obvio):

```
design/                    Capturas de Stitch, HTML exportado (solo referencia), tokens.md
docs/constitution.md       Principios innegociables
specs/<NNN-nombre>/        spec.md, plan.md, tasks.md de cada funcionalidad
MEMORY.md                  Estado y decisiones entre sesiones
.agents/skills/sdd/        Skill de SDD
.opencode/commands/        Comandos /sdd-*
web/                       Paquete Astro; incluye `src/`, `public/` y su configuración/dependencias
web/src/domain/            Modelo de dominio en TypeScript puro
web/src/infrastructure/sanity/ Cliente, queries GROQ y mappers Sanity → dominio
web/src/components/        Componentes Astro
web/src/pages/             Rutas (con prefijo de idioma)
web/src/i18n/              Diccionarios ES/EN
web/src/styles/global.css  Estilos globales y tokens Tailwind v4 en `@theme`
web/functions/             Pages Functions (formulario y futuras funciones aprobadas)
studio/                    Sanity Studio y esquemas, paquete independiente
```

## Comandos

- Instalar web: `pnpm --dir web install`
- Desarrollo web: `pnpm --dir web dev`
- Lint web: `pnpm --dir web lint`
- Tipos web: `pnpm --dir web check`
- Tests web: `pnpm --dir web test`
- Build web: `pnpm --dir web build`
- Preview del build web: `pnpm --dir web exec astro preview`
- Verificación completa web: `pnpm --dir web verify`
- Instalar Studio: `pnpm --dir studio install`
- Desarrollo Studio: `pnpm --dir studio dev`
- Build Studio: `pnpm --dir studio build`

## Convenciones

- Código y nombres en inglés. Comentarios y documentación en español. `[ajustar si se prefiere otro criterio]`
- Textos de interfaz siempre desde `web/src/i18n/`, nunca hardcodeados.
- Estilos con Tailwind CSS v4 y solo con tokens: prohibidos los valores arbitrarios de Tailwind y los colores, fuentes o espaciados hardcodeados. Texto siempre en colores sólidos, nunca con opacidad.
- Los valores de `@theme` en `web/src/styles/global.css` deben coincidir con `design/tokens.md`. Todo cambio de token se hace primero en `design/tokens.md` y después se refleja en `@theme`.
- JavaScript en cliente al mínimo: componentes Astro sin hidratación por defecto.
- Componentes pequeños y con una sola responsabilidad. Sin abstracciones "por si acaso".
- Archivo de referencia para nuevos componentes y páginas: `[TODO: fijar tras las specs 000/002]`

## Reglas de dominio / trampas conocidas

- **Comercio pendiente de especificación.** Se prevén compras de obra original y prints de tamaños por determinar. No implementar carrito, checkout ni pagos hasta aprobar su spec, incluidos proveedor, precios, variantes, logística y políticas.
- **`Availability`:** `disponible | reservada | vendida | en colección`. La cambia el artista a mano en Sanity. La compra de la obra original solo podrá ofrecerse si está `disponible`; cada estado se muestra siempre con etiqueta de texto, nunca solo con color. No inferir la disponibilidad de prints a partir del estado del original: la regla queda pendiente de la spec comercial.
- **`InventoryNumber`:** formato `AFT-AAAA-NNN` (ej. `AFT-2023-018`), value object con validación.
- **`Dimensions`:** siempre en cm (`alto × ancho`). "Formato Figura 60" es una etiqueta de contenido, no se calcula.
- **Dominio ligero:** modelo tipado, value objects y capa de mapeo desde Sanity. Sin bounded contexts, agregados, repositorios genéricos ni CQRS.
- **Imágenes:** siempre con transformaciones (AVIF/WebP, tamaños responsive) y `width`/`height` explícitos. Nunca el original a máxima resolución.
- **Queries a Sanity solo en build**, nunca desde el cliente.
- **El HTML exportado de Stitch es solo referencia.** Se reimplementa con los tokens, no se copia.
- **El contenido es del artista:** no inventar títulos, textos críticos ni datos de obras. Si falta contenido, placeholder claramente marcado.
- **Pantallas nuevas:** componer solo con patrones y tokens de `design/tokens.md`. Si hace falta un patrón nuevo o cambiar un token, proponerlo y actualizar `tokens.md` (con entrada en su changelog) antes de tocar el código.

## Forma de trabajar

- Antes de tocar código: leer la constitución, la spec activa (`spec.md`, `plan.md`, `tasks.md`) y `MEMORY.md`.
- Seguir el flujo SDD y sus puertas de aprobación. Si algo no está en la spec, no se implementa: se para y se pregunta.
- Una tarea de `tasks.md` cada vez, sin mezclar refactors con funcionalidad.
- Al terminar cada tarea: marcarla en `tasks.md`, resumir qué cambió, qué se verificó y qué queda pendiente. Registrar en `MEMORY.md` las decisiones relevantes.

## Límites

- ✅ **Siempre:**
  - Usar tokens de diseño y textos i18n.
  - Ejecutar `pnpm --dir web verify` antes de dar algo por terminado.
  - Mantener accesibilidad y SEO en cada página nueva.
  - Mantener actualizados `tasks.md` y `MEMORY.md`.
- ⚠️ **Preguntar antes:**
  - Añadir dependencias.
  - Crear archivos o carpetas fuera de la estructura descrita.
  - Modificar los valores de `@theme`.
  - Cambiar esquemas de Sanity o tipos públicos del dominio.
  - Cambiar paleta, tipografía o layout de una pantalla existente.
  - Añadir JavaScript en cliente o servicios externos nuevos.
- 🚫 **Nunca:**
  - Usar valores arbitrarios de Tailwind.
  - Añadir o cambiar la pasarela, servicios externos, carrito o tratamiento de pedidos sin aprobación explícita en la spec y el plan. Nunca procesar ni almacenar datos sensibles de tarjetas en el proyecto.
  - Subir secretos o `.env` al repositorio.
  - Modificar contenido de producción en Sanity.
  - Renombrar o borrar IDs de Sanity sin migración acordada.
  - Copiar el HTML de Stitch sin adaptarlo.
  - Introducir patrones de arquitectura no previstos.

## Verificación

Un cambio no está terminado hasta que:

1. `pnpm --dir web verify` pasa (lint, tipos, tests y build).
2. La página afectada se revisa en el preview en móvil (375 px) y escritorio, comparada con las capturas de `design/`.
3. En páginas de contenido: JSON-LD válido, `hreflang` correcto y contenido presente en el HTML sin ejecutar JS.
4. Lighthouse (manual) en la página afectada: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100. `[ajustar si hace falta]`
5. Si toca el formulario: probar envío real en preview, con Turnstile activo.
