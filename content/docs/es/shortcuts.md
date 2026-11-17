---
title: Atajos de teclado
description: Las teclas de Persisty en Mac, las del mapa del editor dentro del código y dónde ver la lista completa en la app.
group: reference
order: 1
---

Las teclas de la app valen en todo Persisty; dentro del código, las del mapa del editor van primero. La lista completa, con las teclas del mapa que elegiste, está en [**Configuración › Atajos**](/docs/settings#atajos) (*Settings › Shortcuts*), con búsqueda.

## Teclas de la app

En Mac, los atajos de la app siempre llevan <kbd>⌘</kbd>; el <kbd>⌃</kbd> queda para la terminal y para el mapa del editor.

| Acción | Atajo |
| --- | --- |
| Buscar | <kbd>⌘</kbd> <kbd>K</kbd> |
| Barra de proyectos | <kbd>⌘</kbd> <kbd>B</kbd> |
| [Tablero de sesiones](/docs/board) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Mostrar u ocultar el panel lateral | <kbd>⌘</kbd> <kbd>&#92;</kbd> |
| Abrir archivo por nombre (fuera del código) | <kbd>⌘</kbd> <kbd>P</kbd> |
| [Buscar en todos los archivos](/docs/search) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| [Cambios de git](/docs/changes) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> |
| Guardar archivo | <kbd>⌘</kbd> <kbd>S</kbd> |
| Vista previa de Markdown (en el editor) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
| Nueva terminal en el workspace actual | <kbd>⌘</kbd> <kbd>N</kbd> |
| Elegir qué abrir | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| Nueva sesión con el agente por defecto | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> |
| Dictar (con el dictado activado) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> |
| [Restaurar todo](/docs/sessions-and-recovery#restaurar-todo) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Detalles | <kbd>⌘</kbd> <kbd>I</kbd> |
| Contraer workspaces | <kbd>⌘</kbd> <kbd>J</kbd> |
| [Ejecutar / detener comando](/docs/commands) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Salida del comando | <kbd>⌘</kbd> <kbd>E</kbd> |
| Sesión anterior / siguiente (fuera del código) | <kbd>⌘</kbd> <kbd>←</kbd> <kbd>⌘</kbd> <kbd>→</kbd> |
| Cerrar la pestaña del editor (en el panel Código, fuera del texto) | <kbd>⌘</kbd> <kbd>W</kbd> |
| Alternar entre pestañas | <kbd>⌃</kbd> <kbd>Tab</kbd>; <kbd>⇧</kbd> <kbd>Tab</kbd> vuelve |
| Proyecto 1–9 | <kbd>⌘</kbd> <kbd>1</kbd> … <kbd>⌘</kbd> <kbd>9</kbd> |
| Configuración | <kbd>⌘</kbd> <kbd>,</kbd> |

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> es la tecla por defecto de **Dictar** (*Dictate*). Se cambia en **Configuración › Voz** (*Settings › Voice*), y solo aparece en **Configuración › Atajos** con el **Dictado por voz** (*Voice dictation*) activado; mira [Atajo del dictado](/docs/voice#atajo).

## Dentro del código

Las teclas del mapa elegido van primero; cuando la acción del mapa no aplica ahí, la tecla pasa a la app. En WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> sobre un nombre va a la declaración y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> abre un archivo por nombre. En WebStorm (macOS), el que abre un archivo por nombre es <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>, en lugar del tablero de sesiones. En los dos mapas WebStorm, <kbd>⌘</kbd> <kbd>D</kbd> duplica la línea, y <kbd>⌃</kbd> <kbd>G</kbd> agrega a la selección la siguiente coincidencia.

En WebStorm (macOS) y en VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> es **Buscar anterior** (*Find Previous*) después de una búsqueda en el archivo; sin búsqueda, la tecla abre los **Cambios de git** (*Git changes*). En Mac, en cualquier mapa, <kbd>⌘</kbd> <kbd>←</kbd> y <kbd>⌘</kbd> <kbd>→</kbd> llevan el cursor al inicio y al final de la línea; fuera del código, cambian de sesión.

La tabla con las teclas de cada mapa está en [Mapa de teclas](/docs/editor#mapa-de-teclas).

## Paleta de comandos

<kbd>⌘</kbd> <kbd>K</kbd> abre la paleta, que busca sesiones, proyectos y acciones. Con un archivo abierto en el editor, también lista las acciones del editor que valen ahí, con las teclas del mapa elegido. **Buscar acción** (*Find Action*) abre la paleta solo con esas acciones: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> en los mapas WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> o <kbd>F1</kbd> en VS Code. Sin archivo abierto, abre la paleta entera.

En el mapa de VS Code, con el cursor en el código, <kbd>⌘</kbd> <kbd>K</kbd> empieza sus teclas de dos partes, como <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, que comenta la línea; ahí, las acciones del editor están en <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

## Archivos

Estas teclas valen con el árbol de archivos en foco. Abrir el menú, cortar, copiar, pegar y deshacer funcionan en cualquier mapa; las demás son de los mapas WebStorm, y en el mapa de VS Code esas acciones están en el menú del clic derecho. Mira [Archivos](/docs/files#teclas).

| Acción | Atajo |
| --- | --- |
| Abrir el menú de archivos | <kbd>⇧</kbd> <kbd>F10</kbd> |
| Renombrar | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mover a otra carpeta | <kbd>F6</kbd> |
| Copiar a otra carpeta | <kbd>F5</kbd> |
| Cortar, copiar y pegar archivos | <kbd>⌘</kbd> <kbd>X</kbd> <kbd>⌘</kbd> <kbd>C</kbd> <kbd>⌘</kbd> <kbd>V</kbd> |
| Eliminar a la Papelera | <kbd>⌫</kbd> |
| Deshacer la eliminación (mientras se ve el aviso) | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Copiar ruta (también en la pestaña y en el código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referencia (también en la pestaña y en el código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar el árbol con la carpeta | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

## Pestañas y grupos

<kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valen en cualquier mapa, con la pestaña en foco. Las demás teclas son de los mapas WebStorm; en el mapa de VS Code, esas acciones están en la paleta y en el menú de la pestaña. Mira [Pestañas y grupos](/docs/tabs-and-groups#teclas).

| Acción | Atajo |
| --- | --- |
| Mover la pestaña a la izquierda o a la derecha | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> |
| Maximizar el editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Grupo siguiente y anterior | <kbd>⌥</kbd> <kbd>Tab</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir el archivo a la derecha (en el árbol) | <kbd>⇧</kbd> <kbd>↵</kbd> |

## Lista completa

**Configuración › Atajos** muestra todas las teclas del mapa elegido y las de Persisty, en palabras, en grupos como **Navegación** (*Navigation*), **Pestañas** (*Tabs*), **Archivos** (*Files*) y **Git**; las teclas de la app están en el grupo **Persisty**. La búsqueda encuentra una acción por el nombre o por las teclas en palabras, como `command shift o`, sin importar los acentos.

Cada fila dice dónde vale la tecla, como "en el árbol, en la pestaña y en el editor" (*in the tree, in the tab, and in the editor*). Cuando una tecla de la app hace otra cosa en el código, la fila dice las dos, como en WebStorm: "En el código: Ir a la declaración · Fuera del código: Barra de proyectos" (*In the code: Go to Declaration · Outside the code: Project bar*). Las acciones sin tecla propia, como las del submenú Git y las de grupos, aparecen con el lugar donde están: el menú del árbol, el de la pestaña o la paleta.

Arriba, aparece un aviso por cada tecla del mapa o de la app que macOS usa, como <kbd>⌃</kbd> <kbd>Espacio</kbd> para cambiar de teclado, con la ruta en Ajustes del Sistema › Teclado › Atajos de teclado para desactivarla y, cuando existe, la otra tecla de la misma acción.

## Cuando una tecla no vale ahí

En el árbol de archivos y en la pestaña, una tecla del mapa cuya acción no puede correr ahí muestra el motivo en un aviso, en lugar de no hacer nada: "esta tecla no vale aquí" (*this key does not work here*), "solo en el texto de un archivo" (*only in the text of a file*), "el archivo no tiene análisis de código" (*the file has no code analysis*) o "el archivo es de solo lectura" (*the file is read-only*).

## Windows y Linux

En Windows y Linux, que están en versión preliminar, los atajos de la app usan <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>, y el dictado es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. En el código, en cualquier mapa, <kbd>Ctrl</kbd> <kbd>←</kbd> y <kbd>Ctrl</kbd> <kbd>→</kbd> avanzan de palabra en palabra, y <kbd>Home</kbd> y <kbd>End</kbd> llevan al inicio y al final de la línea. En la terminal, <kbd>Ctrl</kbd> <kbd>←</kbd> y <kbd>Ctrl</kbd> <kbd>→</kbd> quedan para el shell. En los mapas del editor, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>; mira [Mapa de teclas](/docs/editor#mapa-de-teclas). En el árbol, en los mapas WebStorm, eliminar es <kbd>Delete</kbd> o <kbd>Alt</kbd> <kbd>Delete</kbd>, y cambiar de grupo no tiene tecla.
