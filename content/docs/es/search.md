---
title: Búsqueda
description: Buscar texto en todos los archivos de la carpeta de la sesión, abrir un archivo por nombre y buscar y reemplazar en el archivo abierto.
group: code
order: 6
---

La **Búsqueda** (*Search*) busca un texto en todos los archivos de la carpeta de la sesión y te lleva a la línea donde está. Esta página muestra también cómo abrir un archivo por nombre y cómo buscar solo en el archivo abierto.

## Buscar en los archivos

Abre la **Búsqueda** con su ícono, en la barra de herramientas del borde derecho de la sesión, o con <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, que pone el cursor en el campo **Buscar en todos los archivos** (*Search all files*). La búsqueda empieza con 2 caracteres, apenas dejas de escribir.

Junto al campo están **Distinguir mayúsculas** (*Match case*), **Palabra completa** (*Whole word*) y **Expresión regular** (*Regular expression*). Los resultados vienen agrupados por archivo, con la carpeta, cuántas veces aparece el texto y cada línea con la coincidencia resaltada; el resumen dice, por ejemplo, "12 resultados en 3 archivos" (*12 results in 3 files*). Un clic en una línea abre el archivo en el panel [**Código**](/docs/editor) (*Code*), en esa línea.

## Qué queda fuera

La búsqueda salta lo que git ignora y lo que lista un archivo `.ignore`, la carpeta `.git`, los patrones de **Ocultar archivos** (*Hide files*, mira [Ocultar archivos](/docs/files#ocultar-archivos)), los archivos de más de 2 MB y los archivos binarios. Los archivos y las carpetas que empiezan con punto entran, siempre que git no los ignore.

Se detiene en 2000 resultados, y el resumen dice "lista parcial" (*partial list*). En cada línea, la búsqueda solo mira los primeros 300 caracteres. Una expresión regular inválida muestra el error en lugar del resumen.

## Abrir un archivo por nombre

**Abrir archivo** (*Open file*) encuentra un archivo de la carpeta de la sesión por su nombre y lo abre en el editor. Fuera del código, usa <kbd>⌘</kbd> <kbd>P</kbd> en cualquier mapa de teclas. Con el cursor en el código, usa la tecla de tu mapa: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> en WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> en WebStorm (macOS) y <kbd>⌘</kbd> <kbd>P</kbd> en VS Code; en los mapas WebStorm, <kbd>⌘</kbd> <kbd>P</kbd> ahí muestra los parámetros.

Basta escribir las letras del nombre en orden, sin que tengan que estar juntas; lo que coincide con el nombre del archivo tiene preferencia sobre lo que coincide solo con la carpeta. Las flechas eligen, <kbd>↵</kbd> abre, y <kbd>Esc</kbd> cierra. La lista muestra hasta 50 archivos y deja fuera lo que git ignora, `.git` y los patrones de **Ocultar archivos**. En una carpeta con más de 20 mil archivos, avisa que la lista es parcial.

## Buscar en el archivo abierto

Con el cursor en el código, <kbd>⌘</kbd> <kbd>F</kbd> abre **Buscar** (*Find*) arriba del editor, en cualquier mapa. **Reemplazar** (*Replace*) es <kbd>⌘</kbd> <kbd>R</kbd> en los mapas WebStorm y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> en VS Code. Con el campo abierto, <kbd>F3</kbd> y <kbd>⌘</kbd> <kbd>G</kbd> van a la coincidencia siguiente, y con <kbd>⇧</kbd> a la anterior; <kbd>Esc</kbd> lo cierra.

## Teclas

| Acción | Tecla |
| --- | --- |
| Buscar en todos los archivos | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, en cualquier lugar; en WebStorm, fuera de la terminal, también <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Abrir un archivo por nombre | <kbd>⌘</kbd> <kbd>P</kbd> fuera del código, o la tecla del mapa en el código |
| Buscar en el archivo | <kbd>⌘</kbd> <kbd>F</kbd> |
| Reemplazar en el archivo | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) o <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>; en el mapa de VS Code, **Reemplazar** es <kbd>Ctrl</kbd> <kbd>H</kbd>.

## Plan y límites

La búsqueda, **Abrir archivo** y la búsqueda en el archivo son del plan gratis.

La búsqueda solo mira dentro de la carpeta de la sesión, nunca en otras sesiones o workspaces. Lee texto plano: un archivo que no está en UTF-8 queda fuera.
