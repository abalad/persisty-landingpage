---
title: Sesiones y terminales
description: Abrir, nombrar, cerrar y cambiar de sesión, el panel lateral con las herramientas de cada una y los enlaces en la terminal.
group: start
order: 3
---

Una sesión es una terminal de Persisty: un shell común o un agente, como Claude Code o Codex CLI. Se abre en un workspace, o suelta en el proyecto, en cualquier carpeta. Cambiar de pestaña, de workspace o de proyecto no la interrumpe.

## Nueva sesión

Hay tres maneras de abrir una sesión en el workspace seleccionado. <kbd>⌘</kbd> <kbd>N</kbd>, o el **+** junto a las pestañas, abre una terminal en el momento. <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre directamente el [agente por defecto](/docs/agents#agente-por-defecto). <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> abre la ventana **Nueva sesión** (*New session*) con el agente por defecto ya elegido, y el **+** con <kbd>⌥</kbd> o <kbd>⇧</kbd> abre la misma ventana con **Terminal**. Sin un workspace seleccionado, o si falta su carpeta, <kbd>⌘</kbd> <kbd>N</kbd> y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> también abren la ventana. En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd> en todas las teclas de esta página.

En la ventana, **Dónde** (*Where*) es un workspace del proyecto o **Sesión suelta** (*Standalone session*), que pide la **Carpeta** (*Folder*) donde se abre la terminal. **Qué** (*What*) es **Terminal**, **Claude Code** o **Codex CLI**; un agente que no está en tu computadora aparece como **no encontrado** (*not found*) y no se puede elegir. El **Nombre** (*Name*) viene con el agente y el workspace, como `Claude Code · api`, y es lo que muestra la pestaña. **Crear y abrir** (*Create and open*), o <kbd>↵</kbd>, abre la sesión, y <kbd>Esc</kbd> cierra la ventana.

En **Más opciones** (*More options*) están el **Modelo** (*Model*), solo en Claude Code (**Predeterminado**, *Default*, usa el de Claude); el **Comando inicial** (*Startup command*), que se escribe al abrir la terminal, como `pnpm dev`; y **Al reabrir Persisty** (*When Persisty reopens*), la regla que explica [Cuándo relanzar](/docs/sessions-and-recovery#cuándo-relanzar). Según el caso, la ventana también muestra la **Cuenta de Claude** (*Claude account*, mira [Cuentas de IA y rotación](/docs/ai-accounts)), [**Empezar desde una issue**](/docs/issues#empezar-desde-una-issue) (*Start from an issue*) y la [**Carpeta propia (worktree)**](/docs/worktrees) (*Own folder (worktree)*), que es [Pro](/docs/pro).

En un workspace sin sesiones, la pantalla muestra la ruta de la carpeta y una lista corta: `terminal`, `claude`, `codex` y `options`. Las teclas <kbd>1</kbd>, <kbd>2</kbd> y <kbd>3</kbd> abren los tres primeros, y `options` abre la ventana **Nueva sesión**. Debajo vienen las sesiones de los otros workspaces del proyecto, para ir directo a una de ellas.

## Sesiones y pestañas

Las pestañas de arriba son las sesiones del workspace seleccionado. Cada pestaña tiene el ícono del agente, el nombre y un punto con el estado; al pasar el puntero se ve el estado en palabras (mira [Los estados](/docs/agents#los-estados)). En una sesión de Claude Code, la pestaña muestra el nombre de la conversación mientras la sesión tenga el nombre que le dio Persisty. Un nombre que elegiste tú se queda.

Para cambiar el nombre, haz doble clic en la pestaña o usa **Renombrar** (*Rename*) en el clic derecho. El mismo menú tiene **Mover a la izquierda** (*Move left*) y **Mover a la derecha** (*Move right*), cuando la pestaña puede ir hacia ese lado, **Abrir en** (*Open in*) con el nombre de tu IDE por defecto, como *Open in Cursor*, cuando hay uno, **Cerrar** (*Close*) y **Cerrar todas** (*Close all*). La **×** aparece sobre el punto al pasar el puntero. Cerrar pide confirmación, termina el proceso y quita la sesión; en una sesión con carpeta propia, Persisty pregunta antes qué hacer con la carpeta. No hay un botón para detener el proceso y conservar la sesión: para terminar el agente, sal de él en la propia terminal o cierra la pestaña.

Junto a las pestañas están también el selector de [comandos del workspace](/docs/commands), el botón **Tablero de sesiones** (*Session board*), que abre el [Tablero](/docs/board) (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>), y, cuando el proyecto tiene sesiones sin proceso, **Restaurar N** (*Restore N*; mira [Restaurar todo](/docs/sessions-and-recovery#restaurar-todo)).

<kbd>⌘</kbd> <kbd>←</kbd> y <kbd>⌘</kbd> <kbd>→</kbd> pasan a la sesión anterior o a la siguiente del workspace, fuera del código; en el editor, esas teclas se mueven por la línea. <kbd>⌘</kbd> <kbd>K</kbd> encuentra cualquier sesión de los proyectos de la barra por su nombre. Al cambiar de sesión, lo que escribes va a la terminal en cuanto aparece, incluso antes de que termine de conectarse, y nunca al archivo abierto en el panel [**Código**](/docs/editor) (*Code*).

Cada sesión guarda el historial de la terminal, que vuelve cuando Persisty reconecta; mira [Historial de la terminal](/docs/sessions-and-recovery#historial-de-la-terminal).

## Encabezado de la sesión

Encima de la terminal, el encabezado muestra solo información de la sesión: el nombre, el estado en palabras y la rama de la carpeta. La rama sigue los cambios hechos desde la terminal, y al hacer clic en ella se abre un selector con búsqueda para cambiar de rama o crear una. Según la sesión, aparecen también el aviso de **Sin cuota** (*Out of quota*), la marca `worktree` de una sesión con carpeta propia, el resultado de la [verificación al terminar](/docs/verify), la issue de origen y, en una sesión sin proceso, el motivo.

Renombrar y cerrar están en la [pestaña de la sesión](#sesiones-y-pestañas), y el historial, en la barra de herramientas del borde derecho. Una sesión sin proceso muestra, en lugar de la terminal, **Sesión sin proceso.** (*Session has no process.*), el motivo y el botón **Reintentar** (*Try again*), que relanza la sesión; una sesión que todavía no se inició muestra **Iniciar** (*Start*). Mira [Volver después de un cuelgue](/docs/sessions-and-recovery#restaurar-todo).

En la barra de abajo de la ventana están, de la sesión en foco, el modelo, el gasto estimado, el contexto, las ventanas de 5 h y 7 d, la carpeta y el proceso; mira [Uso, costo y cuota](/docs/usage-and-quota).

## Herramientas de la sesión

En el borde derecho de cada sesión hay una barra fina con sus herramientas, en tres grupos: [**Código**](/docs/editor), [**Búsqueda**](/docs/search) (*Search*) y [**Notas**](/docs/notes) (*Notes*); [**Cambios**](/docs/changes) (*Changes*), [**Puntos de restauración**](/docs/restore-points) (*Restore points*) y [**Cola de pedidos**](/docs/queue) (*Request queue*); e **Historial** (*History*) y **Detalles** (*Details*). Un clic abre la herramienta en el panel lateral, y el mismo clic la cierra. El ícono de **Cambios** muestra cuántos archivos cambiaron y, en las sesiones de agente, el de la **Cola de pedidos** muestra cuántos pedidos esperan, también con el panel cerrado. Al pasar el puntero se ven el nombre, la cuenta y el atajo.

**Historial** muestra los 12 eventos más recientes de la sesión, del más nuevo al más antiguo, como los cambios de estado y de cuenta. **Detalles** resume la sesión, el workspace y el proyecto: el agente, el modelo, el costo estimado, el contexto usado, las ventanas de 5 h y 7 d, el proceso y la regla **Al reabrir** (*On reopen*); la carpeta, la rama y los cambios, con **Quitar del proyecto** (*Remove from project*); y el gasto en IA del mes y las sesiones activas, con **Uso detallado** (*Usage details*) y **Ajustes del proyecto** (*Project settings*).

Las sesiones, el panel y los enlaces son del plan gratuito. En la **Cola de pedidos**, escribir pedidos es Pro; en los **Puntos de restauración**, grabar un punto con cada pedido también.

## Panel lateral

<kbd>⌘</kbd> <kbd>&#92;</kbd> muestra u oculta el panel, en la última herramienta usada, y **Contraer panel** (*Collapse panel*), en su esquina, también lo cierra. Algunas herramientas tienen tecla propia: <kbd>⌘</kbd> <kbd>P</kbd> abre **Código** con la búsqueda de archivo por nombre, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> abre la **Búsqueda**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> abre y cierra **Cambios**, y <kbd>⌘</kbd> <kbd>I</kbd> abre y cierra **Detalles**. Dentro del código, las teclas del mapa del editor van primero; mira [Atajos de teclado](/docs/shortcuts).

El divisor entre la terminal y el panel se arrastra. Con él en foco, <kbd>←</kbd> y <kbd>→</kbd> cambian el ancho de 5 % en 5 %, y <kbd>←</kbd> ensancha el panel. El panel empieza con el 45 % del ancho y va del 20 % al 80 %. Cada sesión recuerda si el panel estaba abierto, en qué herramienta y con qué ancho, también después de volver a abrir la app. **Restablecer** (*Reset*), en [**Configuración › Workspace › Tamaño de los paneles**](/docs/settings#workspace) (*Settings › Workspace › Panel size*), devuelve todas las sesiones a la división por defecto.

## Enlaces en la terminal

Las direcciones que empiezan con `http://`, `https://` o `www.` se vuelven enlaces. Con <kbd>⌘</kbd> presionado, un clic abre la dirección en el navegador; sin la tecla, el clic sigue seleccionando texto o yendo al programa que corre ahí. Al pasar el puntero sobre un enlace se ve qué tecla usar.

Las rutas completas que existen en el disco también se vuelven enlaces: las que empiezan con `/`, con `~/` o, en Windows, con la letra del disco, como `C:\`. <kbd>⌘</kbd> + clic muestra la ruta en el Finder: una carpeta se abre, y un archivo aparece seleccionado en su carpeta. Un `:12` o `:12:5` al final, como en un mensaje de error, queda fuera del enlace. Las rutas relativas, como `src/main.ts`, no se vuelven enlaces.

En Windows y Linux, la tecla es <kbd>Ctrl</kbd>, y la ruta se abre en el Explorador de archivos o en el gestor de archivos.
