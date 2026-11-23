---
title: Editor
description: El editor de cada sesión, junto a la terminal, con resaltado por lenguaje, vista previa de Markdown e imágenes, sugerencias y errores del proyecto, el panel inferior, la selección en columna y el mapa de teclas que elijas.
group: code
order: 1
---

El panel **Código** (*Code*) es el editor de la sesión: su carpeta como árbol, a la izquierda, y los archivos abiertos en pestañas, junto a la terminal. Se abre con el ícono **Código**, en la barra de herramientas del borde derecho de la sesión. El árbol, las pestañas y el Git de cada archivo tienen sus propias páginas: [Archivos](/docs/files), [Pestañas y grupos](/docs/tabs-and-groups) y [Git en el editor](/docs/git-in-the-editor). Las acciones que recorren el código y las que lo cambian con el servidor del lenguaje están en [Moverse por el código](/docs/code-navigation) y [Usos, renombrar y refactorizar](/docs/usages-and-refactoring), y las versiones que guarda el editor, en [Historial local](/docs/local-history).

## Abrir y guardar

Un clic en un archivo del árbol lo abre en una pestaña, y <kbd>⌘</kbd> <kbd>S</kbd> guarda. Para abrir un archivo por nombre, mira [Abrir un archivo por nombre](/docs/search#abrir-un-archivo-por-nombre).

La barra debajo del código muestra la ruta del archivo, la línea y la columna, el lenguaje, el estado del servidor del lenguaje y el fin de línea, LF o CRLF. En un archivo que no está en el último commit, como un archivo nuevo o fuera de un repositorio, dice **fuera de git** (*not in git*).

Los archivos de texto se abren hasta 5 MB, y las imágenes hasta 10 MB. Los demás archivos binarios no se abren en el editor.

La fuente, el ancho de la tabulación, el ajuste de línea, los números de línea y el modificador del multicursor están en [Configuración › Editor](/docs/settings#editor), con el valor por defecto de cada uno.

## Guardar automáticamente

**Guardar automáticamente** (*Save automatically*), en **Configuración › Workspace** (*Settings › Workspace*), viene apagado. Encendido, el editor guarda 1 segundo después de la última edición, nunca encima de un cambio hecho fuera del editor, y cerrar una pestaña con cambios la guarda sin preguntar.

Apagado, cerrar una pestaña con cambios sin guardar pide confirmación, y **Descartar** (*Discard*) la cierra sin guardar. Al cerrar varias pestañas a la vez, una sola pregunta ofrece **Guardar todas** (*Save all*) o **Descartar todas** (*Discard all*).

## Cuando el archivo cambia en el disco

Con la app a la vista, el editor revisa los archivos abiertos cada 2 segundos. Una pestaña sin cambios se recarga sola, y así aparecen en el editor las ediciones del agente.

Si ya habías cambiado el texto, la pestaña avisa: "Este archivo cambió en el disco después de que empezaste a editar." (*This file changed on disk after you started editing.*). **Recargar** (*Reload*) trae la versión del disco, y **Mantener la mía** (*Keep mine*) guarda la tuya encima.

## Resaltado por lenguaje

El resaltado de cada lenguaje se carga cuando se abre el primer archivo de ese lenguaje, con los colores del tema de la app, claro u oscuro. El lenguaje sale de la extensión. Para leer un archivo como otro lenguaje, como un `.env` como Shell, usa [Cambiar el tipo de archivo](/docs/files#cambiar-el-tipo-de-archivo).

## Markdown e imágenes

![En un archivo release.md se escribe una tarea nueva en la lista; Command, Shift y V cambian el código por la vista previa, con la tabla, la lista de tareas y el bloque de código.](/docs-media/editor/markdown.mp4)

En un archivo `.md`, el botón del ojo, en la barra de las pestañas, o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> alterna entre el código y la vista previa, que ya muestra lo que todavía no guardaste. La vista previa tiene tablas, listas de tareas y bloques de código. Un enlace a un sitio se abre en el navegador, un enlace a un archivo de la carpeta abre ese archivo en el editor, y un enlace `#` lleva al título.

Nada se carga en la vista previa: el HTML aparece como texto, y una imagen de la web se vuelve un enlace que se abre en el navegador. Por encima de 300 mil caracteres, el archivo no se previsualiza. En **Configuración › Editor**, **Abrir archivos .md en** (*Open .md files in*) elige cómo se abre un `.md`: **Código**, por defecto, o **Vista previa** (*Preview*).

Las imágenes PNG, JPG, GIF, WebP, BMP e ICO se abren en una pestaña, ajustadas al panel, con sus dimensiones y el tamaño del archivo; un clic muestra la imagen en tamaño real, y otro la ajusta de nuevo. Un SVG se abre como código y tiene la misma vista previa que el Markdown, dibujada como imagen, sin ejecutar scripts.

## Contexto fijo y minimapa

![Al desplazar un archivo TypeScript, la clase, el método y el case en que se está quedan fijos arriba del editor, y el minimapa acompaña a la derecha; un clic en la línea fija del método lleva hasta ella.](/docs-media/editor/contexto-fixo.mp4)

**Contexto fijo al desplazar** (*Sticky scroll*), en **Configuración › Editor**, viene apagado. Encendido, el inicio de la función, la clase o el título en que estás queda arriba del editor, en hasta 5 líneas, y se va cuando la línea que cierra el bloque llega arriba. Un clic en una de esas líneas te lleva a ella.

El **Minimapa** (*Minimap*) dibuja el archivo entero en una franja a la derecha del código; haz clic o arrastra en ella para ir a otra parte. **Mostrar el minimapa** (*Show the minimap*) viene apagado. Encendido, tiene **Dibujo** (*Drawing*), en **Caracteres** (*Characters*, por defecto) o **Bloques** (*Blocks*), **Escala** (*Scale*) de 1 a 3, **Área visible** (*Visible area*), que marca la parte en pantalla **Siempre** (*Always*) o **Al pasar el puntero** (*On hover*, por defecto), y **Ocultar hasta pasar el puntero** (*Hide until hovered*), apagado.

## Sugerencias, documentación y errores

En TypeScript, JavaScript y Rust, el editor habla con el servidor del lenguaje. Las sugerencias vienen del proyecto, con el tipo y la documentación de cada una, y elegir una función de otro archivo ya escribe el `import`. Para pedir las sugerencias, usa **Completar código** (*Basic Completion*): <kbd>⌃</kbd> <kbd>Espacio</kbd> en cualquier mapa, o <kbd>⌥</kbd> <kbd>Esc</kbd> en Mac. Por defecto, macOS usa <kbd>⌃</kbd> <kbd>Espacio</kbd> para cambiar el teclado; en ese caso, [**Configuración › Atajos**](/docs/shortcuts) (*Settings › Shortcuts*) avisa y dice dónde desactivarlo.

Dejar el puntero sobre un nombre muestra su documentación, abrir el `(` de una llamada muestra los parámetros, y los errores aparecen subrayados. En Rust, los errores de `cargo check` se actualizan cada vez que guardas.

Los archivos de más de 2 MB o de 50 mil líneas, y los archivos minificados, con una de las primeras 50 líneas de más de 5 mil caracteres, quedan fuera del servidor: la barra de estado dice "archivo demasiado grande para el servidor" (*file too big for the server*), y el archivo se abre sin sugerencias ni errores. El mismo archivo abierto en dos grupos tiene sugerencias y errores en un solo grupo; mira [Dividir el editor](/docs/tabs-and-groups#dividir-el-editor).

## El servidor del lenguaje

Cuando el servidor del lenguaje no está en la computadora, la app lo descarga sola. Esa primera descarga necesita internet; sin conexión, la barra de estado dice "sin servidor: sin conexión" (*no server: offline*).

La barra de estado muestra el estado del servidor (descargando, indexando, listo o detenido) y cuántos errores y avisos tiene el archivo. Un clic ahí reinicia el servidor o muestra el log. Un servidor que pasa 5 minutos sin ninguna pestaña de su lenguaje a la vista se detiene solo y vuelve cuando abres un archivo de ese lenguaje. Si se cae, la app lo reinicia hasta tres veces seguidas; después, queda detenido hasta que lo reinicies desde la barra de estado.

## Ir a la declaración

**Ir a la declaración** (*Go to Declaration*) funciona también en otro archivo, y <kbd>⌘</kbd> + clic en un nombre hace lo mismo. Una definición en la biblioteca estándar o en una dependencia fuera del proyecto se abre como solo lectura, con un candado en la pestaña y "Fuera del proyecto · solo lectura" (*Outside the project · read-only*) en la barra de estado: puedes navegar y leer, pero nada se edita.

En Rust, la biblioteca estándar necesita su código fuente en tu toolchain (`rustup component add rust-src`); la app nunca cambia el toolchain por su cuenta.

## Panel inferior

Debajo del código, encima de la barra de estado, el editor tiene un panel con las pestañas **Usos** (*Usages*) y **Problemas** (*Problems*). **Problemas** lista los errores, los avisos y la información de los servidores del lenguaje, por archivo, y un clic abre el archivo en la línea. Al hacer clic en la cuenta de errores y avisos de la barra de estado se abre esa pestaña. **Usos** muestra el último resultado de [Buscar usos](/docs/usages-and-refactoring#buscar-usos), de la implementación o del tipo.

Arrastra el borde de arriba del panel para cambiar la altura, o usa <kbd>↑</kbd> y <kbd>↓</kbd> con él en foco; un doble clic vuelve a la altura por defecto. Cada sesión recuerda si el panel estaba abierto, en qué pestaña y con qué altura.

En el código, en los dos mapas WebStorm, <kbd>⌘</kbd> <kbd>3</kbd> abre **Usos** y <kbd>⌘</kbd> <kbd>6</kbd> abre **Problemas**, en lugar de elegir el proyecto 3 o 6. En el mapa de VS Code, **Problemas** es <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>M</kbd>, y **Usos** se abre desde la paleta. La tecla lleva el foco a la lista, y <kbd>Esc</kbd> cierra el panel y devuelve el foco al código. En Windows y Linux, que están en versión preliminar, las teclas son <kbd>Alt</kbd> <kbd>3</kbd> y <kbd>Alt</kbd> <kbd>6</kbd>, o <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>M</kbd> en VS Code.

## Selección en columna y cursores

**Modo de selección en columna** (*Column Selection Mode*, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>8</kbd> en los mapas WebStorm) activa el modo, y la barra de estado muestra **Columna** (*Column*). Con él activado, <kbd>⇧</kbd> y las flechas forman un rectángulo, con un cursor por línea en la misma columna, y arrastrar con el ratón dibuja el rectángulo. En una línea corta el cursor queda al final, y la columna vuelve en una línea más larga. Lo que escribes va a todas las líneas, y deshacer lo revierte todo en un paso. <kbd>Esc</kbd> o la misma tecla apagan el modo.

Para poner otro cursor arriba o abajo, pulsa <kbd>⌥</kbd> dos veces, mantenlo en la segunda y usa <kbd>↑</kbd> o <kbd>↓</kbd>, en los mapas WebStorm. **Agregar cursor arriba** (*Clone Caret Above*) y **Agregar cursor abajo** (*Clone Caret Below*) están también en <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> y <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd>, en cualquier mapa; en los mapas WebStorm, con la pestaña **Usos** mostrando un resultado, esas teclas recorren los usos.

En el mapa de VS Code, el modo de columna está en la paleta, y no hay gesto. En Windows y Linux, el modo es <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>Insert</kbd>, el gesto usa <kbd>Ctrl</kbd> en lugar de <kbd>⌥</kbd>, y agregar un cursor es <kbd>Ctrl</kbd> <kbd>Alt</kbd> con las flechas.

## Accesibilidad

Con **Reducir movimiento** (*Reduce motion*) encendido en los ajustes de accesibilidad del sistema, la app quita las transiciones; en el editor, los números de línea siguen alineados con el código, y un resultado de la búsqueda lleva a la línea correcta. El árbol, las pestañas y los menús funcionan con el teclado, y un lector de pantalla oye cuando una pestaña no está guardada, está en vista previa o está fijada.

## Mapa de teclas

En **Configuración › Editor › Mapa de teclas** (*Keymap*), elige **WebStorm** (por defecto), **WebStorm (macOS)** o **VS Code**. El mapa vale dentro del código; sus teclas de pestañas y de buscar acción valen en toda la app, y en la terminal solo las que el shell no usa. Cada tecla hace la acción de verdad, y cuando la acción no aplica ahí, la tecla pasa a la app. **Configuración › Atajos** lista todas las teclas del mapa elegido y las de Persisty, con búsqueda; en la tabla, el nombre en cursiva es el de la app en inglés.

Las teclas de los dos mapas WebStorm en Mac:

| Acción | WebStorm | WebStorm (macOS) |
| --- | --- | --- |
| Ir a la declaración | <kbd>⌘</kbd> <kbd>B</kbd> o <kbd>⌘</kbd> + clic | <kbd>⌘</kbd> <kbd>B</kbd> o <kbd>⌘</kbd> + clic |
| Información de parámetros (*Parameter Info*) | <kbd>⌘</kbd> <kbd>P</kbd> | <kbd>⌘</kbd> <kbd>P</kbd> |
| Documentación rápida (*Quick Documentation*) | <kbd>⌃</kbd> <kbd>J</kbd> | <kbd>F1</kbd> o <kbd>⌃</kbd> <kbd>J</kbd> |
| Atrás / Adelante (*Back / Forward*) | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd>, o <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Error siguiente / anterior (*Next / Previous Highlighted Error*) | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> |
| Ir al archivo (*Go to File*) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Duplicar línea o selección (*Duplicate Line or Selection*) | <kbd>⌘</kbd> <kbd>D</kbd> | <kbd>⌘</kbd> <kbd>D</kbd> |
| Borrar línea (*Delete Line*) | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Ir a la línea (*Go to Line*) | <kbd>⌘</kbd> <kbd>G</kbd> | <kbd>⌘</kbd> <kbd>L</kbd> |
| Ir al inicio / al final del bloque de código (*Move Caret to Code Block Start / End*) | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>]</kbd> |
| Mover instrucción arriba / abajo, con los comentarios encima (*Move Statement Up / Down*) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Buscar acción (*Find Action*) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

El mapa de VS Code mantiene sus propias teclas, como <kbd>F12</kbd> para ir a la declaración y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> para buscar una acción. <kbd>⌘</kbd> <kbd>K</kbd> abre la paleta, que también lista las acciones del editor. En el mapa de VS Code, con el cursor en el código, <kbd>⌘</kbd> <kbd>K</kbd> empieza sus teclas de dos partes, como <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, que comenta la línea; ahí, las acciones del editor están en <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

En Windows y Linux, que están en versión preliminar, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>, y los dos mapas WebStorm usan las teclas de la columna WebStorm, con una diferencia: **Documentación rápida** es <kbd>Ctrl</kbd> <kbd>Q</kbd>.

Las teclas de navegación, de usos y de refactorización de cada mapa están en [Moverse por el código](/docs/code-navigation#teclas) y [Usos, renombrar y refactorizar](/docs/usages-and-refactoring#teclas), y la lista de las teclas que cambian de sentido en el código, en [Atajos](/docs/shortcuts#dentro-del-código).

## Plan y límites

El editor es del plan gratis, con todo lo de esta página.

Las sugerencias, la documentación, los errores, **Ir a la declaración**, el panel **Problemas** y las acciones que piden el servidor del lenguaje existen solo en TypeScript, JavaScript y Rust; en los demás lenguajes, el editor tiene el resaltado. La primera descarga de cada servidor necesita internet. Los archivos de texto de más de 5 MB y las imágenes de más de 10 MB no se abren.
