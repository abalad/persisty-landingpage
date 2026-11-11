---
title: Funciones Pro
description: Cola de pedidos, puntos de restauración, verificación al terminar y carpeta propia por sesión.
group: work
order: 2
---

Las funciones Pro están en la **barra del borde derecho de la sesión** (**Cola** y **Puntos de restauración**) y en su encabezado. Requieren la cuenta de Persisty con el plan Pro; lo que ya se guardó se puede seguir usando si el plan termina. Las cuentas de Claude, con rotación, cambio desde el pie y cuenta por proyecto, están en [Cuentas de IA y rotación](/docs/ai-accounts).

## Cola de pedidos

La cola funciona como un chat. Escribe el próximo pedido ahora y elige cuándo va al agente:

- **en cuanto el agente quede libre**;
- **cuando la ventana de 5 h se renueve**, con la hora leída de la cuota en vivo de la cuenta de la propia sesión;
- **a partir de una hora**.

El encabezado de la cola dice qué está haciendo el agente. Los próximos pedidos aparecen numerados, en el orden en que van a salir, con cuándo sale cada uno y por qué esperan los de abajo. Puedes arrastrar para reordenar (o <kbd>⌥</kbd> <kbd>↑</kbd> y <kbd>⌥</kbd> <kbd>↓</kbd>), editar un pedido que todavía no salió (la cola espera mientras editas), enviar uno a continuación y sacarlo de la cola. **Pausar cola** (*Pause queue*) retiene todo, también con la app reabierta. Los enviados quedan plegados abajo.

La caja de texto acepta imágenes: <kbd>⌘</kbd> <kbd>V</kbd>, arrastrar o el clip, hasta 8 por pedido y 10 MB cada una (PNG, JPEG, GIF o WebP). Se quedan en esta computadora, y el agente recibe sus rutas al final del pedido.

Los pedidos van de a uno, en el orden de la cola, y solo cuando el agente espera el próximo pedido; nunca en medio de un trabajo ni encima de un pedido de permiso. Cada pedido va tal como se escribió, en un solo pegado. Cuando la cuenta se queda sin cuota, la cola espera a que la ventana se renueve; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba-pro).

La cola se revisa cada 10 segundos con Persisty abierto. Con la app cerrada, no se envía nada. En el plan gratis, los pedidos que ya están en la cola se pueden pausar, reordenar, enviar a continuación o sacar.

## Puntos de restauración

Cada pedido a un agente guarda el estado de la carpeta de la sesión antes de que el agente empiece, con la primera línea del pedido como nombre. En la pestaña **Puntos de restauración** (*Restore points*) ves qué volvería y qué se borraría antes de confirmar. Restaurar guarda el estado actual como un punto nuevo, para que puedas deshacerlo.

- Funciona en carpetas git y con agentes que avisan el pedido por hook (Claude Code).
- Guarda los archivos rastreados y los nuevos; lo que ignora el `.gitignore` queda fuera.
- La rama, el HEAD y el índice de git no cambian; los commits que hizo el agente no se deshacen.
- Los puntos quedan como commits en `refs/persist/checkpoints/`, que un `git push` común no envía. Son 50 por sesión.

## Verificar al terminar

Elige un comando del workspace (por ejemplo `pnpm test`) en **Verificar al terminar con…** (*Check on finish with…*). Cuando el agente se detiene después de cambiar archivos, el comando corre solo en la carpeta de la sesión, y el encabezado dice si pasó, si falló (con el código de salida) o si todavía está corriendo.

Vale para sesiones de agente dentro de un workspace. El resultado no se envía al agente.

## Carpeta propia por sesión

En carpetas git, la sesión nueva puede recibir una rama `persist/<nombre>` en una carpeta solo suya (un git worktree), para que dos agentes nunca editen los mismos archivos.

- La carpeta queda en `~/.persist/worktrees` y no trae lo que git ignora (`node_modules`, `.env`, builds).
- Al cerrar la sesión, Persisty pregunta si la carpeta se queda, se elimina o se elimina descartando los archivos sin commit, y dice cuántos commits guarda la rama.
- La rama nunca se borra.
