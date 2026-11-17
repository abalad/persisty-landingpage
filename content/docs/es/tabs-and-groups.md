---
title: Pestañas y grupos
description: Las pestañas del editor, cómo cambiar, cerrar, fijar y reordenarlas, y el editor dividido en hasta cuatro grupos lado a lado o apilados.
group: code
order: 3
---

Cada archivo abierto en el [editor](/docs/editor) tiene una pestaña. El editor se puede dividir en hasta cuatro grupos, lado a lado o apilados, cada uno con sus pestañas, y el mismo archivo puede estar abierto en más de un grupo.

## El menú de la pestaña

El clic derecho en una pestaña, o <kbd>⇧</kbd> <kbd>F10</kbd> con la pestaña en foco, abre su menú. Ahí están todas las formas de cerrar, **Copiar ruta** (*Copy path*), las divisiones del editor, **Fijar pestaña** (*Pin Tab*), **Configurar las pestañas** (*Configure Tabs*), **Maximizar el editor** (*Maximize the editor*), **Cambiar tipo de archivo…** (*Change File Type…*), **Abrir en** (*Open in*), el submenú [**Git**](/docs/git-in-the-editor#el-submenú-git), **Renombrar archivo…** (*Rename File…*) y **Recargar del disco** (*Reload from Disk*). Un elemento que no vale para esa pestaña queda atenuado y dice por qué, como "es la única pestaña" (*it is the only tab*). Las pestañas de diff y de historial de Git solo tienen las formas de cerrar.

## Cambiar de pestaña

<kbd>⌃</kbd> <kbd>Tab</kbd>, **Alternar entre pestañas** (*Switcher*), abre la lista de las pestañas abiertas, de las usadas hace poco a las más antiguas. Vale en cualquier mapa de teclas, también con el foco en la terminal. Con <kbd>⌃</kbd> presionado, <kbd>Tab</kbd> y <kbd>⇧</kbd> <kbd>Tab</kbd> recorren la lista; soltar <kbd>⌃</kbd> abre la pestaña, y <kbd>Esc</kbd> cancela.

Para ir a la pestaña siguiente o a la anterior, usa <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>]</kbd> y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>[</kbd> en Mac, o las teclas del mapa: <kbd>⌃</kbd> <kbd>→</kbd> y <kbd>⌃</kbd> <kbd>←</kbd> en los mapas WebStorm (por defecto, macOS usa esas dos para cambiar de escritorio), <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>→</kbd> y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>←</kbd> en VS Code. **Reabrir pestaña cerrada** (*Reopen Closed Tab*) trae de vuelta la última pestaña cerrada: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> en el mapa de VS Code, y desde la paleta (<kbd>⌘</kbd> <kbd>K</kbd>) en los demás.

## Cerrar pestañas

La **×** de la pestaña la cierra. En el panel **Código** (*Code*), fuera del texto, <kbd>⌘</kbd> <kbd>W</kbd> cierra la pestaña del editor en cualquier mapa, y nunca la ventana. Dentro del texto, <kbd>⌘</kbd> <kbd>W</kbd> cierra la pestaña en los mapas WebStorm (macOS) y VS Code; en WebStorm, ahí, amplía la selección, y cerrar la pestaña es <kbd>⌘</kbd> <kbd>F4</kbd>.

El menú de la pestaña tiene **Cerrar** (*Close*), **Cerrar las demás pestañas** (*Close Other Tabs*), **Cerrar todas las pestañas** (*Close All Tabs*), **Cerrar las no modificadas** (*Close Unmodified Tabs*), **Cerrar las pestañas a la izquierda** (*Close Tabs to the Left*) y **Cerrar las pestañas a la derecha** (*Close Tabs to the Right*). Solo las pestañas con cambios sin guardar piden confirmación, en una sola pregunta: **Guardar todas** (*Save all*) o **Descartar todas** (*Discard all*). Con [Guardar automáticamente](/docs/editor#guardar-automáticamente) encendido, se guardan sin preguntar.

Si, al guardar, una pestaña choca con un archivo que cambió en el disco, solo esa pestaña queda abierta, con el aviso de conflicto, y las demás se cierran. Un aviso dice qué pestañas quedaron.

## Fijar una pestaña

**Fijar pestaña**, en el menú de la pestaña, la pone a la izquierda, con un alfiler. Una pestaña fijada no se cierra con **Cerrar las demás pestañas**, **Cerrar todas las pestañas** ni por el límite de pestañas. El mismo elemento, marcado, la desfija.

## Cambiar el orden

Arrastra una pestaña para cambiar el orden o para llevarla a otro grupo. Soltarla en el borde derecho o de abajo de un grupo crea un grupo nuevo con la pestaña. <kbd>Esc</kbd> cancela el arrastre.

Con el teclado, con la pestaña en foco, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> la cambian de lugar, en cualquier mapa; las fijadas quedan siempre antes de las demás. **Mover la pestaña al siguiente grupo** (*Move Tab to Next Group*) está en la paleta.

## Dividir el editor

**Dividir a la derecha** (*Split Right*) y **Dividir abajo** (*Split Down*), en el menú de la pestaña y en la paleta, abren el mismo archivo en un grupo nuevo. **Dividir y mover a la derecha** (*Split and Move Right*) y **Dividir y mover abajo** (*Split and Move Down*) llevan la pestaña al grupo nuevo. Son hasta cuatro grupos; sin espacio en el panel, el elemento dice que maximices el editor. El divisor entre dos grupos se arrastra, o se mueve con las flechas cuando está en foco.

En el [árbol](/docs/files), **Abrir a la derecha** (*Open on the Right*) abre el archivo en un grupo a la derecha. **Cerrar el grupo** (*Close Group*) y las acciones que enfocan el grupo de la izquierda, de la derecha, de arriba o de abajo están en la paleta.

El mismo archivo en dos grupos mantiene el texto sincronizado, y cada lado tiene su deshacer. Solo uno de ellos habla con el servidor del lenguaje: el otro queda sin sugerencias ni errores, y la barra de estado dice "en el otro grupo" (*in the other group*).

## Maximizar

**Maximizar el editor**, en el botón de la barra de las pestañas, en el menú de la pestaña y en la paleta, oculta la terminal para que quepa más código. El mismo botón, cuya sugerencia pasa a ser **Volver al tamaño de antes** (*Back to the size it was*), o el mismo comando, devuelve la división de antes.

## Opciones de las pestañas

En [**Configuración › Editor › Pestañas**](/docs/settings#editor) (*Settings › Editor › Tabs*), el **Límite de pestañas** (*Tab limit*) viene en 20, y puede ser 10, 30, 50 o **Sin límite** (*No limit*). Abrir una pestaña más cierra la menos usada; las fijadas y las sin guardar se quedan, y bajar el límite no cierra nada en el momento. **Al cerrar, ir a** (*On close, go to*) elige entre **La pestaña usada antes** (*The tab used before*), por defecto, y **La pestaña vecina** (*The neighbour tab*). **Abrir pestaña nueva** (*Open new tab*) pone la pestaña **Al final** (*At the end*), por defecto, o **Justo después de la actual** (*Right after the current one*). **Mostrar la carpeta en nombres repetidos** (*Show the folder for repeated names*) viene encendido, y **Marcar pestañas sin guardar** (*Mark unsaved tabs*) usa un **Punto** (*Dot*) o el **Nombre en cursiva** (*Name in italics*).

La **Pestaña de vista previa** (*Preview tab*) viene apagada. Encendida, el clic en el árbol abre una pestaña que el siguiente clic reemplaza; editarla, o hacer doble clic en la pestaña, la conserva. **Configurar las pestañas**, en el menú de la pestaña, lleva directo a esa pantalla.

## Teclas

<kbd>⌃</kbd> <kbd>Tab</kbd>, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valen en cualquier mapa. Estas son de los dos mapas WebStorm:

| Acción | Tecla |
| --- | --- |
| Maximizar el editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Grupo siguiente y grupo anterior (*Next Group*, *Previous Group*) | <kbd>⌥</kbd> <kbd>Tab</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir a la derecha (en el árbol) | <kbd>⇧</kbd> <kbd>↵</kbd> |

En el mapa de VS Code, esas acciones están en la paleta y en el menú de la pestaña. En Windows y Linux, que están en versión preliminar, mover la pestaña es <kbd>Alt</kbd> <kbd>⇧</kbd> con las flechas, maximizar es <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>F12</kbd>, y cambiar de grupo está en la paleta.

## Plan y límites

Las pestañas y los grupos son del plan gratis.

Son cuatro grupos como máximo. Las pestañas de diff y de historial de Git no se fijan.
