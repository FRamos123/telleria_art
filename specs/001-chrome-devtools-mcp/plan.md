# Plan 001 — Chrome DevTools MCP

**Spec de referencia:** 001-chrome-devtools-mcp, aprobada.

## Alcance del plan

Configurar el servidor oficial Chrome DevTools MCP en OpenCode para este repositorio. No se cambia la web, sus dependencias ni la configuración global.

## Archivos y responsabilidades

| Archivo | Acción | Responsabilidad / cobertura |
|---|---|---|
| `.opencode/opencode.json` | Crear | Configuración local del servidor MCP `chrome-devtools`, iniciado con `npx -y chrome-devtools-mcp@latest --no-usage-statistics`. RF-1–RF-3, RNF-1. |
| `specs/001-chrome-devtools-mcp/tasks.md` | Crear | Tarea atómica y comprobación de aceptación. |
| `MEMORY.md` | Actualizar al cerrar la tarea | Registrar resultado y requisitos locales. |

## Modelo de dominio y mappers

No aplica: la integración es una herramienta local de desarrollo y no participa en el dominio ni transforma datos del sitio.

## Algoritmo en pseudocódigo

```text
OpenCode carga la configuración del proyecto
si se invoca una herramienta que requiere navegador:
    ejecuta el servidor oficial con npx
    el servidor inicia Chrome si aún no hay una instancia
el servidor no recopila estadísticas de uso opcionales
```

## Decisiones técnicas

1. **`.opencode/opencode.json` local al repositorio.** OpenCode V2 descubre esta ubicación como configuración de proyecto; evita afectar otros proyectos. Alternativa descartada: configuración global.
2. **Servidor local vía `npx` y etiqueta `@latest`.** Sigue la configuración oficial del servidor y evita añadir una dependencia a `package.json` o `pnpm-lock.yaml`. Alternativa descartada: instalar el servidor como dependencia de la aplicación.
3. **`--no-usage-statistics`.** Desactiva estadísticas opcionales del servidor. Alternativa descartada: dejar activa la recopilación predeterminada.
4. **Chrome administrado por el servidor.** Se usan los valores predeterminados y no se conecta a un perfil personal o Chrome ya abierto. Alternativa descartada: configurar una conexión remota, que requiere una instancia y credenciales adicionales.

## Estrategia de verificación y cobertura

| Verificación | Método y criterio | RF/RNF cubiertos |
|---|---|---|
| Configuración de proyecto | Confirmar que OpenCode detecta `chrome-devtools` al ejecutar `opencode mcp list` desde este repositorio, y que no se añadió entrada global. | RF-1, RF-2 |
| Conexión y navegador | Con Node.js LTS, npm y Google Chrome actual disponibles, confirmar que el servidor conecta y que una herramienta de navegador inicia Chrome y opera sobre una página. | RF-3, RNF-2 |
| Privacidad y alcance | Revisar la presencia de `--no-usage-statistics` y que no cambian `package.json`, lockfiles ni archivos de la aplicación. | RF-2, RNF-1 |

Esta configuración de desarrollo no cambia el build del sitio; `pnpm verify` no prueba la disponibilidad local de Chrome ni de OpenCode.
