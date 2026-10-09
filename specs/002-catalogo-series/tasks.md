# Tareas — Spec 002

> Cada tarea está acotada a 20–30 minutos. T10 depende de la aprobación de la Spec 003 y su plan; no iniciar esa tarea antes.

- [ ] **T1. Preparar la carga de contenido visible por idioma.** RF-1, RF-4, RF-6–RF-8, RF-11–RF-12
  - Hecho cuando: el cargador de build reutiliza las consultas y `mapSanityContent`; Vitest comprueba visibilidad por idioma, relaciones conservadas y ausencia de fallback o revalidación en las páginas.

- [ ] **T2. Ordenar obras por año e inventario.** RF-2
  - Hecho cuando: Vitest comprueba año descendente, `InventoryNumber` ascendente en empates y orden determinista.

- [ ] **T3. Completar mensajes i18n del catálogo y estados.** RF-8–RF-10, RF-13, RF-19, RNF-1
  - Hecho cuando: ES y EN tienen mensajes de catálogo vacío y plantilla SEO localizada; Vitest comprueba paridad y etiqueta correcta para los cuatro estados en ambos idiomas.

- [ ] **T4. Derivar meta descriptions y validar unicidad.** RF-14
  - Hecho cuando: Vitest verifica descripción de serie de hasta 155 caracteres en límite de palabra, plantilla cuando falta descripción editorial y error por títulos o meta descriptions duplicados.

- [ ] **T5. Emitir canonical, hreflang y selector equivalentes por página.** RF-8, RF-14, RNF-1, RNF-5
  - Hecho cuando: canonical y alternates usan la ruta actual y solo enlazan versiones publicadas; catálogo ES/EN mantiene su equivalencia incluso vacío.

- [ ] **T6. Aplicar tokens de Availability y reglas de imagen.** RF-10, RF-12, RF-18–RF-19, RNF-2, RNF-6, RNF-8
  - Hecho cuando: cada estado usa su color token y etiqueta textual, no aparece adquisición, y `EditorialImage` conserva alt/dimensiones y admite carga diferida salvo imagen principal visible.

- [ ] **T7. Crear tarjetas y bloque de series visibles.** RF-1–RF-3, RF-5–RF-6, RF-10–RF-12, RF-18–RF-19
  - Hecho cuando: la tarjeta contiene solo imagen, título, año y estado; enlaza a la ficha y no tiene acción comercial; Vitest cubre los cuatro estados × ES/EN comprobando etiqueta correcta y ausencia de adquisición, y el bloque de series enlaza destinos visibles sin filtro.

- [ ] **T8. Generar rutas estáticas de catálogo ES/EN.** RF-1–RF-3, RF-8–RF-9, RF-11, RF-16, RF-18–RF-19, RNF-1, RNF-4
  - Hecho cuando: ambas rutas se generan aun sin obras, muestran únicamente obras visibles en orden definido y presentan el estado vacío localizado cuando corresponda.

- [ ] **T9. Generar páginas de serie y CollectionPage.** RF-4–RF-8, RF-10–RF-15, RF-18–RF-19
  - Hecho cuando: solo se emiten series visibles; contenido opcional e imagen ausente se omiten; se muestran sus obras visibles ordenadas, enlace de vuelta y datos `CollectionPage` de esa colección localizada.

- [ ] **T10. Integrar rutas de ficha, VisualArtwork y 404 con Spec 003.** RF-5–RF-6, RF-15, RF-17
  - Hecho cuando: tras aprobarse Spec 003 y su plan, los enlaces usan su contrato de rutas, la ficha emite `VisualArtwork` con todos los datos de RF-15 y las rutas de fichas no visibles responden 404 sin redirección. **Bloqueada hasta esa aprobación.**

- [ ] **T11. Generar sitemap de páginas y alternates.** RF-8, RF-14, RF-16
  - Hecho cuando: el XML incluye catálogo, series y fichas visibles por idioma con alternates solo para versiones publicadas y pasa sus comprobaciones.

- [ ] **T12. Generar sitemap de imágenes.** RF-12, RF-16
  - Hecho cuando: aparecen imágenes principales de obras visibles y solo imágenes de serie existentes y válidas; una imagen opcional ausente no causa error.

- [ ] **T13. Conectar el detector de metadatos duplicados al build.** RF-14, RNF-5
  - Hecho cuando: páginas públicas ES/EN registran sus títulos y descripciones y un duplicado detiene el build; los metadatos ausentes se excluyen de la comparación.

- [ ] **T14. Verificar salida estática, JSON-LD, sitemaps y 404.** RF-15–RF-17, RNF-4–RNF-5
  - Hecho cuando: Vitest confirma HTML sin JS, JSON-LD parseable, sitemaps válidos y alternates publicados, exclusión de páginas no visibles y contenido bilingüe en la salida 404; `pnpm --dir web verify` pasa.

- [ ] **T15. Revisar catálogo y tarjetas en Chrome DevTools.** RF-1–RF-3, RF-8–RF-10, RF-18–RF-19, RNF-2–RNF-3, RNF-8
  - Hecho cuando: a 375, 768 y 1280 px, con contenido mínimo y máximo, los cuatro datos de cada tarjeta son visibles sin recorte, solape ni scroll horizontal; enlaces identificables y estados perceptibles sin depender solo del color.

- [ ] **T16. Revisar páginas de serie, navegación y accesibilidad.** RF-4–RF-8, RF-12–RF-13, RF-17, RNF-1–RNF-3
  - Hecho cuando: Chrome confirma contenido localizado sin fallback, omisión de descripción/imagen opcionales, uso por teclado, retorno al catálogo y HTTP 404 sin redirección para rutas ausentes.

- [ ] **T17. Ejecutar Lighthouse y revisar pesos orientativos.** RNF-6–RNF-7
  - Hecho cuando: en móvil y preview de producción, catálogo ES, ficha ES y serie ES alcanzan rendimiento ≥ 90, accesibilidad ≥ 95 y SEO = 100; los pesos se registran como objetivos no bloqueantes.

## Propuesta de división

El desglose verificable requiere 17 tareas, por encima del máximo recomendado de 10. Se propone separar **exploración y páginas de catálogo/serie** (T1–T9) de **fichas, SEO/indexación e integración final** (T10–T17). T10 ya depende de la Spec 003; cualquier división formal requiere actualizar y aprobar los alcances y planes afectados antes de implementar.
