---
description: SDD · Implementa UNA tarea (uso - /sdd-implement 000-fundacion T3)
agent: build
---
Implementa SOLO la tarea $2 de specs/$1/tasks.md, siguiendo specs/$1/plan.md, docs/constitution.md, design/tokens.md y la skill sdd.
1. Si toca lógica de dominio o mappers: escribe primero los tests y comprueba que fallan; después el código hasta que pasen.
2. Si toca interfaz: compón solo con tokens y patrones de design/tokens.md y compara con las capturas de design/ en móvil (375 px) y escritorio con el MCP de Chrome DevTools.
3. Ejecuta `pnpm --dir web verify` y muéstrame el resultado.
4. Marca $2 como hecha en tasks.md e indica qué RF cubre.
Si el plan o la tarea son incorrectos o imposibles, para y explícalo: no improvises otra solución.
Después PÁRATE. No empieces la siguiente tarea.
Si tomas una decisión que el plan no cubría, anótala bajo la tarea en tasks.md
