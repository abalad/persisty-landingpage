---
title: Primeros pasos
description: Qué es Persisty, cómo instalarlo y actualizarlo y cómo abrir el primer proyecto con una sesión de agente.
group: start
order: 1
---

Persisty es una app de escritorio para quien mantiene varios productos de software y trabaja con agentes de IA en la terminal, como Claude Code y Codex. Organiza las terminales por proyecto, sigue el estado y la cuota de cada agente y trae las sesiones de vuelta después de un cuelgue.

Nada de lo que haces en Persisty depende de una cuenta ni de internet. La cuenta solo existe para los planes pagos.

Por ahora, la interfaz de la app está en portugués y en inglés. Por eso esta documentación da entre paréntesis el nombre en inglés de cada menú, botón y pestaña.

## Instalar y actualizar

1. Descarga la versión de tu sistema en la [página de descarga](/download).
2. Instálala:
   - **Mac**: abre el DMG y arrastra Persisty a la carpeta Aplicaciones. La app está firmada y notarizada por Apple.
   - **Windows** (versión preliminar, sin firma): ejecuta el instalador. Si SmartScreen avisa, haz clic en **Más información › Ejecutar de todas formas**.
   - **Linux** (versión preliminar, sin firma): usa el AppImage o el paquete `.deb`. El AppImage necesita permiso de ejecución: `chmod +x Persisty_*.AppImage`.
3. Abre Persisty. Todo lo que necesita ya viene dentro de la app; no hace falta instalar ninguna otra dependencia.
4. Para usar agentes, ten [Claude Code](https://docs.claude.com/en/docs/claude-code) instalado y con el login hecho. Las terminales comunes funcionan sin él.

### Versiones nuevas

La app busca versiones nuevas al abrirse y cada 6 horas. Cuando sale una, aparece un aviso con su número, un enlace a las novedades e **Instalar y reiniciar** (*Install and restart*). Cerrar el aviso oculta solo esa versión. En **Configuración › Acerca de** (*Settings › About*) puedes buscar en el momento o apagar la búsqueda automática.

- **Mac**: instalar no pregunta nada. La app descarga, instala y reinicia, y las sesiones abiertas vuelven con ella.
- **Windows y Linux**: si hay sesiones abiertas, la app avisa antes que pueden cerrarse, y tú instalas ahora o lo dejas para después.
- **Linux con el `.deb`**: la app no lo instala sola. El aviso lleva a la página de descarga para que bajes el paquete nuevo.

## Crear el primer proyecto

Un **proyecto** es un producto o un cliente tuyo, no una carpeta. Dentro de él están los **workspaces**: las carpetas y los repositorios de ese producto.

1. Haz clic en **Crear primer proyecto** (*Create first project*), que aparece la primera vez que abres Persisty, o en el **+** de la barra de proyectos, a la izquierda. Ponle un nombre.
2. El proyecto se abre vacío. Arrastra una carpeta del Finder a **Agregar workspace** (*Add workspace*), o haz clic y elígela. Se convierte en el primer workspace. Si es un repositorio git, Persisty muestra la rama y los cambios. Para un repositorio que todavía no está en tu computadora, usa **Clonar repositorio** (*Clone a repository*): lo descarga de GitHub, GitLab, Bitbucket o cualquier enlace git y lo agrega como workspace.
3. Los otros repositorios del mismo producto (API, app, sitio) entran por la tarjeta **Agregar workspace**, al final de la franja de abajo, que también clona. El área para soltar carpetas solo aparece con el proyecto vacío.

## Abrir una sesión

Con el workspace seleccionado, presiona <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>. En **Nueva sesión** (*New session*), elige qué abrir y haz clic en **Crear y abrir** (*Create and open*):

- **Claude Code** o **Codex CLI**, para una sesión de agente;
- **Terminal**, para un shell común (servidor de desarrollo, pruebas, lo que quieras).

El agente por defecto ya viene elegido. Sin pasar por el diálogo, <kbd>⌘</kbd> <kbd>N</kbd> abre una terminal y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre el agente por defecto, los dos en el workspace actual. En un workspace sin sesiones, la pantalla lista `terminal`, `claude` y `codex`, y las teclas <kbd>1</kbd>, <kbd>2</kbd> y <kbd>3</kbd> abren cada uno.

La sesión aparece como pestaña arriba y como línea en la tarjeta del workspace, abajo. La pestaña muestra el estado del agente con un punto de color, y la palabra está en la sugerencia que aparece al pasar el puntero: **Trabajando** (*Working*), **Concluido** (*Done*), **Permiso pendiente** (*Permission pending*), **Inactivo** (*Idle*) o **Terminado** (*Ended*). El encabezado de la sesión y la tarjeta del workspace muestran la palabra directamente.

## Próximos pasos

- [Proyectos y workspaces](/docs/projects-and-workspaces): cómo organiza Persisty el trabajo.
- [Sesiones y recuperación](/docs/sessions-and-recovery): qué pasa después de un cuelgue o de un reinicio.
- [Agentes y estados](/docs/agents): cómo saber qué agente te necesita.
