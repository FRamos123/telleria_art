# AGENTS.md — AF Tellería (portfolio de Alejandro Fernández Tellería)

Web portfolio bilingüe (ES/EN) del pintor figurativo expresionista Alejandro Fernández Tellería (Vigo). Presenta su obra por series, con ficha técnica de cada pieza, textos críticos y exposiciones. Su objetivo es dar visibilidad (SEO) y captar consultas de coleccionistas e instituciones. **No es una tienda**: las obras originales no se compran online, se solicitan por formulario.

## Stack y estructura

- **Astro** (generación estática, TypeScript estricto). Fijar versiones exactas en `package.json`. `[TODO: versión]`
- **Sanity** (plan gratuito) como CMS headless. El contenido lo edita el artista desde el Studio.
- **Cloudflare Pages** para hosting, con webhook de Sanity que dispara rebuild al publicar.
- **Pages Functions** para el formulario de adquisiciones, con **Resend** (email) y **Cloudflare Turnstile** (anti-spam).
- **i18n:** ES (por defecto) y EN, con `hreflang`.
- **Sin backend propio ni base de datos.** Arquitectura serverless deliberada.

Estructura (solo lo no obvio):

```
design/                    Capturas de Stitch, HTML exportado (solo referencia), tokens de diseño
specs/<NNN-nombre>/        spec.md, plan.md, tasks.md de cada funcionalidad
memory.md                  Decisiones y contexto acumulado entre sesiones
src/domain/                Modelo de dominio en TypeScript puro (sin imports de Astro ni Sanity)
src/infrastructure/sanity/ Cliente, queries GROQ y mappers Sanity → dominio
src/components/            Componentes Astro
src/pages/                 Rutas (con prefijo de idioma)
src/styles/tokens.css      Tokens de diseño (colores, tipografía, espaciado)
src/i18n/                  Diccionarios ES/EN
functions/                 Pages Functions (formulario de adquisiciones)
sanity/                    Studio y esquemas
```

## Comandos


- Instalar: `pnpm install`
- Desarrollo: `pnpm dev`
- Lint: `pnpm lint`
- Tipos: `pnpm astro check`
- Tests: `pnpm test`
- Build: `pnpm build`
- Preview del build: `pnpm preview`

## Convenciones

- Código y nombres en inglés. Comentarios y documentación en español. `[ajustar si se prefiere otro criterio]`
- Textos de interfaz siempre desde `src/i18n/`, nunca hardcodeados en componentes.
- Estilos solo con los tokens de `src/styles/tokens.css`. Sin colores, fuentes ni espaciados sueltos.
- JavaScript en cliente al mínimo: por defecto, componentes Astro sin hidratación.
- Componentes pequeños y con una responsabilidad. Sin abstracciones "por si acaso".
- Archivo de referencia para nuevos componentes y páginas: `[TODO: fijar tras completar la spec 000/002]`

## Reglas de dominio / trampas conocidas

- **No hay compra online.** El CTA de las obras es "Solicitar información / Adquirir", que abre el formulario con la obra preseleccionada. Nada de carrito, checkout ni pagos.
- **Estado de la obra (`Availability`):** `disponible | reservada | vendida | en colección`. Lo cambia el artista a mano en Sanity. El botón de adquisición solo aparece si está `disponible`.
- **`InventoryNumber`:** formato `AFT-AAAA-NNN` (ej. `AFT-2023-018`). Es un value object con validación.
- **`Dimensions`:** siempre en cm (`alto × ancho`). El "Formato Figura 60" es una etiqueta de contenido, no se calcula.
- **Dominio ligero:** modelo tipado, value objects y una capa de mapeo desde Sanity. Sin bounded contexts, agregados, repositorios genéricos ni CQRS. Esto es una web de contenido.
- **`src/domain/` no depende de Astro ni de Sanity.** Las páginas consumen el dominio, nunca documentos crudos del CMS.
- **SEO es requisito de primer nivel:** cada obra y cada serie con URL propia, HTML renderizado en build, título y descripción únicos, `alt` descriptivo, JSON-LD (`Person`, `VisualArtwork`, `ExhibitionEvent`), `hreflang`, sitemap y sitemap de imágenes.
- **Imágenes:** siempre con transformaciones (AVIF/WebP, tamaños responsive) y `width`/`height` explícitos para evitar CLS. Nunca servir el original a máxima resolución.
- **Queries a Sanity solo en build**, no desde el cliente. Respetar los límites del plan gratuito.
- **Accesibilidad:** contraste WCAG AA. Ojo con el número de inventario sobre la imagen (en el diseño es rojo oscuro sobre fondo oscuro y no cumple).
- **El HTML exportado de Stitch es solo referencia.** Se reimplementa en componentes Astro con los tokens, no se copia tal cual.
- **El contenido es del artista:** no inventar títulos, textos críticos, notas de taller ni datos de obras. Si falta contenido, usar un placeholder claramente marcado.

## Forma de trabajar

- Antes de tocar código: leer `spec.md`, `plan.md` y `tasks.md` de la spec activa.
- Planificar antes de implementar. Si la tarea no encaja en la spec, parar y preguntar.
- Cambios pequeños, una tarea de `tasks.md` cada vez, sin mezclar refactors con funcionalidad.
- Al terminar cada tarea: marcar en `tasks.md`, resumir qué cambió y por qué, qué se verificó y qué queda pendiente. Registrar en `memory.md` las decisiones relevantes.

## Memoria
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones
tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su
porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de
dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales).

## Límites

- ✅ **Siempre:**
  - Usar tokens de diseño y textos i18n.
  - Ejecutar lint, comprobación de tipos y build antes de dar algo por terminado.
  - Mantener accesibilidad y SEO en cada página nueva.
  - Mantener actualizados `tasks.md` y `memory.md`.
  - Siempre: actualizar `MEMORY.md` al terminar cada tarea.
- ⚠️ **Preguntar antes:**
  - Añadir dependencias.
  - Crear archivos o carpetas fuera de la estructura descrita.
  - Cambiar esquemas de Sanity (pueden romper contenido existente).
  - Cambiar tipos públicos del dominio.
  - Añadir JavaScript en cliente o servicios externos nuevos.
- 🚫 **Nunca:**
  - Añadir backend propio, base de datos, carrito o pasarela de pago.
  - Subir secretos o `.env` al repositorio.
  - Modificar contenido de producción en Sanity.
  - Renombrar o borrar IDs de campos/documentos de Sanity sin migración acordada.
  - Copiar el HTML de Stitch sin adaptarlo.
  - Introducir patrones de arquitectura no previstos en este documento.

## Verificación

Un cambio no está terminado hasta que:

1. `pnpm lint`, `pnpm astro check`, `pnpm test` y `pnpm build` pasan sin errores. `[TODO: ajustar a los comandos reales]`
2. La página afectada se revisa en el preview, en móvil y escritorio, y se compara con las capturas de `design/`.
3. En páginas de contenido: el JSON-LD valida (Rich Results Test), `hreflang` es correcto y el HTML renderizado contiene el contenido sin ejecutar JS.
4. Lighthouse en la página afectada: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100. `[ajustar objetivos si hace falta]`
5. Si toca el formulario: probar envío real en preview, con Turnstile activo.
