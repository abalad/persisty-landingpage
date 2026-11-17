---
title: Problemas y limitaciones
description: Situaciones conocidas, qué hacer en cada una, qué cambia en Windows y Linux y lo que Persisty todavía no hace.
group: reference
order: 3
---

Situaciones conocidas y qué hacer en cada una. Al final, qué cambia en Windows y Linux, que están en versión preliminar, y lo que Persisty todavía no hace.

## El estado del agente aparece como desconocido

Claude Code muestra el aviso de confianza de la carpeta antes de cualquier hook. Responde en la terminal y el estado aparece; mira [Claude Code](/docs/agents#claude-code).

Persisty todavía no lee el estado de Codex. No escribe el `~/.codex/hooks.json` ni muestra qué poner en él, así que la sesión de Codex queda como **Inactivo** (*Idle*), el encabezado de la cola dice **Estado del agente desconocido** (*Agent state unknown*) y la cola no le envía pedidos; mira [Codex CLI](/docs/agents#codex-cli).

## Escribí `claude` en una terminal y la sesión no se volvió agente

Las terminales de Persisty ponen al frente del `PATH` un `claude` propio de la app, que abre tu Claude Code con los hooks de Persisty. La app actualiza ese `claude` cada vez que se abre, también en las terminales que siguieron abiertas. La sesión se vuelve agente con el primer hook, que solo llega después del aviso de confianza de la carpeta: respóndelo antes.

Si aun así nada cambia, el `claude` que escribiste no pasó por el de Persisty. Eso ocurre con un alias o una función con ese nombre en la configuración de tu shell, con la ruta completa del programa, o con un shell que no es zsh ni bash y cambia el orden del `PATH` al abrirse. `type claude` muestra cuál vale. Solo Claude Code se adopta así; un `codex` escrito a mano deja la sesión como terminal.

## La cuota aparece como no disponible

Persisty lee la cuota con la credencial que guarda Claude Code. Si venció, las barras usan los números de la propia sesión hasta que Claude Code la renueve. Las cuentas conectadas desde Persisty necesitan el ítem que Claude Code crea en el Keychain al completar el login; mira [Cuentas conectadas](/docs/ai-accounts#cuentas-conectadas).

## La cola no envió el pedido

La cola solo envía con Persisty abierto y con el agente esperando el próximo pedido. Los pedidos nunca van durante un trabajo ni encima de un pedido de permiso.

Si el encabezado de la sesión dice "Sin cuota", la cola está esperando a que la cuenta se renueve. Si dice "El último turno falló" (*The last turn failed*), espera hasta que un turno termine bien. En los dos casos, **Soltar la cola ahora**, arriba de la cola, deja pasar los pedidos; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba).

Los pedidos salen en orden, y los de abajo muestran "esperando el n.º 1" (*waiting for no. 1*). Si el n.º 1 está marcado para **A partir de una hora** (*From a chosen time*) o **Cuando la ventana de 5 h se renueve** (*When the 5-hour window renews*), toda la cola espera esa hora. También espera mientras editas un pedido ("Editando el n.º 2: la cola espera"; tras 15 minutos sin tocarlo, vuelve a avanzar) y mientras un cambio de cuenta está pendiente (el pie de la sesión dice **cambia al terminar la respuesta**, *switches when the answer ends*). En una sesión de un proyecto fijado a una cuenta, nada sale mientras la sesión corre en otra cuenta, y **Soltar la cola ahora** no cambia eso. Revisa también que la cola no esté pausada. Más en [Cuándo sale cada pedido](/docs/queue#cuándo-sale-cada-pedido).

## Windows y Linux

Windows y Linux están en versión preliminar: la app sale sin firma y todavía no se probó en máquinas reales. Para las teclas, mira [Atajos de teclado](/docs/shortcuts#windows-y-linux), y para actualizar, [Actualizaciones](/docs/updates#windows-y-linux).

En Windows, los agentes no necesitan un shell POSIX: los hooks de Claude Code llaman a un ejecutable nativo de Persisty.

En Windows y Linux, la barra superior empieza en el borde de la ventana, sin el espacio que macOS reserva para los botones de la ventana, y los botones de la barra de proyectos y de la búsqueda quedan en la esquina. Si la tuya muestra un espacio vacío a la izquierda, actualiza Persisty: la corrección llegó en la 0.9.2.

En Windows, con la pantalla escalada al 125% o al 150%, la terminal de las sesiones podía quedar con más columnas de las que la sesión conocía: las líneas empezaban del lado derecho y quedaban pedazos de pantallas viejas. Desde la 0.9.4, la terminal y la sesión tienen siempre el mismo tamaño; si el texto se desordena, actualiza Persisty.

**Agregar workspace** (*Add workspace*) acepta la carpeta elegida en Windows, como `C:\...`, y una **Nueva sesión** (*New session*) en un workspace de Windows se abre con normalidad desde la 0.9.1.

Todavía se están revisando en uso real: en Windows y Linux, pegar archivos desde y hacia el sistema y el **Deshacer** (*Undo*) de la eliminación; en Windows, el **Deshacer** de la Papelera de reciclaje y los avisos de archivo en uso. La mascota fuera de la app existe solo en macOS.

## Lo que Persisty todavía no hace

- Cambiar la cuenta de una sesión en medio de un turno. El cambio, por la rotación o a mano desde el pie de la sesión, espera a que termine la respuesta y también lo que ella dejó corriendo en segundo plano, como subagentes y comandos; mira [Cambiar la cuenta de una sesión](/docs/ai-accounts#cambiar-la-cuenta-de-una-sesión).
- Integraciones con herramientas de analítica.
- Dividir la terminal en paneles lado a lado.
- Instalador firmado en Windows, y Windows y Linux probados en máquinas reales.
