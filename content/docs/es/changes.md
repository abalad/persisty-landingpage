---
title: Cambios y commits
description: El panel Cambios de la sesión, para preparar, ver el diff, hacer commits, sincronizar con el remoto, cambiar de rama, guardar cambios y resolver conflictos.
group: code
order: 8
---

El panel **Cambios** (*Changes*) es el git de la carpeta de la sesión, como el control de versiones de una IDE. Se abre con el ícono **Cambios**, en la barra de herramientas del borde derecho de la sesión, o con <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>. El ícono muestra cuántos archivos cambiaron, también con el panel cerrado.

## Preparar y descartar

La lista muestra los archivos en **Preparados** (*Staged*) y en **Cambios**, con la letra de estado de git: M (modificado), A (nuevo), D (borrado), R (renombrado), U (sin seguimiento) o C (en conflicto). El **+** de un archivo lo prepara, y el **−** lo quita de la preparación; en el título de cada grupo, **Preparar todo** (*Stage all*) y **Quitar todo de la preparación** (*Unstage all*) hacen lo mismo con todos.

El **↺** descarta los cambios de un archivo, y **Descartar todos los cambios** (*Discard all changes*), en el título del grupo, los de todos. Persisty pregunta antes y graba un [punto de restauración](/docs/restore-points#antes-de-descartar), como en el [editor](/docs/git-in-the-editor#descartar-cambios). Un archivo nuevo descartado se borra.

El clic derecho en un archivo, o <kbd>⇧</kbd> <kbd>F10</kbd> con él en foco, ofrece **Abrir archivo** (*Open file*), **Preparar** (*Stage*) o **Quitar de la preparación** (*Unstage*), **Descartar cambios** (*Discard changes*), **Copiar ruta** (*Copy path*), **Copiar ruta relativa** (*Copy relative path*) y **Mostrar en Finder** (*Reveal in Finder*). En un archivo sin seguimiento, el menú también tiene **Ignorar este archivo** (*Ignore this file*), o **Ignorar esta carpeta** (*Ignore this folder*), e **Ignorar todo lo llamado** (*Ignore everything named*) con su nombre; Persisty escribe la regla en el `.gitignore` de la raíz del repositorio.

## Ver el diff

Un clic en un archivo muestra su diff junto a la lista, sobre el texto actual, con las líneas quitadas en rojo y las agregadas en verde. En un archivo todavía sin preparar, **Abrir en el editor** (*Open in editor*) lleva al archivo. Lo mismo vale para los archivos de un commit del historial y de un grupo de cambios guardados.

## Hacer el commit

Escribe el mensaje en la caja y haz el commit con <kbd>⌘</kbd> <kbd>↵</kbd> o con el botón **Commit**. Sin nada preparado, el botón pasa a **Commit de todo** (*Commit all*), que prepara todos los cambios y hace el commit.

**Más acciones de commit** (*More commit actions*), en la flecha junto al botón, tiene **Commit y enviar** (*Commit and push*), **Corregir el último commit** (*Amend last commit*), que junta lo preparado al último commit (con el mensaje vacío, conserva el suyo), y **Deshacer el último commit** (*Undo last commit*), que quita el commit y devuelve sus cambios, preparados, con el mensaje en la caja. Si ese commit ya se envió, Persisty avisa antes que el próximo envío tendrá que ser forzado.

## Historial

**Historial** (*History*) lista los últimos 30 commits de la rama, cada uno con el mensaje, el hash corto, el autor y hace cuánto; los que todavía no se enviaron tienen el punto relleno y la pista **No enviado** (*Not pushed*). Un clic abre los archivos del commit, y un clic en un archivo muestra su diff. El clic derecho en un commit, o su **⋯**, ofrece **Copiar SHA** (*Copy SHA*), **Copiar mensaje** (*Copy message*), **Crear rama desde aquí** (*Create branch from here*) y **Revertir commit** (*Revert commit*); en el más reciente, también **Deshacer el último commit**.

**Mostrar el commit** (*Show the commit*), en la tarjeta del [autor de la línea](/docs/git-in-the-editor#autor-de-la-línea), abre el commit aquí, aunque sea más antiguo que los 30 de la lista.

## Sincronizar con el remoto

En una rama con remoto, la parte de arriba del panel muestra su nombre y cómo está respecto al remoto: **Al día** (*Up to date*), ↓ con los commits por traer y ↑ con los commits por enviar. Un clic en la flecha trae o envía. Si los dos lados tienen commits nuevos, Persisty pregunta cómo unirlos: **Merge: un commit de unión** (*Merge: a joining commit*) o **Rebase: mis commits encima** (*Rebase: my commits on top*). Una rama que todavía no está en el remoto muestra **Publicar rama** (*Publish branch*), que envía la rama y pasa a seguirla.

**Buscar del remoto** (*Fetch from the remote*) trae las novedades en el momento. **Más acciones de sincronización** (*More sync actions*) tiene **Traer con rebase** (*Pull with rebase*), **Traer con merge** (*Pull with merge*) y **Envío forzado** (*Force push*), que pregunta antes y solo reemplaza el remoto si nadie envió nada desde la última búsqueda.

El encabezado de la sesión muestra las mismas flechas junto al nombre de la rama. Con la app a la vista, Persisty busca las novedades del remoto por su cuenta cada 5 minutos, salvo que alguien haya buscado hace menos de 3.

## Ramas

Un clic en la rama, en el encabezado de la sesión, abre **Buscar o crear rama** (*Find or create a branch*): las **Locales** (*Local*), las **Remotas** (*Remote*) y, cuando el nombre que escribes no existe, **Crear rama** (*Create branch*) con él. La lista avisa cuando hay cambios sin commit que van con la rama y cuando el agente está trabajando en esa carpeta. La rama del encabezado sigue los cambios hechos desde la terminal.

En el panel, el grupo **Ramas** (*Branches*) lista las locales, con la actual marcada y las flechas respecto al remoto, y las que están **Solo en el remoto** (*Only on the remote*). Un clic cambia de rama, y **Nueva rama** (*New branch*) crea una desde donde estás. El clic derecho en una rama ofrece **Cambiar a esta** (*Switch to it*), **Fusionar en** (*Merge into*) la rama actual, **Renombrar** (*Rename*) y **Eliminar** (*Delete*). Eliminar pregunta antes; si la rama tiene commits que no están en otra, Persisty pregunta de nuevo, con **Eliminar de todos modos** (*Delete anyway*). La rama eliminada sigue en el remoto, si está ahí.

## Guardar cambios

El grupo **Guardados** (*Stashed*) es el stash de git. **Guardar cambios** (*Stash changes*) guarda todos los cambios, archivos nuevos incluidos, con un nombre si quieres, y deja la carpeta limpia. Un clic en un elemento muestra sus archivos. El clic derecho tiene **Aplicar** (*Apply*), **Aplicar y quitar** (*Apply and remove*) y **Descartar** (*Discard*), que pregunta antes.

## Conflictos

Durante un merge, rebase, cherry-pick o revert, el panel muestra la operación, como **Merge en curso** (*Merge in progress*), y los archivos en **Conflictos** (*Conflicts*). En cada archivo, elige **Aceptar la versión actual** (*Accept the current version*) o **Aceptar la versión entrante** (*Accept the incoming version*), o edítalo y usa **Marcar como resuelto** (*Mark as resolved*). Sin conflictos, **Continuar** (*Continue*) termina la operación, y **Abortar** (*Abort*) pregunta antes y deja todo como estaba antes de empezar.

## Teclas

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> abre y cierra el panel, <kbd>⌘</kbd> <kbd>↵</kbd> hace el commit y <kbd>⇧</kbd> <kbd>F10</kbd> abre el menú del archivo en foco. Con el cursor en el código, en los mapas WebStorm (macOS) y VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> es **Buscar anterior** (*Find Previous*) después de una búsqueda en el archivo; ahí, usa el ícono **Cambios**. En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>.

## Plan y límites

El panel **Cambios** es del plan gratis, incluido el punto de restauración antes de descartar.

Funciona en carpetas que son repositorios git; fuera de uno, dice "Esta carpeta no está en un repositorio git." (*This folder is not in a git repository.*). Persisty usa las credenciales que git ya tiene en la computadora, como el Llavero y el agente SSH, y nunca pide una contraseña en la terminal: si git necesita preguntar, el rechazo aparece tal como git lo escribió. Con demasiados cambios, la lista avisa que es parcial.
