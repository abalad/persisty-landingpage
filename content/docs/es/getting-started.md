---
title: Primeros pasos
description: Qué es Persisty, cómo instalarlo y cómo abrir el primer proyecto con una sesión de agente.
group: start
order: 1
---

Persisty es una app de escritorio para quien mantiene varios productos de software y trabaja con agentes de IA en la terminal, como Claude Code y Codex. Organiza las terminales por proyecto, muestra el estado y la [cuota](/docs/usage-and-quota) de cada agente y [trae las sesiones de vuelta](/docs/sessions-and-recovery) después de un cuelgue o de un reinicio.

El plan gratuito no pide cuenta: la [cuenta de Persisty](/docs/account-and-license) solo existe para los [planes pagos](/docs/pro). Todo lo que muestra esta página es del plan gratuito.

Por ahora, la interfaz de la app está en portugués y en inglés. Por eso esta documentación da entre paréntesis el nombre en inglés de cada menú, botón y pestaña.

## Instalar

1. Descarga la versión de tu sistema en la [página de descarga](/download).
2. Instálala:
   - En Mac, abre el DMG y arrastra Persisty a la carpeta Aplicaciones. La app está firmada y notarizada por Apple.
   - En Windows, que está en versión preliminar y sin firma, ejecuta el instalador. Si SmartScreen avisa, haz clic en **Más información › Ejecutar de todas formas**.
   - En Linux, también en versión preliminar y sin firma, usa el AppImage o el paquete `.deb`. El AppImage necesita permiso de ejecución: `chmod +x Persisty_*.AppImage`.
3. Abre Persisty. Lo que usa para mantener las sesiones ya viene dentro de la app, sin nada que instalar aparte.
4. Para usar agentes, ten [Claude Code](https://docs.claude.com/en/docs/claude-code) instalado y con el login hecho. Las terminales comunes funcionan sin él. Las funciones de git, como la rama, los cambios y clonar un repositorio, usan el git de tu computadora.

En la primera pantalla, **En esta máquina** (*On this machine*) muestra lo que Persisty encontró: **Sesiones persistentes** (*Persistent sessions*), con **listo** (*ready*) cuando las sesiones se pueden mantener, y Claude Code y Codex CLI, con la versión de cada uno o **no encontrado** (*not found*). Persisty busca los agentes al abrirse: un agente instalado después solo aparece en la **Nueva sesión** (*New session*) cuando vuelves a abrir la app.

### Versiones nuevas

La app busca versiones nuevas al abrirse y cada 6 horas. Cuando sale una, aparece un aviso con su número, **Novedades** (*What's new*) e **Instalar y reiniciar** (*Install and restart*); la **×** del aviso, **Omitir esta versión** (*Skip this version*), oculta solo esa. En Mac, la app descarga, instala y reinicia sin preguntar nada, y reconecta las sesiones abiertas cuando vuelve. En Windows y Linux, si hay sesiones abiertas, avisa antes que pueden terminarse. Con el `.deb` de Linux, el aviso lleva a la página de descarga. En [**Configuración › Acerca de**](/docs/settings#acerca-de) (*Settings › About*) puedes buscar en el momento o apagar **Buscar actualizaciones automáticamente** (*Check for updates automatically*); el resto está en [Actualizaciones](/docs/updates).

## Crear el primer proyecto

Un **proyecto** es un producto o un cliente tuyo, no una carpeta. Dentro de él están los **workspaces**: las carpetas y los repositorios de ese producto.

1. Haz clic en **Crear primer proyecto** (*Create first project*), en la pantalla que aparece la primera vez que abres Persisty, o en el **+** de la barra de proyectos, a la izquierda. En **Nuevo proyecto** (*New project*), ponle un nombre y haz clic en **Crear proyecto** (*Create project*).
2. El proyecto se abre vacío. Arrastra una carpeta del Finder a **Agregar workspace** (*Add workspace*), o haz clic y elígela. Se convierte en el primer workspace; si es un repositorio git, Persisty muestra la rama y los cambios. Para un repositorio que todavía no está en tu computadora, usa [**Clonar repositorio**](/docs/projects-and-workspaces#clonar-un-repositorio) (*Clone a repository*): lo descarga de GitHub, GitLab, Bitbucket o cualquier enlace git y lo agrega como workspace. En la misma pantalla, **Terminal suelta** (*Standalone terminal*, <kbd>2</kbd>) y un agente suelto, como **Claude Code suelto** (*Standalone Claude Code*, <kbd>3</kbd>), abren la **Nueva sesión** para una sesión en cualquier carpeta, fuera de un workspace.
3. Los otros repositorios del mismo producto (API, app, sitio) entran por la tarjeta **Agregar workspace**, al final de la franja de abajo, que también clona. El área para soltar carpetas solo aparece con el proyecto vacío.

En la primera pantalla, **Cómo funciona** (*How it works*), o la tecla <kbd>?</kbd>, abre una guía de un minuto sobre cómo organiza Persisty el trabajo. Después, la guía queda en **Primeros pasos** (*First steps*), abajo en la barra de proyectos, y en **Guía de primeros pasos** (*First steps guide*), en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>).

## Abrir una sesión

Con el workspace seleccionado, presiona <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>. En **Nueva sesión**, elige **Claude Code** o **Codex CLI** para una sesión de agente, o **Terminal** para un shell común (servidor de desarrollo, pruebas, lo que quieras), y haz clic en **Crear y abrir** (*Create and open*).

En esa ventana, el [agente por defecto](/docs/agents#agente-por-defecto) ya viene elegido. Sin pasar por la ventana, <kbd>⌘</kbd> <kbd>N</kbd> abre una terminal y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre el agente por defecto, los dos en el workspace actual. En un workspace sin sesiones, la pantalla lista `terminal`, `claude` y `codex`, y las teclas <kbd>1</kbd>, <kbd>2</kbd> y <kbd>3</kbd> abren cada uno. En Windows y Linux, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>.

La sesión aparece como pestaña arriba y como línea en la tarjeta del workspace, abajo. La pestaña muestra el estado del agente con un punto de color, y la palabra está en la sugerencia que aparece al pasar el puntero: **Trabajando** (*Working*), **Concluido** (*Done*), **Permiso pendiente** (*Permission pending*), **Inactivo** (*Idle*) o **Terminado** (*Ended*). El encabezado de la sesión y la tarjeta del workspace muestran la palabra directamente. En una terminal común, dice lo que corre, como **Ejecutando · pnpm dev** (*Running · pnpm dev*), y una sesión sin proceso muestra el estado del proceso, como **Terminada** (*Exited*); mira [Los estados](/docs/agents#los-estados).

## Próximos pasos

- [Proyectos y workspaces](/docs/projects-and-workspaces): cómo organiza Persisty el trabajo.
- [Sesiones y terminales](/docs/sessions): abrir, nombrar y cerrar sesiones, y el panel lateral de cada una.
- [Volver después de un cuelgue](/docs/sessions-and-recovery): qué pasa después de un cuelgue o de un reinicio.
- [Agentes y estados](/docs/agents): cómo saber qué agente te necesita.
- [Configuración, pantalla por pantalla](/docs/settings): cada opción de la app y su valor por defecto.
- [Lo que Persisty todavía no hace](/docs/troubleshooting#lo-que-persisty-todavía-no-hace): los límites de hoy, para no buscar lo que todavía no existe.
