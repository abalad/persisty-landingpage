---
title: Cola de pedidos
description: Escribe ahora el próximo pedido al agente y elige cuándo va, en cuanto el agente quede libre, cuando la ventana de 5 h se renueve o a partir de una hora.
group: agents
order: 7
---

La cola guarda los próximos pedidos a un agente y los entrega de a uno, cuando llega la hora y el agente está libre. Está en **Cola de pedidos** (*Request queue*), en la barra del borde derecho de la sesión, y funciona como un chat: lo que sale primero está arriba, y la caja de texto, abajo.

## Poner un pedido en la cola

![En la Cola de pedidos, con tres pedidos en Próximos, el nuevo queda para cuando se renueve la ventana de 5 h; Command y Enter lo ponen en la cola, en cuarto lugar.](/docs-media/queue/fila.mp4)

Escribe el pedido en la caja, elige cuándo sale y haz clic en **Poner en la cola** (*Queue it*), o usa <kbd>⌘</kbd> <kbd>↵</kbd>. En Windows y Linux, que están en versión preliminar, las teclas de esta página usan <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd> y <kbd>Alt</kbd> en lugar de <kbd>⌥</kbd>.

El encabezado de la cola dice qué está haciendo el agente, como **Trabajando** (*Working*), **Terminó, listo para el siguiente** (*Done, ready for the next one*) o **Pidiendo permiso** (*Asking for permission*). Los pedidos que esperan aparecen numerados en **Próximos** (*Up next*), en el orden en que van a salir, con cuándo sale cada uno y por qué esperan los de abajo, como "esperando el n.º 1" (*waiting for no. 1*). El primero tiene la marca **próximo** (*next*). Los enviados quedan plegados abajo, en **Enviados** (*Sent*). En la barra de la sesión, el ícono de la cola muestra cuántos pedidos esperan, también con el panel cerrado.

## Cuándo sale cada pedido

Junto a la caja, elige cuándo va el pedido: **En cuanto el agente quede libre** (*As soon as the agent is free*), **Cuando la ventana de 5 h se renueve** (*When the 5-hour window renews*) o **A partir de una hora** (*From a chosen time*), que tú marcas. La [ventana de 5 h](/docs/usage-and-quota#ventanas-de-5-h-y-7-d) usa la hora leída de la cuota en vivo de la cuenta de la propia sesión; mientras esa hora no se conoce, la opción queda desactivada.

La hora marcada es solo lo más temprano: el pedido igual espera a que el agente quede libre y a que salgan los pedidos de arriba.

## Cambiar el orden y editar

Arrastra un pedido por su asa para cambiar el orden o, con él en foco, usa <kbd>⌥</kbd> <kbd>↑</kbd> y <kbd>⌥</kbd> <kbd>↓</kbd>. Cada pedido tiene botones para editarlo, enviarlo a continuación y sacarlo de la cola. Enviar a continuación pone el pedido arriba y le quita la hora marcada: sale en cuanto el agente quede libre.

Editar devuelve el texto a la caja, y la cola espera mientras editas. Si pasas 15 minutos sin tocarlo, la cola vuelve a avanzar. **Pausar cola** (*Pause queue*) retiene todo, también con la app reabierta, hasta que haces clic en **Reanudar cola** (*Resume queue*).

## Imágenes

La caja acepta imágenes: <kbd>⌘</kbd> <kbd>V</kbd>, arrastrarlas a la caja o el clip, **Adjuntar imágenes** (*Attach images*). Son hasta 8 por pedido, de hasta 10 MB cada una, en PNG, JPEG, GIF o WebP. Se quedan en esta computadora, y el agente recibe sus rutas al final del pedido, en una línea que empieza con `Imagens:` o `Images:`, según el idioma de la app. Si una imagen desaparece del disco antes de tiempo, el pedido no sale, y **Enviados** dice por qué.

## Cómo llegan los pedidos al agente

Los pedidos van de a uno, en el orden de la cola, y solo cuando el agente espera su próximo pedido. Nunca salen en medio de un trabajo, ni mientras la respuesta dejó un subagente o un comando en segundo plano, ni encima de un pedido de permiso. Entre un pedido y el siguiente, la cola espera al menos 20 segundos.

Cada pedido va tal como se escribió, en un solo pegado, y Persisty pulsa Enter justo después, para que Claude Code lo envíe en vez de guardarlo como borrador. Los saltos de línea dentro del pedido no envían nada antes de tiempo, y un pedido largo va entero.

Cuando la cuenta se queda sin cuota, la cola espera a que la ventana se renueve; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba).

## Plan y límites

Solo escribir, editar y adjuntar imágenes son [Pro](/docs/pro). En el plan gratis, los pedidos que ya están en la cola siguen saliendo y se pueden pausar, reanudar, reordenar, enviar a continuación o sacar, y **Soltar la cola ahora** (*Let the queue go now*) también funciona.

La cola se revisa cada 10 segundos con Persisty abierto. Con la app cerrada, no se envía nada. La cola es solo para sesiones de agente. Si la sesión termina, los pedidos que esperaban salen de la cola con la nota **la sesión terminó antes** (*the session ended first*). Por defecto, Persisty no recibe el estado de Codex CLI, así que no sabe cuándo está libre, y los pedidos no salen.
