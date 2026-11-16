---
title: Problemas y limitaciones
description: Situaciones conocidas, qué hacer en cada una y lo que Persisty todavía no hace.
group: reference
order: 2
---

## El estado del agente aparece como desconocido

Claude Code muestra el aviso de confianza de la carpeta antes de cualquier hook. Responde en la terminal y el estado aparece.

Persisty todavía no lee el estado de Codex. No escribe el `~/.codex/hooks.json` ni muestra qué poner en él, así que la sesión de Codex queda como **Inactivo** (*Idle*), el encabezado de la cola dice **Estado del agente desconocido** (*Agent state unknown*) y la cola no le envía pedidos.

## Escribí `claude` en una terminal y la sesión no se volvió agente

Las terminales de Persisty ponen al frente del `PATH` un `claude` propio de la app, que abre tu Claude Code con los hooks de Persisty. La app actualiza ese `claude` cada vez que se abre, también en las terminales que siguieron abiertas. La sesión se vuelve agente con el primer hook, que solo llega después del aviso de confianza de la carpeta: respóndelo antes.

Si aun así nada cambia, el `claude` que escribiste no pasó por el de Persisty. Eso ocurre con un alias o una función con ese nombre en la configuración de tu shell, con la ruta completa del programa, o con un shell que no es zsh ni bash y cambia el orden del `PATH` al abrirse. `type claude` muestra cuál vale. Solo Claude Code se adopta así; un `codex` escrito a mano deja la sesión como terminal.

## La cuota aparece como no disponible

Persisty lee la cuota con la credencial que guarda Claude Code. Si venció, las barras usan los números de la propia sesión hasta que Claude Code la renueve. Las cuentas conectadas desde Persisty necesitan el ítem que Claude Code crea en el Keychain al completar el login.

## La cola no envió el pedido

La cola solo envía con Persisty abierto y con el agente esperando el próximo pedido. Los pedidos nunca van durante un trabajo ni encima de un pedido de permiso.

Si el encabezado de la sesión dice "Sin cuota", la cola está esperando a que la cuenta se renueve. Si dice "El último turno falló" (*The last turn failed*), espera hasta que un turno termine bien. En los dos casos, **Soltar la cola ahora**, arriba de la cola, deja pasar los pedidos.

Los pedidos salen en orden, y los de abajo muestran "esperando el n.º 1" (*waiting for no. 1*). Si el n.º 1 está marcado para **A partir de una hora** (*From a chosen time*) o **Cuando la ventana de 5 h se renueve** (*When the 5-hour window renews*), toda la cola espera esa hora. También espera mientras editas un pedido ("Editando el n.º 2: la cola espera"; tras 15 minutos sin tocarlo, vuelve a avanzar) y mientras un cambio de cuenta está pendiente (el pie de la sesión dice **cambia al terminar la respuesta**, *switches when the answer ends*). En una sesión de un proyecto fijado a una cuenta, nada sale mientras la sesión corre en otra cuenta, y **Soltar la cola ahora** no cambia eso. Revisa también que la cola no esté pausada.

## Lo que Persisty todavía no hace

- Cambiar la cuenta de una sesión en medio de un turno. El cambio, por la rotación o a mano desde el pie de la sesión, espera a que termine la respuesta y también lo que ella dejó corriendo en segundo plano, como subagentes y comandos.
- Integraciones con herramientas de analítica.
- Dividir la terminal en paneles lado a lado.
- Instalador firmado en Windows, y Windows y Linux probados en máquinas reales.
