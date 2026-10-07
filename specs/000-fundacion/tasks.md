# Tareas 000 — Fundación

Ordenadas por dependencia. Cada tarea está dimensionada para 20–30 minutos como máximo. Hay 10 tareas en total.

- [x] **T1. Cerrar las aprobaciones técnicas previas.** RF-14, RF-16, RF-25.
  - Hecho cuando: están aprobadas las dependencias y configuración raíz necesarias y la modificación de `@theme`; el flujo de publicación queda limitado al gate de build exitoso, sin rollback por HTTP posterior.

- [x] **T2. Crear el andamiaje mínimo y el gate de comandos.** RF-14, RF-24.
  - Hecho cuando: el proyecto tiene configuración inicial de Astro/Tailwind v4 y los comandos `lint`, `check`, `build`, `test` y `verify`; `verify` los ejecuta en ese orden y devuelve fallo si cualquier control falla. La comprobación de las páginas generadas se añade en T7, cuando existan las tres rutas.

- [x] **T3. Reflejar los tokens en `@theme`.** RF-21; RNF-2, RNF-3.
  - Hecho cuando: `src/styles/global.css` contiene los tokens aprobados de `design/tokens.md`, incluidos colores, tipografía, spacing, breakpoints tablet/desktop y radio 0, sin valores arbitrarios ni colores/fuentes hardcodeados.

- [x] **T4. Añadir mensajes ES/EN y prueba de paridad.** RF-1, RF-17, RF-18, RF-19, RF-24; RNF-1.
  - Hecho cuando: todos los textos de la fundación existen en ambos idiomas, la resolución de `/` y `/en/` selecciona el idioma correcto y Vitest confirma que los conjuntos de claves ES/EN son idénticos.

- [x] **T5. Construir el layout compartido.** RF-19, RF-21; RNF-2, RNF-3, RNF-5.
  - Hecho cuando: cabecera con marca y selector, pie minimalista y layout común usan los tokens aprobados, no incluyen enlaces de navegación y se pueden recorrer con teclado.

- [x] **T6. Crear las homes ES/EN y sus metadatos básicos.** RF-1, RF-13, RF-17, RF-18, RF-20, RF-22; RNF-1, RNF-4, RNF-5.
  - Hecho cuando: `/` y `/en/` muestran la identificación localizada acordada; cada home tiene `lang`, título y descripción únicos, canonical propio y hreflang recíproco, sin elementos de compra.

- [x] **T7. Crear la 404 bilingüe y validar las páginas del build.** RF-15, RF-18, RF-23; RNF-2, RNF-5.
  - Hecho cuando: una ruta desconocida o idioma no admitido devuelve HTTP 404, muestra contenido ES/EN dentro del layout y enlaza ambas homes; además, `pnpm verify` comprueba tras el build que `dist/` contiene home ES, home EN y 404, y falla si falta alguna.

- [ ] **T8. Configurar la publicación automática desde la rama principal.** RF-14, RF-16, RF-24, RF-25.
  - Hecho cuando: Cloudflare Pages ejecuta `pnpm verify` como comando de build al actualizarse la rama principal y publica el resultado estático solo si termina con éxito; el registro muestra los fallos.

- [ ] **T9. Verificar gate fallido y primera publicación.** RF-15, RF-16, RF-25.
  - Hecho cuando: un build incompleto o cualquier fallo de verificación no sustituye la versión activa; el primer fallo no publica versión y queda registrado; tras el primer despliegue se comprueba manualmente que la home ES responde HTTP 200, sin tratarlo como bloqueo ni rollback automático.

- [ ] **T10. Completar la revisión visual, accesible y de rendimiento.** RF-21, RF-22; RNF-2, RNF-3, RNF-7.
  - Hecho cuando: Chrome DevTools confirma la checklist de tokens y layout a 375, 768 y ≥1280 px, navegación por teclado, contraste AA y foco ≥3:1; Lighthouse manual en homes ES/EN móvil obtiene rendimiento ≥90, accesibilidad ≥95 y SEO 100.
