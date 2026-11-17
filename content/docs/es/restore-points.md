---
title: Puntos de restauración
description: Cada pedido al agente guarda el estado de la carpeta antes de que empiece, y descartar cambios también; mira qué cambiaría y vuelve a cualquier punto.
group: agents
order: 8
---

Un punto de restauración es el estado de los archivos de la carpeta de la sesión en un momento. Persisty graba uno antes de cada pedido al agente y otro antes de que descartes cambios, y te deja volver a cualquiera. Los puntos están en **Puntos de restauración** (*Restore points*), en la barra del borde derecho de la sesión.

## Qué se graba

Cada pedido a Claude Code graba el estado de la carpeta antes de que el agente empiece, con la primera línea del pedido como nombre. Si nada cambió desde el último punto, no se graba uno nuevo, y eso vale también para los puntos de antes de restaurar y de antes de descartar. La lista muestra los puntos del más nuevo al más antiguo, cada uno con hace cuánto se grabó.

Un punto guarda los archivos rastreados y los nuevos; lo que ignora el `.gitignore` queda fuera. Queda como un commit en `refs/persist/checkpoints/`, que un `git push` común no envía. La rama, el HEAD y el índice de git no cambian.

## Restaurar

Haz clic en un punto para ver qué cambia al restaurar: cuántos archivos vuelven y cuántos creados después se borran, con la lista. **Restaurar este punto** (*Restore this point*) pide confirmación y deja los archivos como estaban antes de ese pedido. Si el agente está trabajando en la carpeta, la confirmación avisa que lo detengas antes, porque puede reescribir archivos durante la restauración.

Restaurar guarda antes el estado actual como un punto nuevo, **Antes de restaurar** (*Before restoring*), para que puedas deshacerlo. Solo vuelven los archivos de la carpeta: los commits que hizo el agente se quedan en la rama.

## Antes de descartar

Descartar cambios, en el panel [**Cambios**](/docs/changes#preparar-y-descartar) (*Changes*) o en el submenú [**Git**](/docs/git-in-the-editor#el-submenú-git) del árbol y de la pestaña del editor, guarda antes un punto llamado **Antes de descartar cambios** (*Before discarding changes*). Si ese punto no se puede grabar, no se descarta nada. Para deshacer un descarte, restaura ese punto.

## Plan y límites

Grabar un punto en cada pedido es [Pro](/docs/pro). El punto antes de descartar se graba en cualquier plan, y la lista muestra y restaura los puntos guardados en cualquier plan, también cuando el Pro termina.

Los puntos solo existen en carpetas git. Los puntos por pedido dependen del hook de Claude Code que avisa el pedido; por defecto, Codex CLI no graba ninguno. Son 50 por sesión, y los más antiguos salen primero. Cerrar la sesión borra sus puntos.
