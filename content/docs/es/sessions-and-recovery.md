---
title: Sesiones y recuperación
description: Cómo Persisty trae las sesiones de vuelta después de un cuelgue o de un reinicio, y cómo dice qué no volvió.
group: start
order: 3
---

Persisty guarda lo que necesita para traer cada sesión de vuelta: carpeta, comando, agente y el id de la conversación. Al abrirse, revisa ese registro sesión por sesión y decide qué hacer con cada una.

## Al abrir Persisty

Si la sesión todavía está corriendo, Persisty **reconecta** la terminal, con las últimas líneas del historial. En este caso no se relanza nada.

## Reinicio o cuelgue de la computadora

Después de un reinicio, **ningún proceso sobrevive**, en ninguna app. Lo que hace Persisty es relanzar cada sesión a partir de lo que guardó sobre ella: carpeta, comando, agente y el id de la conversación.

- Las sesiones de **Claude Code** vuelven con `claude --resume` en la misma conversación, en el mismo modo de permisos y, si Claude Code estaba trabajando en un worktree suyo que todavía existe, en ese worktree. Cuando el propio Claude Code confirma la retomada, el informe dice **Agente retomado** (*Agent resumed*).
- Las sesiones de **Codex CLI** vuelven como una terminal común en su carpeta, sin Codex: Persisty no sabe qué conversación retomar. El informe dice **Relanzada** (*Relaunched*).
- Las **terminales** vuelven como un shell en la misma carpeta. El comando inicial (por ejemplo `pnpm dev`) solo se escribe cuando se crea la sesión; en un relanzamiento no se ejecuta de nuevo.

## Cuándo relanzar

Cada sesión tiene una regla, que eliges al crearla en **Nueva sesión › Más opciones › Al reabrir Persisty** (*New session › More options › When Persisty reopens*). Las terminales y los agentes abiertos directamente, sin pasar por ese diálogo, quedan con la predeterminada. El panel **Detalles** (*Details*) muestra la regla de la sesión, sin permitir cambiarla.

| Regla | Qué pasa |
| --- | --- |
| Relanzar si se cayó (*Relaunch if it went down*) | Relanza cuando abres Persisty. Es la opción predeterminada. |
| Solo reconectar si está viva (*Only reattach if alive*) | No relanza por su cuenta; espera a que lo pidas. |
| Relanzar siempre (*Always relaunch*) | Al abrir Persisty, relanza también una sesión que terminó, con error o sin él, incluso si la detuviste con **Detener** (*Stop*). |

Para relanzar en el momento lo que quedó atrás, usa el botón **Restaurar N** (*Restore N*), junto a las pestañas, o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (**Restaurar todo**, *Restore all*, en la paleta). Relanza las sesiones que se cayeron, de todos los proyectos, incluidas las de **Solo reconectar si está viva**, y las que terminaron y tienen **Relanzar siempre**. Ejecutarlo dos veces no duplica sesiones.

Una sesión sin proceso muestra **Sesión sin proceso.** (*Session has no process.*), con el motivo, y el botón **Reintentar** (*Try again*), que relanza solo esa sesión, sea cual sea su regla. Así vuelve una sesión que terminó o que detuviste.

## El informe de restauración

Toda restauración termina en un informe. Arriba, una línea dice qué encontró Persisty al abrirse: cuántas sesiones reconectó, cuántas terminaron con la app cerrada y cuántas se interrumpieron, sin proceso. Después viene el resumen, con cuántas volvieron, cuántas fallaron y cuántas se omitieron, y una línea por sesión: **Reconectada** (*Reattached*), **Relanzada** (*Relaunched*), **Agente retomado** (*Agent resumed*), **Omitida** (*Skipped*) o **Falló** (*Failed*), con el motivo cuando lo hay. El informe se abre solo cuando Persisty relanza tus sesiones al abrirse, y después de **Restaurar todo**. **Informe de restauración** (*Restore report*), en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>), abre de nuevo el último.

Persisty nunca dice que una sesión volvió si no volvió. **Agente retomado (retomada no confirmada)** (*Agent resumed (resume not confirmed)*) solo quiere decir que el comando de retomada se ejecutó.

## Historial de la terminal

Al reconectar, las últimas 5 000 líneas por encima de la pantalla aparecen en la terminal antes del contenido en vivo. Cada sesión guarda hasta 20 000 líneas.
