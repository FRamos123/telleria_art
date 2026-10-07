---
description: SDD · Valida la spec RF por RF (tests + Chrome DevTools)
agent: plan
---
Recorre specs/$1/spec.md requisito por requisito. Para cada RF indica qué test o comprobación lo cubre y su resultado (pnpm verify para dominio y mappers).
Los RF de interfaz verifícalos con el MCP de Chrome DevTools en móvil (375 px) y escritorio, comparando con design/ y design/tokens.md. Comprueba también contraste AA, metadatos, JSON-LD, hreflang y que no haya texto hardcodeado fuera de src/i18n/.
Si algún RF no está cubierto o falla, dilo claramente. NO arregles nada todavía.
Después comprueba los criterios de finalización y dame un veredicto: ¿la spec está cumplida?
