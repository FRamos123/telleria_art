---
description: SDD · Genera el plan técnico de una spec aprobada
agent: build
---
Lee docs/constitution.md, AGENTS.md, design/tokens.md y specs/$1/spec.md. Usa la skill sdd.
NO escribas código.
Genera specs/$1/plan.md con: archivos que se crean o modifican y la responsabilidad de cada uno, modelo de dominio y mappers si aplica, algoritmo en pseudocódigo si aplica, cómo se construye la interfaz (componentes y tokens que usa), decisiones técnicas justificadas (con su alternativa descartada) y estrategia de verificación (vitest para dominio y mappers, Chrome DevTools para interfaz).
Todo debe respetar la constitución y cubrir todos los RF. Marca qué RF cubre cada parte. Señala qué puntos caen en "⚠️ Preguntar antes" de AGENTS.md. Si la spec no está aprobada o tiene dudas abiertas, para y avísame.
