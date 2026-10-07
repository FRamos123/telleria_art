# Spec 001 — Chrome DevTools MCP

Estado: aprobada

## Contexto y objetivo

Permitir que OpenCode use Chrome DevTools para inspeccionar y depurar páginas durante el desarrollo del portfolio, sin añadir dependencias al sitio publicado.

## Usuarios

- La persona responsable del desarrollo y verificación visual del portfolio.

## Historias de usuario

- **HU-1.** Como desarrollador del proyecto, quiero que OpenCode pueda conectarse a Chrome DevTools desde este repositorio para inspeccionar la web durante su desarrollo.

## Requisitos funcionales

- **RF-1. Configuración local al proyecto.** CUANDO OpenCode cargue la configuración de este proyecto, EL SISTEMA ofrecerá el servidor oficial Chrome DevTools MCP solo en este proyecto, sin modificar la configuración global del usuario.
- **RF-2. Sin dependencia de producción.** EL SISTEMA no añadirá Chrome DevTools MCP a las dependencias ni al código del sitio publicado.
- **RF-3. Uso de Chrome.** CUANDO se invoque una herramienta que requiera navegador, EL SISTEMA iniciará o utilizará una instancia compatible de Google Chrome según los valores predeterminados del servidor.

## Requisitos no funcionales

- **RNF-1. Privacidad.** La configuración no incluirá secretos ni enviará contenido del navegador a servicios adicionales por decisión del proyecto.
- **RNF-2. Requisitos locales.** El uso documentará los requisitos de Node.js LTS, npm y Google Chrome actual.

## Casos límite

- Si Node.js, npm o Chrome no están disponibles, la conexión o el inicio del navegador puede fallar; el proyecto no instalará esos programas automáticamente.
- Conectar el servidor MCP no implica que Chrome se abra hasta que se invoque una herramienta que necesite navegador.

## Fuera de alcance

- Cambios a la aplicación web, scripts de `package.json` o dependencias del proyecto.
- Configuración global de OpenCode.
- Automatización de pruebas o Lighthouse.
- Conexión a un perfil personal o a una instancia Chrome existente.

## Criterios de finalización

- OpenCode descubre el servidor Chrome DevTools MCP en la configuración de este proyecto.
- El servidor se conecta y puede abrir una instancia de Chrome al invocar una herramienta de navegador.
- No se modifican dependencias, código de aplicación ni configuración global.

## Decisiones cerradas

- Configuración local de OpenCode para este repositorio, sin dependencia en la aplicación.
- Desactivar las estadísticas de uso opcionales mediante `--no-usage-statistics`.

## Dudas abiertas

- Ninguna.
