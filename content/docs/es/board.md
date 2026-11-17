---
title: Tablero
description: Las sesiones de agente de todos los proyectos en cuatro columnas, para ver quién te espera, desde hace cuánto y qué quiere.
group: agents
order: 2
---

Con varias sesiones en marcha, el Tablero responde quién te está esperando, desde hace cuánto y qué quiere. Muestra las sesiones de agente de todos los proyectos en cuatro columnas, y un clic en una tarjeta abre la sesión.

![El Tablero con las sesiones de todos los proyectos en cuatro columnas: la tecla A abre la que lleva más tiempo esperando, y ⌘⇧O vuelve al Tablero.](/changelog/0.10.0/quadro.mp4)

## Abrir el Tablero

Ábrelo con el botón junto a las pestañas, con <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> o con **Tablero de sesiones** (*Session board*) en la paleta de comandos (<kbd>⌘</kbd> <kbd>K</kbd>). El Tablero ocupa el lugar de la terminal. Para volver, usa **Volver a la terminal** (*Back to the terminal*), <kbd>Esc</kbd> o la misma tecla.

Arriba, cambia **Todos los proyectos** (*All projects*) por **Este proyecto** (*This project*) para ver solo las sesiones del proyecto actual. Al lado hay tres cuentas: cuántas sesiones te necesitan, con la espera más larga; cuántas están trabajando; y cuántas respuestas todavía no leíste. Un clic en la primera abre la sesión que lleva más tiempo esperando.

## Las columnas

**Te necesita** (*Needs you*) reúne los pedidos de permiso, las preguntas del agente y las respuestas que terminan en pregunta, de la espera más antigua a la más nueva. Un permiso que aprobaste en la propia terminal sale de la columna solo en pocos segundos.

**Trabajando** (*Working*) dice qué hace cada agente ahora, como "Editando" (*Editing*) o "Ejecutando" (*Running*), seguido del archivo o del comando. **Respondió** (*Answered*) muestra el final de la última respuesta; las sesiones que solo esperan su próximo pedido, sin nada nuevo que leer, quedan plegadas abajo, en un grupo como **3 sesiones inactivas** (*3 idle sessions*). **Error** muestra turnos que fallaron, como "Límite de uso alcanzado" (*Usage limit reached*), y procesos que se detuvieron con un error.

## Las tarjetas

Cada tarjeta dice en una línea qué quiere la sesión: el comando que espera permiso, la pregunta que hizo el agente, el final de la respuesta o el error. Junto al nombre aparece desde hace cuánto. Debajo, el proyecto, o el workspace en **Este proyecto**, y la rama, cuando no es la principal.

Las respuestas y los errores que todavía no abriste aparecen en negrita, con un punto. La sesión que lleva más tiempo esperando recibe el marco ámbar y la pista <kbd>A</kbd> **abre esta** (*opens this one*). Una sesión de la que Persisty todavía no tiene noticias, como un Claude Code detenido en el aviso de confianza de la carpeta, dice **Sin noticias del agente** (*No word from the agent*).

## Teclas

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> abre y cierra el Tablero. Con él abierto, <kbd>A</kbd> abre la sesión que lleva más tiempo esperando y <kbd>Esc</kbd> vuelve a la terminal. Esas dos no hacen nada mientras escribes en un campo o con una ventana abierta encima.

En Windows y Linux, el atajo es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>. Con el mapa de teclas **WebStorm (macOS)**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> con el cursor en el código abre un archivo por nombre; ahí, usa el botón.

## Plan y límites

El Tablero es del plan gratis. Solo abre sesiones: nunca responde a un permiso o a una pregunta por ti, y la respuesta se sigue dando en la terminal de la sesión.

Las sesiones interrumpidas, como las que quedan así después de reiniciar la computadora, y las conversaciones terminadas quedan fuera del Tablero; mira [Volver después de un cuelgue](/docs/sessions-and-recovery).
