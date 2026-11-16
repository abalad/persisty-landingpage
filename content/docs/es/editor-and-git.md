---
title: Editor, cambios y notas
description: El editor junto a la terminal, con el árbol de archivos, sugerencias y errores del proyecto, la pestaña de cambios de git, la búsqueda en el proyecto y las notas.
group: work
order: 3
---

Las herramientas de la sesión quedan en una barra fina en su borde derecho: **Código**, **Búsqueda** y **Notas** arriba, después **Cambios**, **Puntos de restauración** y **Cola**, y al final **Detalles**. Un clic abre el panel de esa herramienta junto a la barra, y el mismo clic lo cierra; <kbd>⌘</kbd> <kbd>&#92;</kbd> también lo abre y lo cierra. Con el panel cerrado, Cambios muestra cuántos archivos cambiaron y la Cola cuántos pedidos esperan. El divisor entre la terminal y el panel se puede arrastrar.

## Código

El editor abre la carpeta de la sesión como árbol. Los archivos que git ignora aparecen atenuados. La lista de Archivos cambia de ancho: arrastra el divisor, o usa las flechas con él en foco; un doble clic vuelve al ancho por defecto. El árbol crea, renombra, mueve, copia y borra archivos; mira [Archivos](#archivos).

- <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> busca en todos los archivos, <kbd>⌘</kbd> <kbd>F</kbd> busca y reemplaza en el archivo abierto y <kbd>⌘</kbd> <kbd>S</kbd> guarda. Para abrir un archivo por nombre, usa <kbd>⌘</kbd> <kbd>P</kbd> fuera del código, o la tecla de tu mapa dentro de él (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> en WebStorm).
- Resaltado por lenguaje, cargado bajo demanda, con el tema de la terminal.
- Marcas de git en el margen y diff contra el HEAD. Quién cambió cada línea y el historial del archivo están en [Git en el archivo](#git-en-el-archivo).
- Si el archivo cambia en el disco (el agente lo editó), Persisty avisa: recargar o mantener tu versión. Las pestañas sin cambios se recargan solas.
- Las imágenes se abren en el editor (PNG, JPG, GIF, WebP, BMP e ICO), ajustadas al panel, con sus dimensiones y su tamaño; un clic las muestra en tamaño real. Un SVG se abre como código y gana la vista previa, como el Markdown (el botón del ojo, o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd>), dibujada como imagen y sin ejecutar scripts.

Otros archivos binarios y los archivos de más de 5 MB no se abren.

## Archivos

El clic derecho en un archivo o una carpeta abre el menú de archivos; con el árbol en foco, <kbd>⇧</kbd> <kbd>F10</kbd> también lo abre. <kbd>⌘</kbd> + clic y <kbd>⇧</kbd> + clic seleccionan varios elementos, las flechas recorren el árbol y <kbd>↵</kbd> abre el archivo.

**Nuevo** (*New*) crea un archivo o una carpeta. Los archivos TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile y EditorConfig nacen con la plantilla mínima. **Renombrar** (*Rename*) edita el nombre en la propia fila, y las pestañas abiertas siguen al archivo con el texto sin guardar y el deshacer. **Mover a…** (*Move to…*) y **Copiar a…** (*Copy to…*) eligen la carpeta en una lista con búsqueda. Arrastrar un elemento sobre una carpeta también lo mueve, y con <kbd>⌥</kbd> lo copia. Con el árbol en foco, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> y <kbd>⌘</kbd> <kbd>V</kbd> cortan, copian y pegan archivos, también desde y hacia el Finder.

**Eliminar** (*Delete*) siempre pide confirmación y manda a la Papelera. Durante 10 segundos, **Deshacer** (*Undo*) en el aviso o <kbd>⌘</kbd> <kbd>Z</kbd> trae el archivo de vuelta. Cuando el nombre ya existe en el destino, Persisty pregunta una sola vez: renombrar, reemplazar (el anterior va a la Papelera) u omitir, y puede hacer lo mismo con los siguientes. Un archivo con cambios sin guardar nunca se reemplaza sin que lo confirmes. Las copias grandes muestran el avance y se pueden cancelar sin dejar nada a medias. Si mover o copiar se detiene a mitad de camino, lo que ya pasó se queda, y el aviso dice qué elemento falló.

**Abrir en** (*Open in*) lleva el archivo al Finder, a una terminal en su carpeta, a la app por defecto, al navegador, a tu IDE en la línea actual o a su página en GitHub, GitLab o Bitbucket. La IDE es la que eliges en **Configuración › Workspace › IDE por defecto** (*Settings › Workspace › Default IDE*). **Copiar ruta** (*Copy Path*) da la ruta absoluta, la ruta desde el proyecto o desde la raíz del repositorio, el nombre, la referencia `archivo:línea` y el enlace del archivo en la forja. **Recargar del disco** (*Reload from Disk*) lee de nuevo lo que cambió fuera del editor. **Cambiar tipo de archivo** (*Change File Type*) lee un archivo como otro lenguaje, por ejemplo un `.env` como Shell, y la elección sigue al archivo cuando se mueve.

El clic derecho en una pestaña del editor tiene todas las formas de cerrar: la pestaña, las otras, todas, las no modificadas, y las que están a la izquierda o a la derecha. Solo las pestañas con cambios sin guardar piden confirmación, en una sola pregunta. El mismo menú renombra el archivo, cambia su tipo, copia su ruta, lo abre en otro lugar y lo recarga del disco.

En los mapas WebStorm, las teclas son las de la IDE: <kbd>⇧</kbd> <kbd>F6</kbd> renombra, <kbd>F6</kbd> mueve, <kbd>F5</kbd> copia a otra carpeta, <kbd>⌫</kbd> elimina, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copia la ruta, <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copia la referencia y <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> sincroniza el árbol con la carpeta. En el mapa de VS Code, esas acciones están en el menú. **Configuración › Atajos** tiene el grupo **Archivos** (*Files*), con dónde vale cada tecla: en el árbol, en la pestaña o en el editor.

En Windows y Linux, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>, y <kbd>Supr</kbd> elimina. Pegar archivos desde y hacia el sistema y deshacer una eliminación todavía se están comprobando en uso en esas plataformas.

## Pestañas y grupos

El editor se divide en hasta cuatro grupos, lado a lado o apilados, cada uno con sus pestañas. **Dividir a la derecha** (*Split Right*) y **Dividir abajo** (*Split Down*) están en el clic derecho de la pestaña y en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>). Arrastrar una pestaña cambia el orden, la lleva a otro grupo o, soltada en el borde de un grupo, crea uno nuevo. El mismo archivo puede quedar abierto en dos grupos: el texto se mantiene al día y cada lado tiene su deshacer, pero solo uno de ellos muestra las sugerencias y los errores del servidor del lenguaje. **Maximizar el editor** (*Maximize the editor*) oculta la terminal para que quepa más, y el mismo comando vuelve al tamaño anterior.

**Fijar pestaña** (*Pin Tab*), en el clic derecho de la pestaña, la pone a la izquierda, con un alfiler. Una pestaña fijada no se cierra con **Cerrar las demás pestañas** (*Close Other Tabs*), **Cerrar todas las pestañas** (*Close All Tabs*) ni por el límite de pestañas. Con la pestaña en foco, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> la cambian de lugar, y **Mover la pestaña al siguiente grupo** (*Move Tab to Next Group*) está en la paleta.

En **Configuración › Editor › Pestañas** (*Settings › Editor › Tabs*), elige el límite de pestañas (20 por defecto; abrir una más cierra la menos usada, y las fijadas y las sin guardar se quedan), adónde ir al cerrar (la pestaña usada antes o la vecina), dónde abrir la pestaña nueva (al final o justo después de la actual), si la carpeta aparece en nombres repetidos y cómo marcar la pestaña sin guardar (un punto o el nombre en cursiva). La **Pestaña de vista previa** (*Preview tab*), apagada por defecto, hace que el clic en el árbol abra una pestaña que el siguiente clic reemplaza; editar, o hacer doble clic en la pestaña, la conserva. **Configurar las pestañas** (*Configure Tabs*), en el clic derecho de la pestaña, lleva directo a esa pantalla.

En los mapas WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> maximiza el editor, <kbd>⌥</kbd> <kbd>Tab</kbd> y <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> van al grupo siguiente y al anterior, y <kbd>⇧</kbd> <kbd>↵</kbd> en el árbol abre el archivo a la derecha. En el mapa de VS Code, esas acciones están en la paleta y en el menú de la pestaña. En Windows y Linux, mover la pestaña es <kbd>Alt</kbd> <kbd>⇧</kbd> con las flechas, maximizar es <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>F12</kbd>, y cambiar de grupo está en la paleta.

## Git en el archivo

Al final de la línea del cursor, tras un instante sin moverte, el editor muestra quién cambió la línea, cuándo y con qué mensaje. Al pasar el puntero se abre la tarjeta del commit, con **Copiar hash** (*Copy hash*), **Mostrar el commit** (*Show the commit*) y **Abrir en la forja** (*Open on the forge*); con el teclado, usa **Mostrar la tarjeta del commit de la línea** (*Show the line's commit card*) en la paleta. En **Configuración › Editor**, **Autor de la línea (git blame)** (*Line author (git blame)*) lo apaga, elige qué aparece (autor, fecha, mensaje) y cuánto esperar.

**Anotar con git blame** (*Annotate with Git Blame*) pone en el margen el autor y la fecha de cada línea, con el color según la edad del commit. El menú de la anotación muestra el diff del commit, anota la revisión anterior o cierra la anotación. Los archivos de más de 20 mil líneas no se anotan.

El submenú **Git**, en el clic derecho del árbol y de la pestaña, tiene **Mostrar diff** (*Show Diff*), **Mostrar historial** (*Show History*), **Mostrar historial de la selección** (*Show History for Selection*, con las líneas seleccionadas en el código), **Comparar con rama…** (*Compare with Branch…*), **Comparar con commit…** (*Compare with Commit…*), **Preparar** (*Stage*), **Quitar de la preparación** (*Unstage*), **Descartar cambios** (*Discard Changes*) y **Anotar con git blame**. Los diffs y el historial se abren en pestañas de solo lectura. Todas estas acciones están también en la paleta.

**Descartar cambios** pregunta antes y graba un punto de restauración, "Antes de descartar cambios" (*Before discarding changes*). Para recuperar el archivo, usa el panel **Puntos de restauración**; eso vale también en el plan gratis.

## Sugerencias, documentación y errores

En TypeScript, JavaScript y Rust, el editor habla con el servidor del lenguaje. Las sugerencias vienen del proyecto, con el tipo y la documentación de cada una, y elegir una función de otro archivo ya escribe el `import`. Dejar el puntero sobre un nombre muestra su documentación, abrir el `(` de una llamada muestra los parámetros, y los errores aparecen subrayados. En Rust, los errores de `cargo check` se actualizan cada vez que guardas.

Cuando el servidor del lenguaje no está en la computadora, la app lo descarga sola. La barra de estado muestra su estado (descargando, indexando, listo o detenido) y cuántos errores y avisos tiene el archivo; un clic ahí reinicia el servidor o muestra el log.

Ir a la definición funciona también en otro archivo. Una definición en la biblioteca estándar o en una dependencia fuera del proyecto se abre como solo lectura, con un candado en la pestaña y "Fuera del proyecto · solo lectura" en la barra de estado: puedes navegar y leer, pero nada se edita. En Rust, la biblioteca estándar necesita su código fuente en tu toolchain (`rustup component add rust-src`); la app nunca cambia el toolchain por su cuenta.

## Mapa de teclas

En **Configuración › Editor › Mapa de teclas**, elige **WebStorm** (por defecto), **WebStorm (macOS)** o **VS Code**. El mapa vale dentro del código; sus teclas de pestañas y de buscar acción valen en toda la app. Cada tecla hace la acción de verdad, y cuando la acción no aplica ahí, la tecla pasa a la app. **Configuración › Atajos** lista todas las teclas del mapa elegido y las de Persisty, con búsqueda.

En WebStorm (por defecto):

| Acción | Tecla |
| --- | --- |
| Ir a la definición | <kbd>⌘</kbd> <kbd>B</kbd> o <kbd>⌘</kbd> + clic |
| Parámetros de la llamada | <kbd>⌘</kbd> <kbd>P</kbd> |
| Documentación | <kbd>⌃</kbd> <kbd>J</kbd> |
| Retroceder y avanzar por los lugares visitados | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> y <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Error siguiente y anterior | <kbd>F2</kbd> y <kbd>⇧</kbd> <kbd>F2</kbd> |
| Abrir archivo por nombre | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| Duplicar la línea | <kbd>⌘</kbd> <kbd>D</kbd> |
| Borrar la línea | <kbd>⌘</kbd> <kbd>Y</kbd> |
| Ir a una línea | <kbd>⌘</kbd> <kbd>G</kbd> |
| Inicio y final del bloque | <kbd>⌘</kbd> <kbd>[</kbd> y <kbd>⌘</kbd> <kbd>]</kbd> |
| Mover la instrucción, con los comentarios encima | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Buscar acción | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

El mapa de VS Code mantiene sus propias teclas, como <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> para buscar una acción y <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> para reabrir la última pestaña cerrada. En todos los mapas, <kbd>⌃</kbd> <kbd>Tab</kbd> abre el selector de pestañas, en el orden en que las usaste, y <kbd>⌘</kbd> <kbd>K</kbd> también lista las acciones del editor. En Windows y Linux, las mismas acciones usan <kbd>Ctrl</kbd>.

## Cambios

La pestaña **Cambios** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>) muestra los archivos cambiados con las letras de estado de git, y un clic muestra el diff; **Abrir en el editor** (*Open in editor*) lleva al archivo. Prepara o quita por archivo o todo, escribe el mensaje y haz el commit con <kbd>⌘</kbd> <kbd>↵</kbd>, o usa **Commit y enviar**. Sin nada preparado, **Commit de todo** (*Commit all*) prepara todos los cambios y hace el commit. En **Más acciones de commit** (*More commit actions*), **Corregir el último commit** (*Amend last commit*) junta lo preparado al último commit, y **Deshacer el último commit** (*Undo last commit*) lo quita y devuelve sus cambios, preparados, con el mensaje en la caja. Si ese commit ya se envió, Persisty avisa que el próximo envío tendrá que ser forzado.

El clic derecho en un archivo descarta sus cambios, con un punto de restauración antes, como en el editor. El mismo menú ignora el archivo, la carpeta o todo lo que tenga el mismo nombre (Persisty escribe en el `.gitignore`), copia la ruta y lo muestra en el Finder.

El panel muestra si la rama está al día con el remoto y ofrece traer o enviar lo que falta, **Publicar rama** (*Publish branch*) cuando todavía no existe allí y **Buscar del remoto** (*Fetch from the remote*). En **Más acciones de sincronización** (*More sync actions*) están **Traer con rebase** (*Pull with rebase*), **Traer con merge** (*Pull with merge*) y **Envío forzado** (*Force push*), que solo reemplaza el remoto si nadie envió nada desde la última búsqueda. Cuando los dos lados tienen commits nuevos, Persisty pregunta cómo unirlos: merge o rebase.

Durante un merge, rebase, cherry-pick o revert, el panel muestra la operación y los archivos en conflicto. En cada uno, elige **Aceptar la versión actual** (*Accept the current version*) o **Aceptar la versión entrante** (*Accept the incoming version*), o edítalo y usa **Marcar como resuelto** (*Mark as resolved*). Después, **Continuar** (*Continue*) termina, y **Abortar** (*Abort*) deja todo como estaba antes de empezar.

El historial muestra lo que todavía no se envió y los archivos de cada commit. Si git pide una contraseña para enviar, Persisty muestra el rechazo tal como git lo escribió.

## Notas

Cada proyecto tiene notas en Markdown, guardadas solas en la base de datos local de Persisty. Las notas mantienen las teclas de antes, sin mapa.
