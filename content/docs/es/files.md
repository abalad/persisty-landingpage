---
title: Archivos
description: El árbol de la carpeta de la sesión en el panel Código, para crear, renombrar, mover, copiar y eliminar archivos, abrirlos en otra app y copiar sus rutas.
group: code
order: 4
---

La lista **Archivos** (*Files*), a la izquierda del [editor](/docs/editor), muestra la carpeta de la sesión como árbol. Crea, renombra, mueve, copia y elimina archivos y carpetas sin salir de Persisty. El clic derecho en un elemento abre el menú de archivos; en un espacio vacío de la lista, el menú tiene **Nuevo** (*New*), **Pegar** (*Paste*) e **Historial local** (*Local History*) para la carpeta de la sesión.

## El árbol

Los archivos que git ignora aparecen atenuados, y `.git` nunca aparece. Arriba de la lista, **Nuevo archivo** (*New file*), **Nueva carpeta** (*New folder*) y **Actualizar** (*Refresh*) actúan sobre la carpeta de la sesión. La lista cambia de ancho: arrastra el divisor, o usa <kbd>←</kbd> y <kbd>→</kbd> con él en foco; un doble clic vuelve al ancho por defecto.

<kbd>⌘</kbd> + clic y <kbd>⇧</kbd> + clic seleccionan varios elementos, y <kbd>⌘</kbd> <kbd>A</kbd> selecciona todos los visibles. Con el árbol en foco, las flechas recorren los elementos, <kbd>→</kbd> y <kbd>←</kbd> abren y cierran una carpeta, <kbd>↵</kbd> abre el archivo, y escribir el comienzo de un nombre salta hasta él. <kbd>⇧</kbd> <kbd>F10</kbd>, o la tecla de menú, abre el menú del elemento en foco.

## Crear archivos y carpetas

**Nuevo**, en el menú, crea un **Archivo** (*File*) o una **Carpeta** (*Folder*) dentro de la carpeta del elemento. El mismo submenú crea archivos TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile y EditorConfig con la plantilla mínima. El nombre se escribe en el propio árbol, y un nombre que ya existe se rechaza con el motivo.

## Renombrar, mover y copiar

**Renombrar…** (*Rename…*) edita el nombre en la propia fila, y las pestañas abiertas siguen al archivo con el texto sin guardar y el deshacer. En la [pestaña del editor](/docs/tabs-and-groups#el-menú-de-la-pestaña), lo mismo está en **Renombrar archivo…** (*Rename File…*).

**Refactorizar › Mover…** (*Refactor › Move…*) y **Refactorizar › Copiar…** (*Refactor › Copy…*) eligen la carpeta de destino en una lista con búsqueda. Arrastrar elementos sobre una carpeta también los mueve, y con <kbd>⌥</kbd> presionado los copia. Mientras arrastras, el nombre del elemento sigue al puntero, la carpeta de destino queda resaltada, y una carpeta cerrada se abre si el puntero se queda sobre ella. Donde no se puede soltar, el árbol dice por qué, como "ya está aquí" (*already here*). <kbd>Esc</kbd> cancela el arrastre.

Con el árbol en foco, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> y <kbd>⌘</kbd> <kbd>V</kbd> cortan, copian y pegan archivos, también desde y hacia el Finder; **Cortar** (*Cut*), **Copiar** (*Copy*) y **Pegar** están en el menú. Pegar pone los elementos en la carpeta en la que hiciste clic, o en la carpeta del archivo en el que hiciste clic.

## Eliminar

**Eliminar…** (*Delete…*) siempre pide confirmación y manda los elementos a la Papelera. Durante 10 segundos, **Deshacer** (*Undo*) en el aviso, o <kbd>⌘</kbd> <kbd>Z</kbd> con el árbol en foco, trae todo de vuelta. Si un archivo abierto tiene cambios sin guardar, Persisty pregunta antes si los guarda o los descarta; con **Guardar automáticamente** (*Save automatically*) encendido, los guarda sin preguntar.

## Cuando el nombre ya existe

Al mover, copiar o pegar, si el nombre ya existe en el destino, Persisty pregunta una sola vez: **Renombrar** (*Rename*), **Reemplazar** (*Replace*) u **Omitir** (*Skip*). **Hacer lo mismo con los siguientes** (*Do the same for the next ones*) vale para los demás nombres repetidos de la misma operación. Reemplazar manda el elemento anterior a la Papelera, y los cambios sin guardar de un archivo abierto nunca se pierden sin que respondas.

## Copias grandes y fallos

Las copias y los movimientos grandes muestran el avance debajo del árbol y se pueden detener con **Cancelar** (*Cancel*), sin dejar nada a medias. Si una operación se detiene a mitad de camino, lo que ya pasó se queda, y el aviso dice qué elemento falló. Cuando un **Reemplazar** falla, el aviso dice qué elemento no se colocó y que la versión anterior fue a la Papelera; las pestañas cerradas para la operación vuelven al mismo grupo y a la misma posición.

## Abrir en

**Abrir en** (*Open in*), en el árbol y en la pestaña, lleva el elemento a otro lugar: **Mostrar en Finder** (*Reveal in Finder*), **Terminal en la carpeta** (*Terminal in folder*), que abre una sesión de terminal nueva en la carpeta del elemento, **Abrir con la app por defecto** (*Open with the default app*), **Abrir en el navegador** (*Open in the browser*, solo HTML, HTM y SVG), tu IDE en la línea del cursor y la [página del archivo](/docs/forges#abrir-en-la-forja) en GitHub, GitLab o Bitbucket. En una rama que nunca se envió, la página de la forja es la del commit actual.

La IDE es la que eliges en [**Configuración › Workspace › IDE por defecto**](/docs/settings#workspace) (*Settings › Workspace › Default IDE*), entre las que Persisty encuentra en la computadora; por defecto es **Ninguno** (*None*). La misma IDE abre la carpeta de la sesión desde el menú de la pestaña de la sesión, desde la paleta y desde el proyecto.

## Copiar ruta

**Copiar ruta** (*Copy path*) da la **Ruta absoluta** (*Absolute path*), la **Ruta desde el proyecto** (*Path from the project*), la **Ruta desde la raíz del repositorio** (*Path from the repository root*), el **Nombre del archivo** (*File name*), la **Referencia** (*Reference*) y el **Enlace en GitHub** (*Link on GitHub*, o GitLab, o Bitbucket), en el commit actual. La referencia es `archivo:línea`, o `archivo:inicio-fin` con líneas seleccionadas en la pestaña. Con varios elementos seleccionados, cada uno va en una línea.

## Favoritos e historial local

El submenú **Favoritos** (*Bookmarks*) tiene **Agregar a favoritos** (*Add to Bookmarks*), para los elementos seleccionados, o **Quitar de favoritos** (*Remove from Bookmarks*), cuando todos ya están ahí. Los favoritos siguen al archivo o a la carpeta cuando se renombran o se mueven, y su lista se abre con una tecla; mira [Favoritos](/docs/code-navigation#favoritos).

El submenú **Historial local** tiene **Mostrar historial** (*Show History*), que en un archivo lista las versiones guardadas y en una carpeta muestra lo que cambió en ella, con lo eliminado, y **Poner etiqueta…** (*Put Label…*). En el espacio vacío de la lista, el mismo submenú vale para toda la carpeta de la sesión. Mira [Historial local](/docs/local-history).

## Recargar del disco

**Recargar del disco** (*Reload from Disk*) lee de nuevo lo que cambió fuera del editor. En un archivo abierto con cambios sin guardar, pregunta antes, porque esos cambios se pierden. En una carpeta, vuelve a listar su contenido. Para volver a listar todo el árbol, usa **Actualizar**, arriba de la lista. **Sincronizar el árbol** (*Synchronize the Tree*), <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> en los mapas WebStorm, hace lo mismo y además revisa en el momento si los archivos abiertos cambiaron en el disco.

## Cambiar el tipo de archivo

**Cambiar tipo de archivo…** (*Change File Type…*), en el árbol, en la pestaña o en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>), lee un archivo como otro lenguaje, por ejemplo un `.env` como Shell. La elección vale para ese archivo en esta carpeta y lo sigue cuando se mueve. **Volver a automático** (*Back to automatic*) devuelve el lenguaje por la extensión.

## Ocultar archivos

En **Configuración › Archivos** (*Settings › Files*), **Ocultar archivos** (*Hide files*) lista patrones como `**/node_modules`. Lo que coincide con un patrón desaparece del árbol, de la [búsqueda](/docs/search) y de **Abrir archivo** (*Open file*). El patrón de fábrica es `**/.DS_Store`. Cada patrón tiene un interruptor para encenderlo y apagarlo y un botón para quitarlo; uno nuevo entra por **Nuevo patrón** (*New pattern*) y **Agregar** (*Add*). `.git` siempre queda oculto.

## Teclas

<kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd>, <kbd>⌘</kbd> <kbd>V</kbd>, <kbd>⌘</kbd> <kbd>Z</kbd> y <kbd>⇧</kbd> <kbd>F10</kbd> valen en el árbol en cualquier mapa de teclas. Las demás son de los dos mapas WebStorm:

| Acción | Tecla |
| --- | --- |
| Nuevo | <kbd>⌃</kbd> <kbd>N</kbd> o <kbd>⌃</kbd> <kbd>↵</kbd>; en WebStorm (macOS), <kbd>⌘</kbd> <kbd>N</kbd> o <kbd>⌃</kbd> <kbd>↵</kbd> |
| Renombrar | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mover a otra carpeta | <kbd>F6</kbd> |
| Copiar a otra carpeta | <kbd>F5</kbd> |
| Eliminar | <kbd>⌫</kbd> o <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Copiar ruta (también en la pestaña y en el código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referencia (*Copy Reference*; también en la pestaña y en el código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar el árbol | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

En el mapa de VS Code, esas acciones están en el menú. En WebStorm (macOS), <kbd>⌘</kbd> <kbd>N</kbd> abre **Nuevo** solo con el foco en el árbol; fuera de él, abre una terminal nueva. [**Configuración › Atajos**](/docs/shortcuts#archivos) (*Settings › Shortcuts*) tiene el grupo **Archivos**, con dónde vale cada tecla: en el árbol, en la pestaña o en el editor.

En Windows y Linux, que están en versión preliminar, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>, <kbd>Supr</kbd> elimina, y **Nuevo** es <kbd>Alt</kbd> <kbd>Insert</kbd>. El Finder da lugar al Explorador de archivos o al gestor de archivos.

## Plan y límites

El árbol y todas las operaciones de archivos son del plan gratis.

El árbol solo muestra y cambia lo que está dentro de la carpeta de la sesión. En Windows y Linux, pegar archivos desde y hacia el sistema y deshacer una eliminación todavía se están comprobando en uso.
