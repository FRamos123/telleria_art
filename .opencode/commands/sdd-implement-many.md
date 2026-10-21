---
description: SDD · Implementa varias tareas pendientes en orden y resuelve dependencias sin mezclarlas
agent: build
---

Implementa una tanda de tareas de `specs/$1/tasks.md`, empezando por la primera tarea sin marcar y avanzando en orden. Uso: `/sdd-implement-many <spec-folder> [max-tasks]`. Si no se indica `max-tasks`, usa 3.

## Puertas SDD

1. Lee la skill `sdd`, `docs/constitution.md`, `AGENTS.md`, `MEMORY.md` y los `spec.md`, `plan.md` y `tasks.md` de `specs/$1/`; lee también `design/tokens.md` si toca interfaz.
2. No empieces si la spec o el plan no están aprobados, quedan `[NECESITA ACLARACIÓN]` sin resolver, o falta la aprobación explícita de tareas/decisiones requerida por SDD. La invocación por sí sola no aprueba decisiones pendientes.
3. Respeta las aprobaciones previas de `AGENTS.md`: pregunta y párate antes de añadir dependencias, servicios, JavaScript de cliente, modificar `@theme`, cambiar esquemas/tipos públicos o alterar un layout existente. Nunca inventes secretos, textos legales ni contenido del artista.
4. No implementes pagos, pedidos ni checkout fuera de una spec aprobada.

## Selección y dependencias

1. Recorre `tasks.md` en el orden escrito; omite tareas marcadas `[x]` y toma la primera pendiente. Completa como máximo `$2` tareas enteras, o 3 si `$2` no se proporcionó.
2. Antes de implementar cada tarea, contrasta su “Hecho cuando” con `plan.md` y el estado real de sus dependencias.
3. Si una tarea pendiente necesita una parte de una tarea posterior, ejecuta primero **solo la porción mínima separable** de esa tarea posterior, verifica ese trabajo y anótalo debajo de ella en `tasks.md` como `Progreso adelantado para dependencia:`. No marques la tarea posterior `[x]` mientras su criterio completo no esté satisfecho.
4. Si la dependencia posterior puede completarse de forma independiente y es un prerrequisito real, complétala entera, márcala `[x]` tras verificarla y vuelve a la primera tarea pendiente.
5. No paralelices tareas ni mezcles refactors. Si el orden genera un ciclo, la porción no se puede separar sin falsear “Hecho cuando”, o hace falta cambiar el alcance, detente y pide aclaración; no reordenes ni cambies la spec por tu cuenta.

## Ejecución de cada tarea

1. Trabaja una sola tarea cada vez, sin iniciar la siguiente hasta cerrar y verificar la actual.
2. Para dominio o mappers, escribe primero los tests y comprueba que fallan; después implementa hasta que pasen.
3. Para interfaz, usa únicamente tokens/patrones aprobados de `design/tokens.md`; verifica con Chrome DevTools en móvil (375 px) y escritorio. Mantén ES/EN, accesibilidad y SEO.
4. Al completar el criterio de la tarea, ejecuta la verificación aplicable y `pnpm --dir web verify`. Si falla, no marques la tarea como hecha y párate para corregir o explicar el bloqueo.
5. Solo después de pasar “Hecho cuando”, marca esa tarea `[x]` en `tasks.md`; registra debajo cualquier decisión aprobada que el plan no cubra y actualiza `MEMORY.md` con el avance y lo pendiente.
6. Emite un breve checkpoint después de cada tarea cerrada. Continúa con la siguiente pendiente únicamente dentro del máximo de esta invocación y mientras no aparezca una puerta de aprobación o bloqueo.

## Parada y resumen

Párate inmediatamente si una tarea es imposible según la plataforma, necesita una decisión no aprobada, requiere un servicio/credencial aún no configurado, falla una prueba/verificación o revela una contradicción entre spec, plan y código. Conserva el trabajo parcial sin marcarlo como completado y explica qué hace falta.

Al terminar el lote, resume las tareas completadas, las verificaciones ejecutadas, las pendientes/bloqueadas y el siguiente paso exacto. No marques como hecha una tarea por haber adelantado solo una dependencia.
