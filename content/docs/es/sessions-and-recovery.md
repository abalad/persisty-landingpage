---
title: Volver después de un cuelgue
description: Cómo Persisty trae las sesiones de vuelta al abrirse, después de un cuelgue o de un reinicio de la computadora, y cómo dice qué no volvió.
group: start
order: 4
---

Persisty guarda lo que necesita para traer cada sesión de vuelta: la carpeta, el comando, el agente y el id de la conversación. Al abrirse, revisa ese registro sesión por sesión y decide qué hacer con cada una. Todo lo de esta página es del plan gratuito.

## Al abrir Persisty

Si el proceso de la sesión todavía existe, Persisty **reconecta** la terminal a él, con las últimas líneas del historial. En este caso no se relanza nada.

Las sesiones que se cayeron vuelven solas cuando su regla lo indica: **Relanzar si se cayó** (*Relaunch if it went down*), que es la predeterminada, y **Relanzar siempre** (*Always relaunch*). Las que tienen **Solo reconectar si está viva** (*Only reattach if alive*) esperan a que lo pidas. Si había alguna sesión para relanzar, el informe de restauración se abre solo al final.

## Reinicio o cuelgue de la computadora

Después de un reinicio, **ningún proceso sobrevive**, en ninguna app. Lo que hace Persisty es relanzar cada sesión a partir de lo que guardó sobre ella.

- Las sesiones de **Claude Code** vuelven con `claude --resume` en la misma conversación, en el mismo modo de permisos y, si Claude Code estaba trabajando en un worktree suyo que todavía existe, en ese worktree. Cuando el propio Claude Code confirma la retomada, el informe dice **Agente retomado** (*Agent resumed*).
- Las sesiones de **Codex CLI** vuelven como una terminal común en su carpeta, sin Codex: por defecto, Persisty no se entera de qué conversación retomar. El informe dice **Relanzada** (*Relaunched*), como en cualquier sesión de agente sin conversación registrada.
- Las **terminales** vuelven como un shell en la misma carpeta. El comando inicial (por ejemplo `pnpm dev`) solo se escribe cuando se crea la sesión; en un relanzamiento no se ejecuta de nuevo.

Cuando Persisty relanza un agente sin salir de la sesión, como al cambiar su cuenta, el proceso anterior todavía avisa que terminó, a veces más tarde. Ese aviso no deja la sesión nueva como terminada.

## Cuándo relanzar

Cada sesión tiene una regla, que eliges al crearla en **Nueva sesión › Más opciones › Al reabrir Persisty** (*New session › More options › When Persisty reopens*). Las terminales y los agentes abiertos directamente, sin pasar por esa ventana, quedan con la predeterminada. El panel **Detalles** (*Details*) muestra la regla de la sesión, sin permitir cambiarla.

| Regla | Qué pasa |
| --- | --- |
| Relanzar si se cayó | Relanza cuando abres Persisty. Es la opción predeterminada. |
| Solo reconectar si está viva | No relanza por su cuenta; espera a que lo pidas. |
| Relanzar siempre | Al abrir Persisty, relanza también una sesión que terminó, con error o sin él, como después de salir del agente en la terminal. |

## Restaurar todo

![Después de reiniciar la computadora, las sesiones del proyecto aparecen interrumpidas; un clic en Restaurar 4 relanza las sesiones, y el informe de restauración muestra, sesión por sesión, lo que volvió y lo que falló.](/docs-media/sessions-and-recovery/restaurar.mp4)

Para relanzar en el momento lo que quedó atrás, usa el botón **Restaurar N** (*Restore N*), junto a las pestañas, o <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> fuera del código (**Restaurar todo**, *Restore all*, en la paleta; <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> en Windows y Linux, que están en versión preliminar). En el código, en el mapa WebStorm (macOS) y, en Windows y Linux, en los dos mapas WebStorm, esa tecla es [**Reemplazar en archivos**](/docs/search#reemplazar-en-archivos) (*Replace in Files*). Relanza las sesiones que se cayeron, de todos los proyectos, incluidas las de **Solo reconectar si está viva**, y las que terminaron y tienen **Relanzar siempre**. Ejecutarlo dos veces no duplica sesiones: la que ya volvió se queda como está. El número del botón cuenta las sesiones sin proceso del proyecto actual, incluidas las que terminaron, que solo vuelven con **Relanzar siempre** o con **Reintentar** (*Try again*).

Una sesión sin proceso muestra **Sesión sin proceso.** (*Session has no process.*), con el motivo, y el botón **Reintentar**, que relanza solo esa sesión, sea cual sea su regla. Así vuelve una sesión que terminó, como después de salir del agente en la terminal.

## El informe de restauración

Toda restauración termina en un informe. Arriba, una línea dice qué encontró Persisty al abrirse: cuántas sesiones reconectó, cuántas ya habían terminado y cuántas se interrumpieron, sin proceso. Después viene el resumen, con cuántas volvieron, cuántas fallaron y cuántas se omitieron, y una línea por sesión: **Reconectada** (*Reattached*), **Relanzada**, **Agente retomado**, **Omitida** (*Skipped*) o **Falló** (*Failed*), con el motivo cuando lo hay, como **falta la carpeta de trabajo** (*working folder missing*) cuando la carpeta de la sesión ya no existe.

El informe se abre solo cuando Persisty relanza tus sesiones al abrirse, y después de **Restaurar todo**. **Informe de restauración** (*Restore report*), en la paleta (<kbd>⌘</kbd> <kbd>K</kbd>), abre de nuevo el último.

Persisty nunca dice que una sesión volvió si no volvió. **Agente retomado (retomada no confirmada)** (*Agent resumed (resume not confirmed)*) solo quiere decir que el comando de retomada se ejecutó. En un proyecto fijado a una cuenta de Claude ([Pro](/docs/pro)), una sesión cuya cuenta no está conectada queda detenida, y el informe dice qué cuenta falta.

## Historial de la terminal

Al reconectar, las últimas 5 000 líneas por encima de la pantalla aparecen en la terminal antes del contenido en vivo. Cada sesión guarda hasta 20 000 líneas. Con la sesión abierta, la terminal guarda para volver atrás tantas líneas como indica **Líneas de historial** (*History lines*), en [Configuración › Terminal](/docs/settings#terminal): 5 000 al principio, de 1 000 a 50 000.
