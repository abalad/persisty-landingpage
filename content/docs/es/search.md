---
title: Búsqueda
description: Buscar y reemplazar texto en todos los archivos de la carpeta de la sesión, abrir un archivo por nombre y buscar y reemplazar en el archivo abierto.
group: code
order: 9
---

La **Búsqueda** (*Search*) busca un texto en todos los archivos de la carpeta de la sesión, te lleva a la línea donde está y reemplaza el texto en varios archivos a la vez. Esta página muestra también cómo abrir un archivo por nombre y cómo buscar solo en el archivo abierto. Para encontrar un archivo, un símbolo o una acción en una sola lista, mira [Buscar en todo](/docs/code-navigation#buscar-en-todo).

## Buscar en los archivos

Abre la **Búsqueda** con su ícono, en la barra de herramientas del borde derecho de la sesión, o con <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, que pone el cursor en el campo **Buscar en todos los archivos** (*Search all files*). La búsqueda empieza con 2 caracteres, apenas dejas de escribir.

Junto al campo están **Distinguir mayúsculas** (*Match case*), **Palabra completa** (*Whole word*) y **Expresión regular** (*Regular expression*). Los resultados vienen agrupados por archivo, con la carpeta, cuántas veces aparece el texto y cada línea con la coincidencia resaltada; el resumen dice, por ejemplo, "12 resultados en 3 archivos" (*12 results in 3 files*). Un clic en una línea abre el archivo en el panel [**Código**](/docs/editor) (*Code*), en esa línea.

## Qué queda fuera

La búsqueda salta lo que git ignora y lo que lista un archivo `.ignore`, la carpeta `.git`, los patrones de **Ocultar archivos** (*Hide files*, mira [Ocultar archivos](/docs/files#ocultar-archivos)), los archivos de más de 2 MB y los archivos binarios. Los archivos y las carpetas que empiezan con punto entran, siempre que git no los ignore.

Se detiene en 2000 resultados, y el resumen dice "lista parcial" (*partial list*). En cada línea, la búsqueda solo mira los primeros 300 caracteres. Una expresión regular inválida muestra el error en lugar del resumen.

## Reemplazar en archivos

El botón a la izquierda del campo, **Mostrar la fila de reemplazo** (*Show the replace row*), abre el campo **Reemplazar por** (*Replace with*). La tecla de **Reemplazar en archivos** (*Replace in Files*) también lo abre: <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> en WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> en WebStorm (macOS) y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> en VS Code. Desde la tecla, con una selección de una línea en el código, el texto seleccionado va a la búsqueda. En WebStorm (macOS), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> solo reemplaza con el cursor en el código; fuera de él, sigue siendo [**Restaurar todo**](/docs/sessions-and-recovery#restaurar-todo) (*Restore all*).

Cada fila de la lista muestra el texto viejo tachado y el nuevo al lado; en una búsqueda con expresión regular, `$1` y `${nombre}` ya aparecen reemplazados. En cada archivo, **Reemplazar en este archivo** (*Replace in this file*) reemplaza solo ahí, y **Quitar de la lista** (*Remove from the list*) deja el archivo fuera. **Reemplazar todo** (*Replace all*) pregunta antes, con cuántas apariciones y archivos van a cambiar, y queda apagado cuando la lista se cortó: "Demasiados resultados; afina la búsqueda" (*Too many results; narrow the search*). Mientras corre una búsqueda nueva, la lista anterior sigue a la vista, y los botones esperan a que llegue la nueva.

Una pestaña abierta recibe el reemplazo en su texto, con deshacer. Un archivo cerrado se guarda después de pasar al [historial local](/docs/local-history). Un archivo que cambió después de la búsqueda queda fuera, y el aviso dice cuál.

## Abrir un archivo por nombre

**Abrir archivo** (*Open file*) encuentra un archivo de la carpeta de la sesión por su nombre y lo abre en el editor. Fuera del código, usa <kbd>⌘</kbd> <kbd>P</kbd> en cualquier mapa de teclas. Con el cursor en el código, usa la tecla de tu mapa: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> en WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> en WebStorm (macOS) y <kbd>⌘</kbd> <kbd>P</kbd> en VS Code; en los mapas WebStorm, <kbd>⌘</kbd> <kbd>P</kbd> ahí muestra los parámetros.

Basta escribir las letras del nombre en orden, sin que tengan que estar juntas; lo que coincide con el nombre del archivo tiene preferencia sobre lo que coincide solo con la carpeta. Las flechas eligen, <kbd>↵</kbd> abre, y <kbd>Esc</kbd> cierra. La lista muestra hasta 50 archivos y deja fuera lo que git ignora, `.git` y los patrones de **Ocultar archivos**. En una carpeta con más de 20 mil archivos, avisa que la lista es parcial.

## Buscar en el archivo abierto

Con el cursor en el código, <kbd>⌘</kbd> <kbd>F</kbd> abre **Buscar** (*Find*) arriba del editor, en cualquier mapa. **Reemplazar** (*Replace*) es <kbd>⌘</kbd> <kbd>R</kbd> en los mapas WebStorm y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> en VS Code. Con el cursor en el campo, <kbd>F3</kbd> y <kbd>⌘</kbd> <kbd>G</kbd> van a la coincidencia siguiente, y con <kbd>⇧</kbd> a la anterior, en cualquier mapa; <kbd>Esc</kbd> lo cierra.

De vuelta en el texto, **Buscar siguiente** (*Find Next*) sigue el mapa: <kbd>F3</kbd> o <kbd>⌃</kbd> <kbd>L</kbd> en WebStorm, <kbd>⌘</kbd> <kbd>G</kbd> en WebStorm (macOS) y <kbd>⌘</kbd> <kbd>G</kbd> o <kbd>F3</kbd> en VS Code, y con <kbd>⇧</kbd> la anterior. En WebStorm (macOS), <kbd>F3</kbd> marca un [favorito](/docs/code-navigation#favoritos), como en WebStorm. Sin una búsqueda hecha, la tecla abre **Buscar**.

## Teclas

| Acción | Tecla |
| --- | --- |
| Buscar en todos los archivos | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, en cualquier lugar; en WebStorm, fuera de la terminal, también <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Abrir un archivo por nombre | <kbd>⌘</kbd> <kbd>P</kbd> fuera del código, o la tecla del mapa en el código |
| Buscar en el archivo | <kbd>⌘</kbd> <kbd>F</kbd> |
| Reemplazar en archivos | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (WebStorm), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> en el código (WebStorm (macOS)) o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> (VS Code) |
| Reemplazar en el archivo | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) o <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>; en el mapa de VS Code, **Reemplazar** es <kbd>Ctrl</kbd> <kbd>H</kbd>. **Reemplazar en archivos** es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> en los mapas WebStorm, solo con el cursor en el código (fuera de él, la tecla es **Restaurar todo**), y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd> en VS Code. En los mapas WebStorm, **Buscar siguiente** es <kbd>F3</kbd> o <kbd>Ctrl</kbd> <kbd>L</kbd>.

## Plan y límites

La búsqueda, el reemplazo en archivos, **Abrir archivo** y la búsqueda en el archivo son del plan gratis.

La búsqueda solo mira dentro de la carpeta de la sesión, nunca en otras sesiones o workspaces. Lee texto plano: un archivo que no está en UTF-8 queda fuera.
