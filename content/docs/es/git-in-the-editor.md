---
title: Git en el editor
description: El Git de cada archivo dentro del editor, con marcas en el margen, el autor de cada línea, la anotación de git blame, diffs e historial, y el submenú Git del árbol y de la pestaña.
group: code
order: 4
---

El [editor](/docs/editor) muestra el Git del archivo abierto sin que salgas de él: qué cambió desde el último commit, quién cambió cada línea y el historial del archivo. Para hacer commits, enviar y cambiar de rama, usa el panel [Cambios](/docs/changes).

## Marcas en el margen

En un archivo de un repositorio, el margen marca las líneas agregadas, cambiadas y borradas desde el último commit, y las marcas se actualizan mientras escribes. El botón **Diferencias desde el último commit** (*Changes since the last commit*), en la barra de las pestañas, muestra en el propio editor el diff del archivo contra el HEAD. En un archivo que no está en el último commit, como un archivo nuevo o fuera de un repositorio, el botón queda atenuado, y la barra de estado dice **fuera de git** (*not in git*).

## Autor de la línea

Al final de la línea del cursor, tras un instante sin moverte, el editor muestra quién cambió la línea, cuándo y con qué mensaje, como "Ana, hace 3 d • Corrige la zona horaria" (*Ana, 3 d ago • Fix the time zone*). Después de 7 días, aparecen la fecha y la hora del commit. Una línea que todavía no tiene commit dice "Tú • sin commit" (*You • not committed*). Al pasar el puntero se abre la tarjeta del commit, con **Copiar hash** (*Copy hash*), **Mostrar el commit** (*Show the commit*), que abre el commit en el [historial de Cambios](/docs/changes#historial), y [**Abrir en la forja**](/docs/forges#abrir-en-la-forja) (*Open on the forge*), que abre el archivo en ese commit, en la misma línea, en GitHub, GitLab o Bitbucket. Con el teclado, usa **Mostrar la tarjeta del commit de la línea** (*Show the line's commit card*), en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>).

En [**Configuración › Editor › Autor de la línea (git blame)**](/docs/settings#editor) (*Settings › Editor › Line author (git blame)*), **Mostrar el autor al final de la línea** (*Show the author at the end of the line*) viene encendido. Mientras está encendido, **Autor** (*Author*), **Fecha** (*Date*) y **Mensaje** (*Message*) eligen qué aparece, y **Retraso** (*Delay*), de 300 a 2000 ms, cuánto tiempo sin moverte antes de que aparezca; por defecto son 600 ms.

## Anotar con git blame

**Anotar con git blame** (*Annotate with Git Blame*), en el submenú **Git** o en la paleta, pone en el margen el autor y la fecha de cada línea, con el color según la edad del commit. Un clic en la anotación resalta las líneas del mismo commit y abre su tarjeta, y el clic derecho ofrece **Mostrar el diff del commit** (*Show the commit's diff*), **Anotar la revisión anterior** (*Annotate the previous revision*), **Copiar hash** y **Cerrar la anotación** (*Close the annotation*). Los archivos de más de 20 mil líneas no se anotan.

## El submenú Git

El clic derecho en el [árbol](/docs/files) y en la [pestaña](/docs/tabs-and-groups#el-menú-de-la-pestaña) tiene el submenú **Git**: **Mostrar diff** (*Show Diff*), **Mostrar historial** (*Show History*), **Mostrar historial de la selección** (*Show History for Selection*), **Comparar con rama…** (*Compare with Branch…*), **Comparar con commit…** (*Compare with Commit…*), **Preparar** (*Stage*), **Quitar de la preparación** (*Unstage*), **Descartar cambios** (*Discard Changes*) y **Anotar con git blame**. Todas están también en la paleta.

**Mostrar historial de la selección** usa las líneas seleccionadas en el código, por eso vale en la pestaña y en la paleta, no en el árbol. **Preparar**, **Quitar de la preparación** y **Descartar cambios** aceptan varios archivos y carpetas; las demás, un solo archivo. Un elemento que no vale para lo que elegiste queda atenuado y dice por qué, como "archivo no versionado" (*file not under version control*) o "sin cambios" (*no changes*).

## Diffs e historial en pestañas

Los diffs y el historial se abren en pestañas de solo lectura, junto a las pestañas de los archivos. Un diff contra el archivo abierto sigue el texto que todavía no guardaste, y el título de la pestaña dice "sin guardar" (*unsaved*) cuando es el caso.

**Mostrar historial** lista los commits que cambiaron el archivo, del más nuevo al más antiguo, y el diff del commit elegido aparece debajo; las flechas recorren la lista. **Mostrar en el panel** (*Show in the panel*) abre el commit en [Cambios](/docs/changes), y **Copiar hash** copia su hash. **Comparar con rama…** y **Comparar con commit…** abren una lista con búsqueda para elegir el otro lado.

## Descartar cambios

**Descartar cambios** pregunta antes y graba un punto de restauración, **Antes de descartar cambios** (*Before discarding changes*). El texto que escribiste en una pestaña abierta se guarda primero, para que el punto lo conserve también. Para recuperar el archivo, usa el panel [Puntos de restauración](/docs/restore-points#antes-de-descartar).

## Plan y límites

Todo lo de esta página es del plan gratis, incluido el punto de restauración antes de descartar.

Estas funciones solo aparecen en carpetas que son repositorios git. Nada de esto va a internet, salvo **Abrir en la forja**, que abre el navegador. Los archivos de más de 20 mil líneas no se anotan, y una anotación que tarda demasiado se interrumpe.
