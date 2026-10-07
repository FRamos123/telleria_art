---
description: Genera el plan de una spec antes de tocar código
agent: plan
---
Prepara el plan de implementación de la spec `$1`.

Contexto: @specs/$1/spec.md, @MEMORY.md y, si hay interfaz, @design/tokens.md.

El plan debe incluir:
1. Enfoque de implementación, respetando AGENTS.md (límites, estructura, convenciones).
2. Archivos que se crean o modifican y qué cambia en cada uno.
3. Lista de tareas pequeñas y ordenadas, cada una con su criterio de verificación.
4. Casos límite y dudas que debo decidir yo antes de empezar.
5. Cualquier punto que caiga en "⚠️ Preguntar antes" de AGENTS.md.
6. Qué debería anotarse en MEMORY.md al terminar.

Si la spec es ambigua o contradice AGENTS.md, dilo en lugar de suponer.
No modifiques ningún archivo: devuelve el plan en el formato de plan.md para que lo apruebe.