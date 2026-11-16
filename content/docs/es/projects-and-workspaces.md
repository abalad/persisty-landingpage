---
title: Proyectos y workspaces
description: Cómo organiza Persisty productos, carpetas, sesiones y agentes en una sola ventana.
group: start
order: 2
---

Persisty organiza el trabajo en tres niveles, del mayor al menor.

| Nivel | Qué es | Dónde aparece |
| --- | --- | --- |
| Proyecto | Un producto, cliente o negocio tuyo | Barra de proyectos, a la izquierda |
| Workspace | Una carpeta de ese proyecto, con o sin git | Tarjetas en la franja de abajo |
| Sesión | Una terminal: un agente o un shell | Pestañas arriba |

## Barra de proyectos

Cada proyecto es un bloque con las dos primeras letras del nombre. En **Ajustes del proyecto** (*Project settings*) puedes cambiarlas por otras iniciales, un símbolo o una imagen.

Un punto en la esquina del bloque dice cómo está el proyecto: amarillo cuando un agente terminó y te espera o pide permiso, azul cuando un agente está trabajando, verde cuando hay sesiones corriendo, y un anillo hueco cuando hay sesiones por restaurar. El punto muestra lo más urgente, y al pasar el puntero dice lo mismo en palabras, como "2 waiting for you".

Presiona <kbd>⌘</kbd> <kbd>B</kbd> para expandir la barra. Expandida, muestra el nombre y el estado de cada proyecto y la lista de **Agentes** (*Agents*), con el estado y el workspace de cada uno. El filtro alterna entre los agentes del proyecto actual y los de todos.

Cambia de proyecto con <kbd>⌘</kbd> <kbd>1</kbd> a <kbd>⌘</kbd> <kbd>9</kbd>. Para cambiar el orden, arrastra un proyecto, o usa <kbd>⌥</kbd> <kbd>↑</kbd> y <kbd>⌥</kbd> <kbd>↓</kbd> con él en foco.

Con el clic derecho en un proyecto abres **Ajustes del proyecto** (*Project settings*), con el nombre, la descripción y el ícono, o **Datos del proyecto** (*Project data*), con los números del proyecto y el gasto estimado en IA del mes.

## Archivar y eliminar proyectos

**Archivar proyecto** (*Archive project*), en **Ajustes del proyecto**, saca el proyecto de la barra lateral; las sesiones y los workspaces siguen registrados. Si hay sesiones abiertas, eliges entre **Archivar y mantener abiertas** (*Archive and keep open*) y **Terminar y archivar** (*End and archive*).

Los archivados quedan en **Proyectos archivados** (*Archived projects*), que se abre desde el contador debajo de la lista de proyectos, con la barra expandida, o desde la paleta (<kbd>⌘</kbd> <kbd>K</kbd>). Ahí, **Restaurar** (*Restore*) devuelve el proyecto a la barra, con sus workspaces y sesiones, y **Eliminar** (*Delete*) saca el proyecto de Persisty para siempre y termina las sesiones que sigan en marcha. Al eliminar, Persisty pregunta qué hacer con las carpetas: **Eliminar solo de Persisty** (*Delete from Persisty only*) deja todo en tu computadora, y **Eliminar y borrar las carpetas** (*Delete and remove the folders*) muestra cuáles van a la Papelera antes de confirmar. Una carpeta que usa otro proyecto, tu carpeta personal y la raíz del disco se quedan donde están.

## Workspaces

Cada tarjeta de la franja de abajo es una carpeta del proyecto. Cuando la carpeta es un repositorio git, la tarjeta muestra la rama y cuántos archivos cambiaron. Dentro de la tarjeta están las sesiones de ese workspace, cada una con su estado en palabras.

Para agregar otro, usa la tarjeta **Agregar workspace** (*Add workspace*), al final de la franja: acepta una carpeta de tu computadora o clona un repositorio remoto. Arrastra las tarjetas para cambiar el orden, o usa <kbd>⌥</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>→</kbd> con la tarjeta en foco. Para sacar un workspace del proyecto, usa **Quitar del proyecto** (*Remove from project*) en el panel **Detalles** (*Details*), o **Quitar workspace** (*Remove workspace*) en la pantalla de un workspace sin sesiones. Los archivos de la carpeta no cambian.

La tarjeta **Sueltas** (*Standalone*) guarda las sesiones que no pertenecen a ningún workspace. <kbd>⌘</kbd> <kbd>J</kbd> contrae la franja a íconos cuando quieres más espacio para la terminal.

## Sesiones

Las pestañas de arriba son las sesiones del workspace seleccionado. El **+** abre una terminal nueva ahí mismo; <kbd>⌘</kbd> <kbd>←</kbd> y <kbd>⌘</kbd> <kbd>→</kbd> pasan a la sesión anterior o a la siguiente. Arrastra una pestaña para cambiar el orden, o usa <kbd>⌥</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>→</kbd> con ella en foco.

El encabezado de la sesión muestra el nombre, el estado y la rama de la carpeta. La rama sigue los cambios hechos desde la terminal, y al hacer clic en ella se abre un selector con búsqueda para cambiar de rama o crear una.

## Comandos del workspace

El selector de comandos, junto a las pestañas, lista lo que Persisty encuentra en la carpeta: los scripts del `package.json` (con el gestor de paquetes que indica el lockfile), Cargo, los objetivos del Makefile, Gradle, Maven, Go, Python y Docker Compose. Solo lee los archivos; no ejecuta nada para descubrirlos. Los comandos que corres siempre y que no aparecen ahí entran por **Agregar comando…** (*Add command…*) y quedan en **Mis comandos** (*My commands*).

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> ejecuta el comando elegido, o detiene el que está corriendo, y <kbd>⌘</kbd> <kbd>E</kbd> abre y contrae la **Salida del comando** (*Command output*). Cada ejecución se vuelve una pestaña ahí, con el estado escrito: **Ejecutando** (*Running*), **Concluido** (*Done*), **Falló · código N** (*Failed · code N*), **Detenido** (*Stopped*) o **Terminado** (*Ended*). Detener un comando envía Ctrl-C como en la terminal y conserva la salida; si no se detiene en 5 segundos, se termina.
