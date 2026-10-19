# Tareas 004 — Exposiciones y textos críticos

La spec está aprobada y no tiene dudas abiertas. La solicitud explícita de generar estas tareas se toma como aprobación del plan para pasar a esta fase. Las tareas están en orden de dependencia; las que cambian una pantalla incluyen la aprobación previa señalada en el plan.

## Propuesta de división

El plan requiere **12 tareas** para mantener cada unidad dentro de 20–30 minutos. Se propone dividir el alcance antes de implementar en dos entregas:

- **Exposiciones:** RF-1–RF-3 y sus partes aplicables de RF-6, RF-8–RF-15.
- **Textos críticos:** RF-4–RF-7 y sus partes aplicables de RF-6, RF-8–RF-15.
- La consulta/mapeo compartidos, los helpers SEO/ordenación y la integración común de sitemaps se implementan una sola vez y se asignan a una entrega común; no se duplican.

La división implicaría acordar la organización de las specs y su numeración antes de iniciar la implementación. Mientras tanto, las tareas siguientes describen el alcance combinado de Spec 004.

- [x] **T1. Ampliar la carga de contenido publicado (25 min).** RF-1–RF-7, RF-14–RF-15
- Hecho cuando: el loader consulta las cuatro colecciones publicadas y las pasa al mapper; conserva proyecciones de imagen de exposición solo para assets aceptados; Vitest comprueba consultas, resultados y omisión de imágenes opcionales no válidas. Tests dirigidos: 7/7 pasan. `pnpm --dir web verify`: lint, tipos, build de 9 páginas y 308 tests pasan con `va9sgl77/development`.

- [ ] **T2. Añadir ordenación y metadatos derivados (25 min).** RF-2, RF-4, RF-11
- Hecho cuando: Vitest comprueba exposiciones por fecha descendente con desempate determinista, textos críticos por título localizado con desempate estable, descripciones de exposición basadas solo en título/lugar/fechas y descripciones críticas limitadas a 155 caracteres sin cortar palabras; los metadatos duplicados son rechazados por la validación existente.

- [ ] **T3. Crear los listados de exposiciones ES/EN (30 min).** RF-1–RF-2, RF-8–RF-9, RF-11, RNF-1–RNF-3
- Hecho cuando: se aprueba la composición visual antes de implementarla —y se actualizan primero los tokens y su changelog si se requiere un patrón nuevo—; ambos listados muestran título, lugar, fechas y orden acordado; tienen títulos únicos y metadescripciones funcionales localizadas; existen aunque estén vacíos, sin fallback, y enlazan solo a páginas propias disponibles.

- [ ] **T4. Crear las páginas propias de exposición ES/EN (30 min).** RF-3, RF-6, RF-9–RF-13, RF-15, RNF-1–RNF-7
- Hecho cuando: solo se generan versiones visibles; se muestra fecha localizada, imagen optimizada solo si es válida y relaciones confirmadas con destinos visibles del idioma; canonical, alternates, metadatos y datos estructurados describen solo contenido publicado; las rutas no generadas reciben la 404 prevista.

- [ ] **T5. Crear los listados de textos críticos ES/EN (25 min).** RF-4, RF-8–RF-9, RF-11, RNF-1–RNF-3
- Hecho cuando: ambos listados muestran título y autor en orden alfabético localizado, sin extractos; tienen títulos únicos y metadescripciones funcionales localizadas; el estado vacío está localizado y no usa contenido del otro idioma; cada entrada enlaza a su versión propia publicada.

- [ ] **T6. Crear las páginas propias de textos críticos ES/EN (30 min).** RF-5–RF-6, RF-9–RF-12, RF-15, RNF-1–RNF-7
- Hecho cuando: cada página muestra título, cuerpo completo y autor de la versión publicada, además de relaciones confirmadas con destinos visibles en el mismo idioma; no hay fallback; las descripciones usan el cuerpo según el límite de 155 caracteres; los datos estructurados son válidos y no infieren el tipo de autor.

- [ ] **T7. Enlazar los textos críticos desde las fichas de obra (20 min).** RF-7, RF-9, RF-14–RF-15, RNF-2–RNF-3
- Hecho cuando: antes de modificar la ficha existente se aprueba la ubicación del enlace; el título del texto crítico enlaza a su página en el idioma actual, mientras se conserva el cuerpo completo, y las pruebas cubren la ausencia de enlace sin traducción y los cuatro estados de disponibilidad sin acciones comerciales.

- [ ] **T8. Ampliar el sitemap de páginas (25 min).** RF-1, RF-4, RF-9, RF-13, RNF-5
- Hecho cuando: Vitest verifica que los cuatro listados aparecen incluso vacíos, que solo se incluyen páginas propias publicadas y que los alternates apuntan exclusivamente a versiones existentes.

- [ ] **T9. Ampliar el sitemap de imágenes (20 min).** RF-3, RF-13, RNF-6
- Hecho cuando: Vitest verifica que cada imagen de exposición válida aparece asociada únicamente a una versión lingüística que la muestra, y que imágenes ausentes, inválidas o no transformables se omiten.

- [ ] **T10. Verificar contratos de salida y build (30 min).** RF-1–RF-15, RNF-1, RNF-4–RNF-7
- Hecho cuando: las pruebas de salida comprueban rutas, contenido sin JavaScript de cliente, metadatos, datos estructurados parseables, alternates y sitemaps; el gate rechaza metadatos duplicados; `pnpm --dir web verify` pasa.

- [ ] **T11. Revisar exposiciones en Chrome DevTools y Lighthouse (30 min).** RF-1–RF-3, RF-6, RF-8–RF-15, RNF-1–RNF-7
- Hecho cuando: preview ES/EN se revisa a 375×812, 768×1024 y 1280×900 con listado vacío/poblado, exposición con/sin imagen y relaciones presentes/ausentes; no hay errores de navegación, overflow ni problemas de teclado/contraste; Lighthouse ES de listado y detalle alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO. Si falta contenido de prueba en `development`, se solicita autorización/datos sin modificar Sanity por cuenta propia.

- [ ] **T12. Revisar textos críticos y enlaces desde obra en Chrome DevTools y Lighthouse (30 min).** RF-4–RF-7, RF-9–RF-15, RNF-1–RNF-7
- Hecho cuando: preview ES/EN se revisa a 375×812, 768×1024 y 1280×900, incluyendo original EN sin traducción ES, relaciones vacías y enlace desde obra que conserva el texto completo; Lighthouse ES del listado y detalle alcanza ≥90 rendimiento, ≥95 accesibilidad y 100 SEO; cualquier falta de datos representativos en `development` queda bloqueada hasta recibir autorización, sin modificar producción.
