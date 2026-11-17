---
title: Comandos del workspace
description: Los comandos que Persisty encuentra en la carpeta del workspace y los tuyos, para ejecutarlos con una tecla y ver la salida de cada uno en una pestaña debajo de la terminal.
group: code
order: 8
---

Cada workspace tiene sus comandos, como `pnpm dev` o `cargo test`, en un selector junto a las pestañas de las sesiones. Un comando corre en una terminal aparte, en la carpeta del workspace, y su salida queda en una pestaña debajo de la terminal de la sesión.

## Elegir el comando

El selector muestra el nombre del comando elegido, o **Sin comandos** (*No commands*). Un clic abre la lista de lo que Persisty encuentra en la raíz de la carpeta: los scripts del `package.json` (con pnpm, yarn, bun o npm, según el lockfile), Cargo, los objetivos del Makefile, Gradle, Maven, Go, Python (el `manage.py` de Django o `pytest`) y Docker Compose. Solo lee los archivos; no ejecuta nada para descubrirlos.

Los comandos que no aparecen ahí entran por **Agregar comando…** (*Add command…*): escribe el **Comando** (*Command*) y, si quieres, un **Nombre** (*Name*); vacío, el nombre es el propio comando. Quedan en **Mis comandos** (*My commands*), y la papelera junto a cada uno lo quita.

## Ejecutar

El botón de reproducir junto al selector, o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd>, ejecuta el comando elegido y abre la salida. Mientras corre, el mismo botón y la misma tecla lo detienen.

Junto al selector, el estado aparece escrito: **Ejecutando** (*Running*), **Concluido** (*Done*), **Falló · código N** (*Failed · code N*), **Detenido** (*Stopped*) o **Terminado** (*Ended*). Un clic en él abre o contrae la salida.

## La salida del comando

La **Salida del comando** (*Command output*) queda debajo de la terminal de la sesión, con una pestaña por comando ejecutado y un punto con el estado de cada uno. <kbd>⌘</kbd> <kbd>E</kbd>, o la flecha de la esquina, abre y contrae la salida; contraída, sigue mostrando las pestañas.

Mientras el comando corre, su pestaña muestra la terminal del comando, en vivo. Cuando termina, la pestaña muestra sus últimas 400 líneas, con **Ejecutar de nuevo** (*Run again*). Ejecutar el mismo comando otra vez reemplaza la pestaña anterior por la nueva, y la **×** de una pestaña terminada la cierra.

## Detener

**Detener** (*Stop*) envía Ctrl-C al comando, como en la terminal, y conserva la salida. Si no se detiene en 5 segundos, se termina, y lo que escribió hasta ahí queda guardado. Un comando que detuviste aparece como **Detenido**, nunca como **Falló**.

## Plan y límites

Los comandos del workspace son del plan gratis. **Verificar al terminar con** (*Check on finish with*) y el nombre del comando, en el mismo selector, es [Pro](/docs/pro); mira [Verificar al terminar](/docs/verify).

Persisty solo busca comandos en la raíz de la carpeta del workspace, no en subcarpetas. En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>.
