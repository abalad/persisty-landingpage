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
| Vista previa de Markdown (en el editor; en los mapas WebStorm, fuera del código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
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

Algunas de estas teclas hacen otra cosa con el cursor en el código; mira [Dentro del código](#dentro-del-código).

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> es la tecla por defecto de **Dictar** (*Dictate*). Se cambia en **Configuración › Voz** (*Settings › Voice*), y solo aparece en **Configuración › Atajos** con el **Dictado por voz** (*Voice dictation*) activado; mira [Atajo del dictado](/docs/voice#atajo).

## Dentro del código

Las teclas del mapa elegido van primero; cuando la acción del mapa no aplica ahí, la tecla pasa a la app. En WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> sobre un nombre va a la declaración y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> abre un archivo por nombre. En WebStorm (macOS), el que abre un archivo por nombre es <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>, en lugar del tablero de sesiones. En los dos mapas WebStorm, <kbd>⌘</kbd> <kbd>D</kbd> duplica la línea, y <kbd>⌃</kbd> <kbd>G</kbd> agrega a la selección la siguiente coincidencia.

En WebStorm (macOS) y en VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> es **Buscar anterior** (*Find Previous*) después de una búsqueda en el archivo; sin búsqueda, la tecla abre los **Cambios de git** (*Git changes*). En Mac, en cualquier mapa, <kbd>⌘</kbd> <kbd>←</kbd> y <kbd>⌘</kbd> <kbd>→</kbd> llevan el cursor al inicio y al final de la línea; fuera del código, cambian de sesión.

Estas teclas de la app cambian de sentido solo con el cursor en el código, como en WebStorm. Algunas cambian siempre; las marcadas "con el servidor" cambian solo cuando el servidor del lenguaje ofrece la acción, y sin él hacen lo que hacen en la app.

| Tecla | En el código | Fuera del código |
| --- | --- | --- |
| <kbd>⌘</kbd> <kbd>E</kbd> | **Archivos recientes** (*Recent Files*), en los mapas WebStorm | Salida del comando |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | **Lugares recientes** (*Recent Locations*), en los mapas WebStorm | Ejecutar / detener comando |
| <kbd>⌘</kbd> <kbd>3</kbd> y <kbd>⌘</kbd> <kbd>6</kbd> | **Usos** (*Usages*) y **Problemas** (*Problems*) del panel inferior, en los mapas WebStorm | Proyecto 3 y proyecto 6 |
| <kbd>⌘</kbd> <kbd>N</kbd> | **Ir a la clase** (*Go to Class*), en WebStorm, con el servidor | Nueva terminal en el workspace actual |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | **Definición rápida** (*Quick Definition*), en WebStorm, con el servidor | Detalles |
| <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> | **Insertar en línea** (*Inline*), en los mapas WebStorm, con el servidor | Nueva sesión con el agente por defecto |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> | **Reemplazar en archivos** (*Replace in Files*), en WebStorm (macOS) | Restaurar todo |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> | **Pegar del historial** (*Paste from History*), en los mapas WebStorm | Vista previa de Markdown |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | **Ir al archivo** (*Go to File*), en WebStorm; **Nuevo archivo borrador** (*New Scratch File*), en WebStorm (macOS) | Elegir qué abrir |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> | **Ir al archivo** (*Go to File*), en WebStorm (macOS); **Estructura del archivo** (*File Structure*), en VS Code, con el servidor | Tablero de sesiones |
| <kbd>⌘</kbd> <kbd>B</kbd> | **Ir a la declaración** (*Go to Declaration*), en los mapas WebStorm, con el servidor | Barra de proyectos |

[**Configuración › Atajos**](#lista-completa) muestra los dos sentidos en la fila de cada una. La tabla con las teclas de cada mapa está en [Mapa de teclas](/docs/editor#mapa-de-teclas).

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
| Buscar usos del archivo (también en la pestaña) | <kbd>⌥</kbd> <kbd>F7</kbd> |
| Deshacer la eliminación (mientras se ve el aviso) | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Copiar ruta (también en la pestaña y en el código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referencia (también en la pestaña y en el código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar el árbol con la carpeta | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

**Nuevo archivo borrador** (*New Scratch File*) es <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>N</kbd> en WebStorm y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> en WebStorm (macOS), con el cursor en el código; mira [Archivos borrador](/docs/files#archivos-borrador).

## Pestañas y grupos

<kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valen en cualquier mapa, con la pestaña en foco. Las demás teclas son de los mapas WebStorm; en el mapa de VS Code, esas acciones están en la paleta y en el menú de la pestaña. Mira [Pestañas y grupos](/docs/tabs-and-groups#teclas).

| Acción | Atajo |
| --- | --- |
| Mover la pestaña a la izquierda o a la derecha | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> |
| Maximizar el editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Grupo siguiente y anterior | <kbd>⌥</kbd> <kbd>Tab</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir el archivo a la derecha (en el árbol) | <kbd>⇧</kbd> <kbd>↵</kbd> |

## Navegar, usos y refactorización

Las teclas del código para recorrerlo y cambiarlo con el servidor del lenguaje, en el mapa WebStorm en Mac. Las de los otros mapas y las de Windows y Linux están en [Moverse por el código](/docs/code-navigation#teclas), [Usos, renombrar y refactorizar](/docs/usages-and-refactoring#teclas) y [Editor](/docs/editor#panel-inferior).

| Acción | Atajo |
| --- | --- |
| Archivos recientes / Lugares recientes | <kbd>⌘</kbd> <kbd>E</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Ir al último lugar editado | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> |
| Estructura del archivo | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Ir al símbolo / Ir a la clase | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> / <kbd>⌘</kbd> <kbd>N</kbd> |
| Método siguiente / Método anterior | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, o <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> |
| Definición rápida | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> |
| Mostrar en el árbol | <kbd>⌥</kbd> <kbd>F1</kbd> |
| Marcar o desmarcar favorito / Mostrar favoritos | <kbd>F11</kbd> / <kbd>⇧</kbd> <kbd>F11</kbd> |
| Buscar en todo | <kbd>⇧</kbd> dos veces |
| Buscar usos / Uso siguiente | <kbd>⌥</kbd> <kbd>F7</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> |
| Ir a la implementación / Ir a la declaración del tipo | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> |
| Resaltar usos en el archivo | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> |
| Renombrar símbolo | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mostrar correcciones rápidas y acciones | <kbd>⌥</kbd> <kbd>↵</kbd> |
| Extraer variable, constante, función / Insertar en línea | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> |
| Refactorizar… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> |
| Reformatear código / Optimizar imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |
| Usos / Problemas, en el panel inferior | <kbd>⌘</kbd> <kbd>3</kbd> / <kbd>⌘</kbd> <kbd>6</kbd> |
| Reemplazar en archivos | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Modo de selección en columna | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>8</kbd> |
| Agregar cursor arriba / abajo | <kbd>⌥</kbd> dos veces y mantener, con <kbd>↑</kbd> / <kbd>↓</kbd> |

En WebStorm (macOS) cambian estas: **Ir al símbolo** (*Go to Symbol*) es <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Ir a la clase** es <kbd>⌘</kbd> <kbd>O</kbd>, **Definición rápida** es <kbd>⌘</kbd> <kbd>Y</kbd>, los favoritos son <kbd>F3</kbd> y <kbd>⌘</kbd> <kbd>F3</kbd>, el método siguiente y el anterior son <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> y <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd>, **Refactorizar…** (*Refactor This…*) es <kbd>⌃</kbd> <kbd>T</kbd>, **Optimizar imports** (*Optimize Imports*) es <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Ir a la declaración del tipo** (*Go to Type Declaration*) también es <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd>, y **Reemplazar en archivos** es <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd>, solo en el código. Como <kbd>F3</kbd> marca un favorito en ese mapa, **Buscar siguiente** (*Find Next*) pasa a <kbd>⌘</kbd> <kbd>G</kbd>.

## Lista completa

**Configuración › Atajos** muestra todas las teclas del mapa elegido y las de Persisty, en palabras, en grupos como **Navegación** (*Navigation*), **Pestañas** (*Tabs*), **Archivos** (*Files*) y **Git**; las teclas de la app están en el grupo **Persisty**. La búsqueda encuentra una acción por el nombre o por las teclas en palabras, como `command shift o`, sin importar los acentos.

Los gestos aparecen escritos: **Buscar en todo** (*Search Everywhere*) como "Shift dos veces" (*Shift twice*), y **Agregar cursor arriba** (*Clone Caret Above*) como "Option dos veces y mantener + flecha arriba" (*Option twice and hold + up arrow*). Cada fila dice dónde vale la tecla, como "en el árbol, en la pestaña y en el editor" (*in the tree, in the tab, and in the editor*). Cuando una tecla de la app hace otra cosa en el código, la fila dice las dos, como en WebStorm: "En el código: Ir a la declaración · Fuera del código: Barra de proyectos" (*In the code: Go to Declaration · Outside the code: Project bar*). Las acciones sin tecla propia, como las del submenú Git y las de grupos, aparecen con el lugar donde están: el menú del árbol, el de la pestaña o la paleta.

Arriba, aparece un aviso por cada tecla del mapa o de la app que macOS usa, como <kbd>⌃</kbd> <kbd>Espacio</kbd> para cambiar de teclado, con la ruta en Ajustes del Sistema › Teclado › Atajos de teclado para desactivarla y, cuando existe, la otra tecla de la misma acción.

## Cuando una tecla no vale ahí

En el árbol de archivos y en la pestaña, una tecla del mapa cuya acción no puede correr ahí muestra el motivo en un aviso, en lugar de no hacer nada: "esta tecla no vale aquí" (*this key does not work here*), "solo en el texto de un archivo" (*only in the text of a file*), "el archivo no tiene análisis de código" (*the file has no code analysis*) o "el archivo es de solo lectura" (*the file is read-only*).

## Windows y Linux

En Windows y Linux, que están en versión preliminar, los atajos de la app usan <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>, y el dictado es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. En el código, en cualquier mapa, <kbd>Ctrl</kbd> <kbd>←</kbd> y <kbd>Ctrl</kbd> <kbd>→</kbd> avanzan de palabra en palabra, y <kbd>Home</kbd> y <kbd>End</kbd> llevan al inicio y al final de la línea. En la terminal, <kbd>Ctrl</kbd> <kbd>←</kbd> y <kbd>Ctrl</kbd> <kbd>→</kbd> quedan para el shell. En los mapas del editor, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>; mira [Mapa de teclas](/docs/editor#mapa-de-teclas). En los mapas WebStorm, **Pegar del historial** (*Paste from History*) es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>V</kbd>, y **Nuevo archivo borrador** (*New Scratch File*), <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>Insert</kbd>. En el árbol, en los mapas WebStorm, eliminar es <kbd>Delete</kbd> o <kbd>Alt</kbd> <kbd>Delete</kbd>, y cambiar de grupo no tiene tecla.

En el código, en los mapas WebStorm, <kbd>Ctrl</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>N</kbd> y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> cambian de sentido como en Mac. <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd> inserta en línea, con el servidor, y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> es **Reemplazar en archivos**, en lugar de una sesión nueva con el agente por defecto y de **Restaurar todo** (*Restore all*). El panel inferior usa <kbd>Alt</kbd> <kbd>3</kbd> y <kbd>Alt</kbd> <kbd>6</kbd>, que dejan <kbd>Ctrl</kbd> <kbd>3</kbd> y <kbd>Ctrl</kbd> <kbd>6</kbd> para los proyectos. En el mapa de VS Code, con el servidor, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd> abre la estructura del archivo, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> abre **Refactorizar…** y, en Linux, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> reformatea. **Buscar en todo** es <kbd>Shift</kbd> dos veces, y agregar un cursor con el gesto usa <kbd>Ctrl</kbd> dos veces.
