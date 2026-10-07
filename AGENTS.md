# AGENTS.md — AF Tellería (portfolio de Alejandro Fernández Tellería)

Web portfolio bilingüe (ES/EN) del pintor figurativo expresionista Alejandro Fernández Tellería (Vigo). Presenta su obra por series, con ficha técnica de cada pieza, textos críticos y exposiciones. Su objetivo es dar visibilidad (SEO) y captar consultas de coleccionistas e instituciones. **No es una tienda**: las obras originales no se compran online, se solicitan por formulario.

## Principios y flujo de trabajo

- Principios innegociables: `docs/constitution.md`. Léelo antes de tocar código.
- Metodología SDD (skill `sdd`): cada funcionalidad vive en `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`. Lee la spec activa antes de tocar código.
- Estado del proyecto y decisiones entre sesiones: `MEMORY.md`.

## Stack y estructura

- **Astro** (generación estática, TypeScript estricto). Versiones exactas en `package.json`. `[TODO: versión]`
- **Sanity** (plan gratuito) como CMS headless. El contenido lo edita el artista desde el Studio.
- **Cloudflare Pages** (hosting) con webhook de Sanity que dispara rebuild al publicar.
- **Pages Functions** para el formulario de adquisiciones, con **Resend** (email) y **Cloudflare Turnstile** (anti-spam).
- **i18n:** ES (por defecto) y EN, con `hreflang`.
- **Estilos:** Tailwind CSS v4 con tokens declarados en `@theme` dentro de `src/styles/global.css`.

Estructura (solo lo no obvio):

```
design/                    Capturas de Stitch, HTML exportado (solo referencia), tokens.md
docs/constitution.md       Principios innegociables
specs/<NNN-nombre>/        spec.md, plan.md, tasks.md de cada funcionalidad
MEMORY.md                  Estado y decisiones entre sesiones
.agents/skills/sdd/        Skill de SDD
.opencode/commands/        Comandos /sdd-*
src/domain/                Modelo de dominio en TypeScript puro
src/infrastructure/sanity/ Cliente, queries GROQ y mappers Sanity → dominio
src/components/            Componentes Astro
src/pages/                 Rutas (con prefijo de idioma)
src/i18n/                  Diccionarios ES/EN
src/styles/global.css      Estilos globales y tokens Tailwind v4 en `@theme`
functions/                 Pages Functions (formulario)
sanity/                    Studio y esquemas (con su propio package.json)
```

## Comandos

- Instalar: `pnpm install`
- Desarrollo: `pnpm dev`
- Lint: `pnpm lint`
- Tipos: `pnpm check`
- Tests: `pnpm test`
- Build: `pnpm build`
- Preview del build: `pnpm preview`
- Verificación completa: `pnpm verify`
- Sanity Studio: `pnpm --dir sanity dev`

## Convenciones

- Código y nombres en inglés. Comentarios y documentación en español. `[ajustar si se prefiere otro criterio]`
- Textos de interfaz siempre desde `src/i18n/`, nunca hardcodeados.
- Estilos con Tailwind CSS v4 y solo con tokens: prohibidos los valores arbitrarios de Tailwind y los colores, fuentes o espaciados hardcodeados. Texto siempre en colores sólidos, nunca con opacidad.
- Los valores de `@theme` en `src/styles/global.css` deben coincidir con `design/tokens.md`. Todo cambio de token se hace primero en `design/tokens.md` y después se refleja en `@theme`.
- JavaScript en cliente al mínimo: componentes Astro sin hidratación por defecto.
- Componentes pequeños y con una sola responsabilidad. Sin abstracciones "por si acaso".
- Archivo de referencia para nuevos componentes y páginas: `[TODO: fijar tras las specs 000/002]`

## Reglas de dominio / trampas conocidas

- **No hay compra online.** El CTA de las obras es "Solicitar información / Adquirir" y abre el formulario con la obra preseleccionada.
- **`Availability`:** `disponible | reservada | vendida | en colección`. La cambia el artista a mano en Sanity. El botón de adquisición solo aparece si está `disponible`. Cada estado se muestra siempre con etiqueta de texto, nunca solo con color.
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
  - Ejecutar `pnpm verify` antes de dar algo por terminado.
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
  - Añadir backend propio, base de datos, carrito o pasarela de pago.
  - Subir secretos o `.env` al repositorio.
  - Modificar contenido de producción en Sanity.
  - Renombrar o borrar IDs de Sanity sin migración acordada.
  - Copiar el HTML de Stitch sin adaptarlo.
  - Introducir patrones de arquitectura no previstos.

## Verificación

Un cambio no está terminado hasta que:

1. `pnpm verify` pasa (lint, tipos, tests y build).
2. La página afectada se revisa en el preview en móvil (375 px) y escritorio, comparada con las capturas de `design/`.
3. En páginas de contenido: JSON-LD válido, `hreflang` correcto y contenido presente en el HTML sin ejecutar JS.
4. Lighthouse (manual) en la página afectada: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100. `[ajustar si hace falta]`
5. Si toca el formulario: probar envío real en preview, con Turnstile activo.
