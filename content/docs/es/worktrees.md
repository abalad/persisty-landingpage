---
title: Carpeta propia
description: Una sesión en una rama y en una carpeta solo suya, un git worktree, para que dos agentes nunca editen los mismos archivos.
group: agents
order: 9
---

En carpetas git, una sesión nueva puede recibir una rama `persist/<nombre>` en una carpeta solo suya, un git worktree. Así dos agentes trabajan en el mismo repositorio sin editar nunca los mismos archivos.

## Crear la carpeta

![En Nueva sesión, con el nombre Pagamento Pix y la Carpeta propia (worktree) activada, aparece la rama nueva persist/pagamento-pix; Crear y abrir abre la sesión en la carpeta nueva, con la marca worktree en el encabezado.](/docs-media/worktrees/pasta-propria.mp4)

En [**Nueva sesión**](/docs/sessions#nueva-sesión) (*New session*), con una carpeta git, activa **Carpeta propia (worktree)** (*Own folder (worktree)*). La pista muestra la rama nueva y desde dónde parte, como "New branch persist/pagamento-pix from main, in a folder for this session only." El nombre sale del nombre de la sesión, en minúsculas y sin acentos, y recibe un número si ya existe; cámbialo en **Rama nueva** (*New branch*). La rama parte de lo que está en uso en la carpeta ahora.

La sesión se abre en la carpeta nueva, en la misma subcarpeta que elegiste, y el encabezado muestra la marca `worktree`; al pasar el puntero se ven la carpeta y la rama. Vale para cualquier sesión, de agente o de terminal. La carpeta nueva solo trae lo que está en el commit de partida: los cambios sin commit y lo que git ignora, como `node_modules`, `.env` y builds, se quedan en la carpeta original.

## Dónde quedan

Las carpetas quedan en `~/.persist/worktrees`, agrupadas en una carpeta por repositorio. Para usar otra, haz clic en **Elegir…** (*Choose…*) en [**Configuración › Workspace › Carpeta de los worktrees**](/docs/settings#workspace) (*Settings › Workspace › Worktrees folder*); **Usar la predeterminada** (*Use the default*) vuelve a la de siempre. El cambio vale para worktrees nuevos, y los que ya existen se quedan donde están.

## Cerrar la sesión

Al cerrar una sesión con carpeta propia, Persisty dice cuántos archivos sin commit tiene la carpeta y cuántos commits tiene la rama que su base no tiene. Elige **Mantener la carpeta** (*Keep the folder*), que deja la carpeta en el disco para que la abras después como workspace, o **Eliminar la carpeta** (*Remove the folder*). Con archivos sin commit, eliminar pasa a ser **Descartar y eliminar** (*Discard and remove*). Si git se niega a eliminar la carpeta, la sesión queda detenida y Persisty muestra el motivo.

La rama se queda en el repositorio en todos los casos: Persisty nunca borra la rama.

## Plan y límites

La carpeta propia es [Pro](/docs/pro); sin él, la opción aparece desactivada, con la marca **Pro**. Solo existe en carpetas git.
