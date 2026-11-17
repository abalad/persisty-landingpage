---
title: Cuentas de IA y rotación
description: Conecta varias cuentas de Claude Code, sigue en vivo la cuota de cada una, elige la cuenta de cada sesión y deja que la cola espere cuando se acaba la cuota.
group: agents
order: 2
---

En **Configuración › Cuentas de IA** (*Settings › AI accounts*) están las cuentas de Claude Code de esta computadora: la que ya tenía el login hecho y las que conectes desde Persisty. Cada una muestra organización, plan y las ventanas de **5 horas** y **7 días**. El mismo e-mail en dos organizaciones aparece como dos cuentas, con el nombre de la organización al lado.

## Conectar una cuenta (Pro)

Conectar otra cuenta es una función del plan Pro. Sin él, **Conectar cuenta** (*Connect account*) queda desactivado y usas la cuenta de esta computadora.

1. En Cuentas de IA, en la fila **Otra cuenta** (*Another account*), haz clic en **Conectar cuenta**. Si quieres, escribe el e-mail de la cuenta (es opcional: solo viene completado en la pantalla de login) y haz clic en **Entrar con el navegador** (*Sign in with the browser*).
2. Persisty ejecuta el login del propio Claude Code (`claude auth login`) para una carpeta solo de esa cuenta, y se abre el navegador.
3. Completa el login en el navegador. La cuenta aparece sola. Si el navegador muestra un código en vez de volver a la app, pégalo en **Código del navegador** (*Code from the browser*) y haz clic en **Enviar código** (*Send code*).

Persisty nunca ve tu contraseña ni guarda la credencial: quien la guarda es Claude Code. El login y el historial de prompts quedan separados por cuenta. Los ajustes (`settings.json`), las instrucciones (`CLAUDE.md`), los agentes, los comandos, las skills, los estilos de salida y los plugins se comparten con la cuenta de esta computadora, y también las conversaciones y la memoria del proyecto: el `/resume` de cualquier cuenta encuentra la conversación entera.

Para quitar una cuenta, usa **Desconectar** (*Disconnect*): Persisty ejecuta el logout de Claude Code y borra la carpeta de esa cuenta. Cuentas de IA avisa cuando dos cuentas conectadas entraron con el mismo e-mail, lo que pasa cuando se hace un `/login` dentro de una sesión.

## Cuota en vivo

Las barras de 5 h y 7 d vienen del mismo lugar que el `/usage` de Claude Code, con la credencial que Claude Code ya guarda en la máquina. Persisty consulta como máximo una vez por minuto por cuenta (el servicio rechaza consultas más frecuentes) y mantiene los últimos números en pantalla entre una consulta y otra.

## Rotación (Pro)

Con la **Rotación entre cuentas** (*Rotate between accounts*) activada, cada sesión nueva de Claude Code va a la cuenta con más margen. Cuenta la ventana más llena, la de 5 horas o la de 7 días. En **Cambiar de cuenta al llegar a** (*Switch accounts at*) eliges el límite: 80%, 90% (el predeterminado), 95% o **100% · solo en el límite** (*100% · only at the limit*). Una cuenta en ese punto queda fuera de las sesiones nuevas hasta renovarse; si todas están en él, va la que se renueva primero. En Nueva sesión, el campo **Cuenta de Claude** (*Claude account*) viene con **Automática · rotación** (*Automatic · rotation*).

Cuando una sesión llega al límite que elegiste, pasa a otra cuenta con margen en cuanto termina su respuesta y sigue con la misma conversación. Si la sesión dejó un subagente o un comando corriendo, el cambio espera a que ese trabajo termine.

## Cambiar la cuenta de una sesión (Pro)

Haz clic en el e-mail de la cuenta, en el pie de la sesión, para ver las cuentas conectadas, cada una con su ventana de cuota más llena, y elegir otra. Con el agente respondiendo, el cambio ocurre cuando termina la respuesta. En una terminal común, el próximo `claude` ya abre en la cuenta elegida.

## Una cuenta para un proyecto (Pro)

En la configuración del proyecto, en **Cuenta de Claude** (*Claude account*), fija el proyecto a una cuenta, por ejemplo la de la empresa. Sus sesiones solo abren en esa cuenta, nunca cambian a otra y, en el límite, esperan a que su ventana se renueve.

En **Configuración › Cuentas de IA**, **Usar solo en los proyectos fijados en ella** (*Use only for the projects pinned to it*) reserva una cuenta para los proyectos fijados en ella: la rotación y los otros proyectos dejan esa cuenta de lado, y el pie de la sesión dice por qué. La cuenta de esta computadora no se puede reservar.

## Cuando la cuota se acaba

Si la cuenta llega al límite y no hay otra con margen, el encabezado de la sesión muestra "Sin cuota · vuelve a las 19:14 en la cuenta …", y la cola de pedidos espera en todas las sesiones de esa cuenta, incluso con la app reabierta. Un turno que falla por un error del servidor de Anthropic también retiene la cola de esa sesión, con el motivo en el encabezado. **Soltar la cola ahora** (*Let the queue go now*), arriba de la cola, deja pasar los pedidos. Esto vale en cualquier plan.

En Pro, con **Continuar la tarea cortada por el límite** (*Go on with the task the limit cut*) activado, en Cuentas de IA, con o sin rotación (viene activado), la conversación cortada sigue sola: Persisty escribe "continue" después de pasar la sesión a otra cuenta o, con la app abierta, cuando la ventana se renueva, una vez por renovación, y las colas de la cuenta vuelven a avanzar. Si la hora pasó con la app cerrada, la reanudación llega en cuanto se abre. Un aviso te dice cuándo la cuenta se queda sin cuota y cuándo se reanuda cada sesión; si escribes antes, la reanudación queda en tus manos.

## Sobre usar varias cuentas

Persisty no crea cuentas ni toca límites. Usa las cuentas que ya tienes, como la personal y la de la empresa, con el login del propio Claude Code. Cumplir los términos de cada cuenta sigue siendo cosa tuya.
