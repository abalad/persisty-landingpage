---
title: Notificaciones
description: Cuándo y cómo Persisty te avisa que un agente terminó o pide permiso, con una alerta en la app, la notificación del sistema y un sonido.
group: agents
order: 4
---

Cuando un agente termina su turno o pide permiso, Persisty te avisa, a menos que ya estés mirando esa sesión. El aviso puede ser una alerta en la esquina de la ventana, la notificación del sistema y un sonido corto.

## Cuándo avisa Persisty

Con la ventana de Persisty en foco, aparece una alerta en la esquina con el nombre de la sesión, **Terminó y te espera** (*Finished and waiting for you*) o **Pide permiso** (*Asks for permission*), y el botón **Ver** (*View*), que abre la sesión. La alerta desaparece sola después de 10 segundos, y se muestran como máximo tres a la vez. Con otra ventana delante, llega la notificación del sistema. Las dos vienen con dos tonos cortos y bajos. Si la sesión ya está delante de ti, con Persisty en foco, no aparece nada.

Una respuesta que dejó trabajo en segundo plano solo avisa cuando ese trabajo acaba; mira [Trabajo en segundo plano](/docs/agents#trabajo-en-segundo-plano). Por el mismo camino llegan los avisos de cuota: cuando una cuenta se queda sin cuota, con cuántas sesiones esperan, y cuando cada sesión retoma su tarea; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba).

## Configurar

En [**Configuración › Notificaciones**](/docs/settings#notificaciones) (*Settings › Notifications*) hay tres interruptores, todos encendidos al principio. **Alertas dentro de la app** (*In-app alerts*) enciende la alerta de la esquina, y **Reproducir sonido** (*Play a sound*) enciende los dos tonos. **Silenciar con Persisty en foco** (*Mute while Persisty is focused*) deja fuera la notificación del sistema mientras la ventana está en foco; apagado, recibes la alerta y la notificación a la vez.

## Enviar una prueba

**Enviar prueba** (*Send a test*), en la misma pantalla, dispara la alerta, el sonido y la notificación del sistema a la vez, sin mirar el foco ni el silencio, para que veas cómo se ven.

Si la notificación del sistema no aparece, revisa que Persisty esté permitido en los ajustes de notificaciones del sistema. Cuando el sistema avisa que las bloqueó, la pantalla muestra **Bloqueadas en el sistema** (*Blocked by the system*); permite a Persisty ahí y envía la prueba de nuevo. El sistema no siempre lo avisa, por eso la pista de dónde mirar queda siempre en la pantalla.

## Plan y límites

Las notificaciones son del plan gratis y llegan con Persisty abierto. Dependen de los hooks de Claude Code: por defecto, Codex CLI no envía su estado a Persisty y no genera avisos.
