---
title: Moverse por el código
description: Archivos y lugares recientes, la última edición, la estructura del archivo, ir al símbolo y a la clase, la definición rápida, los favoritos y Buscar en todo, con las teclas de cada mapa.
group: code
order: 2
---

Estas acciones te llevan a otro punto del código sin buscar en el árbol. Casi todas valen con el cursor en el código del [editor](/docs/editor), y todas aparecen también en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>) y en [**Configuración › Atajos**](/docs/shortcuts#lista-completa) (*Settings › Shortcuts*). La estructura del archivo, ir al símbolo y a la clase, el método siguiente y la definición rápida dependen del servidor del lenguaje, que hoy existe para TypeScript, JavaScript y Rust; sin él, la tecla pasa a la app. Las teclas del texto son las del mapa WebStorm en Mac, y las de cada mapa están en [Teclas](#teclas).

## Archivos y lugares recientes

**Archivos recientes** (*Recent Files*, <kbd>⌘</kbd> <kbd>E</kbd>) lista los últimos 50 archivos abiertos en la sesión, del más reciente al más antiguo, incluso los de pestañas ya cerradas. El archivo a la vista queda fuera, y los que tienen pestaña abierta llevan la marca **abierta** (*open*). La lista sigue ahí después de cerrar la app y acompaña los archivos renombrados, movidos y eliminados. Con ella abierta, la misma tecla muestra solo los **Archivos editados en esta sesión** (*Files edited in this session*).

**Lugares recientes** (*Recent Locations*, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd>) lista por dónde pasó el cursor y lo que se editó, marcados como **visitado** (*visited*) o **editado** (*edited*), cada lugar con el archivo, la línea y 3 líneas de código. Al pulsar la tecla de nuevo quedan solo los **Lugares editados** (*Edited locations*).

**Ir al último lugar editado** (*Go to Last Edit Location*, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd>) lleva el cursor a la última edición, y cada vez que la pulsas de nuevo, a la edición anterior. El lugar del que saliste queda en **Volver** (*Back*), como después de **Ir a la declaración** (*Go to Declaration*). Los lugares visitados y editados duran solo mientras la app está abierta.

## Estructura del archivo y métodos

**Estructura del archivo** (*File Structure*, <kbd>⌘</kbd> <kbd>F12</kbd>) abre los símbolos del archivo en una lista con sangría, ya en el símbolo donde está el cursor. Escribir filtra la lista y mantiene los padres de cada símbolo que coincide. <kbd>↵</kbd> lleva al símbolo, y el lugar de partida queda en **Volver**.

**Método siguiente** (*Next Method*) y **Método anterior** (*Previous Method*) llevan el cursor a la siguiente o a la anterior función, método, constructor o clase; en el primero y en el último, no pasa nada. En el mapa WebStorm, las teclas son <kbd>⌃</kbd> <kbd>↓</kbd> y <kbd>⌃</kbd> <kbd>↑</kbd>, que macOS usa para Mission Control por defecto, y por eso también <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> y <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd>. **Configuración › Atajos** avisa cuando macOS usa una tecla del mapa.

## Ir al símbolo y a la clase

**Ir al símbolo** (*Go to Symbol*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd>) e **Ir a la clase** (*Go to Class*, <kbd>⌘</kbd> <kbd>N</kbd>) buscan en todo el proyecto mientras escribes, desde el primer carácter. La lista muestra hasta 200 resultados, cada uno con su tipo, como **Clase** (*Class*) o **Función** (*Function*), dónde está declarado y la ruta. Con una selección de una línea en el código, la búsqueda ya empieza con ese texto.

Mientras el servidor indexa, la lista avisa "El servidor todavía está indexando" (*The server is still indexing*). Un símbolo de fuera de la carpeta, como el de una biblioteca, se abre en una pestaña de solo lectura. Sin el servidor, <kbd>⌘</kbd> <kbd>N</kbd> abre una terminal nueva, como fuera del código. El mapa de VS Code no tiene **Ir a la clase**.

## Definición rápida

**Definición rápida** (*Quick Definition*, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd>) muestra la declaración del nombre del cursor en un popup junto a él, con el resaltado del lenguaje, de solo lectura y con hasta 30 líneas. Con varios destinos, arriba dice "1 de N" (*1 of N*), y <kbd>←</kbd> y <kbd>→</kbd> pasan de uno a otro. <kbd>↵</kbd> abre el lugar y deja el de partida en **Volver**; <kbd>Esc</kbd>, editar, desplazarte o hacer clic fuera cierran el popup. Una definición de fuera de la carpeta también aparece.

En el mapa WebStorm (macOS), la tecla que funciona es <kbd>⌘</kbd> <kbd>Y</kbd>: la otra del mapa, <kbd>⌥</kbd> <kbd>Espacio</kbd>, escribe un espacio en Mac. Sin el servidor, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> abre **Detalles** (*Details*), como fuera del código.

## Mostrar en el árbol

**Mostrar en el árbol** (*Show in Tree*, <kbd>⌥</kbd> <kbd>F1</kbd>) te lleva al archivo de la pestaña en el [árbol](/docs/files): abre el panel **Código** (*Code*) y las carpetas hasta el archivo, selecciona su fila y se desplaza hasta ella. El mismo elemento está en el [menú de la pestaña](/docs/tabs-and-groups#el-menú-de-la-pestaña). Un archivo de fuera de la carpeta de la sesión no está en el árbol y no tiene ese elemento.

## Favoritos

Los favoritos marcan líneas, archivos y carpetas, y se guardan por carpeta: dos sesiones en la misma carpeta ven los mismos.

**Marcar o desmarcar favorito** (*Toggle Bookmark*, <kbd>F11</kbd>) marca la línea del cursor, o la desmarca. Aparece una marca en el margen de los números que acompaña la línea cuando el texto cambia. **Mostrar favoritos** (*Show Bookmarks*, <kbd>⇧</kbd> <kbd>F11</kbd>) abre la lista, separada en **Líneas** (*Lines*), **Archivos** (*Files*) y **Carpetas** (*Folders*): <kbd>↵</kbd> lleva al lugar, o muestra la carpeta en el árbol, y <kbd>⌦</kbd> (<kbd>fn</kbd> <kbd>⌫</kbd> en el teclado del Mac) quita el favorito.

Los archivos y las carpetas entran por el submenú **Favoritos** (*Bookmarks*) del árbol y de la pestaña: **Agregar a favoritos** (*Add to Bookmarks*), o **Quitar de favoritos** (*Remove from Bookmarks*) cuando los elementos ya están ahí. Los favoritos siguen al archivo o a la carpeta cuando se renombran o se mueven, y se van con ellos cuando se eliminan. Un archivo de fuera de la carpeta de la sesión no tiene favoritos.

En el mapa WebStorm (macOS), marcar es <kbd>F3</kbd> y la lista es <kbd>⌘</kbd> <kbd>F3</kbd>, como en WebStorm; por eso **Buscar siguiente** (*Find Next*) pasa a <kbd>⌘</kbd> <kbd>G</kbd> (mira [Buscar en el archivo abierto](/docs/search#buscar-en-el-archivo-abierto)). En el mapa WebStorm, macOS usa <kbd>F11</kbd> para mostrar el escritorio, y **Configuración › Atajos** dice dónde apagarlo.

## Buscar en todo

Pulsa <kbd>⇧</kbd> dos veces para abrir **Buscar en todo** (*Search Everywhere*): archivos, símbolos y acciones en una sola lista, con las pestañas **Todo** (*All*), **Archivos**, **Símbolos** (*Symbols*) y **Acciones** (*Actions*). <kbd>Tab</kbd> y <kbd>⇧</kbd> <kbd>Tab</kbd> cambian de pestaña. **Todo** muestra hasta 8 resultados de cada tipo. Elegir uno abre el archivo, va al símbolo o ejecuta la acción.

Los archivos y las acciones funcionan sin servidor del lenguaje. La pestaña **Símbolos** solo aparece con un servidor en marcha en la sesión que liste los símbolos del proyecto; en **Todo**, los símbolos entran en la lista cuando él responde.

El gesto vale en la sesión, también fuera del código, pero no en la terminal ni en un campo de texto. Escribir mayúsculas, mantener <kbd>⇧</kbd>, un clic o la rueda del ratón entre las dos pulsaciones no abren la lista, y tampoco se abre en las páginas de Configuración y de uso ni con un diálogo abierto. El mapa de VS Code no tiene el gesto.

## Teclas

Las teclas en Mac. Donde la tabla muestra —, el mapa no tiene tecla para la acción, y está en la paleta.

| Acción | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Archivos recientes | <kbd>⌘</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>E</kbd> | — |
| Lugares recientes | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | — |
| Ir al último lugar editado | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>Q</kbd> |
| Estructura del archivo | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Método siguiente / Método anterior | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, o <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | — |
| Ir al símbolo | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌘</kbd> <kbd>T</kbd> |
| Ir a la clase | <kbd>⌘</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>O</kbd> | — |
| Definición rápida | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌥</kbd> <kbd>F12</kbd> |
| Mostrar en el árbol | <kbd>⌥</kbd> <kbd>F1</kbd> | <kbd>⌥</kbd> <kbd>F1</kbd> | — |
| Marcar o desmarcar favorito | <kbd>F11</kbd> | <kbd>F3</kbd> | — |
| Mostrar favoritos | <kbd>⇧</kbd> <kbd>F11</kbd> | <kbd>⌘</kbd> <kbd>F3</kbd> | — |
| Buscar en todo | <kbd>⇧</kbd> dos veces | <kbd>⇧</kbd> dos veces | — |

En VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> abre la estructura solo con un servidor que liste los símbolos; sin él, la tecla abre el [Tablero](/docs/board), como fuera del código.

En Windows y Linux, que están en versión preliminar, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>, y los dos mapas WebStorm usan las teclas de la columna WebStorm, con una diferencia: **Método siguiente** y **Método anterior** son <kbd>Alt</kbd> <kbd>↓</kbd> y <kbd>Alt</kbd> <kbd>↑</kbd>. En el mapa de VS Code, **Definición rápida** es <kbd>Alt</kbd> <kbd>F12</kbd> en Windows y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>F10</kbd> en Linux.

## Plan y límites

Todo lo de esta página es del plan gratis.

La estructura del archivo, ir al símbolo y a la clase, el método siguiente, la definición rápida y la pestaña **Símbolos** de **Buscar en todo** existen solo en TypeScript, JavaScript y Rust, con el servidor del lenguaje en marcha. Los lugares recientes y la última edición duran mientras la app está abierta.
