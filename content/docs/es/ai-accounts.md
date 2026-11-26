---
title: Cuentas de IA y rotación
description: Conecta varias cuentas de Claude Code, sigue en vivo la cuota de cada una, elige la cuenta de cada sesión y deja que la cola espere cuando se acaba la cuota.
group: agents
order: 5
---

En [**Configuración › Cuentas de IA**](/docs/settings#cuentas-de-ia) (*Settings › AI accounts*) están las cuentas de Claude Code de esta computadora: la que ya tenía el login hecho y las que conectes desde Persisty. Las sesiones en cuentas diferentes corren al mismo tiempo, y cada una gasta la cuota de su cuenta.

## Cuentas conectadas

Cada cuenta aparece con el e-mail, la organización, el plan de Claude, cuántas sesiones tiene abiertas y las [ventanas](/docs/usage-and-quota#ventanas-de-5-h-y-7-d) de **5 h** y **7 d**. La cuenta que ya estaba en la computadora tiene la marca **Esta computadora** (*This computer*). El mismo e-mail en dos organizaciones aparece como dos cuentas. Cuando la cuota de una cuenta no aparece, la fila dice por qué: **Acceso vencido** (*Access expired*), **Inicio de sesión rechazado** (*Sign-in refused*), **Sin sesión** (*Signed out*), **Sin red** (*No network*) o **Esperando la cuota** (*Waiting for the quota*). Otro motivo aparece como **Cuota no disponible** (*Quota unavailable*).

Las barras vienen del mismo lugar que el `/usage` de Claude Code, con la credencial que Claude Code ya guarda en la máquina. Persisty consulta como máximo una vez por minuto por cuenta (el servicio rechaza consultas más frecuentes) y mantiene los últimos números en pantalla entre una consulta y otra. Ver las cuentas y sus cuotas es del plan gratis.

## Conectar una cuenta

![En Configuración › Cuentas de IA, Conectar cuenta deja escribir el e-mail de la cuenta; Entrar con el navegador espera el inicio de sesión, y la cuenta nueva entra en la lista con sus ventanas de 5 h y 7 d.](/docs-media/ai-accounts/contas.mp4)

Conectar otra cuenta es [Pro](/docs/pro). Sin él, **Conectar cuenta** (*Connect account*) queda desactivado y usas la cuenta de esta computadora.

1. En la fila **Otra cuenta** (*Another account*), haz clic en **Conectar cuenta**. Si quieres, escribe el e-mail en **E-mail de la cuenta (opcional)** (*Account e-mail (optional)*): solo viene completado en la pantalla de login. Después haz clic en **Entrar con el navegador** (*Sign in with the browser*).
2. Persisty ejecuta el login del propio Claude Code (`claude auth login`) para una carpeta solo de esa cuenta, y se abre el navegador.
3. Completa el login en el navegador. La cuenta aparece sola. Si el navegador muestra un código en vez de volver a la app, pégalo en **Código del navegador** (*Code from the browser*) y haz clic en **Enviar código** (*Send code*). Mientras Persisty espera, **Abrir el login de nuevo** (*Open the sign-in again*) abre otra vez la página de login, y la **×**, **Cancelar** (*Cancel*), desiste.

Persisty nunca ve tu contraseña ni guarda la credencial: quien la guarda es Claude Code.

Para quitar una cuenta, usa el botón de desconectar en su fila y confirma con **Desconectar** (*Disconnect*). Persisty ejecuta el logout de Claude Code y borra la carpeta de esa cuenta; las sesiones ya abiertas con ella siguen hasta que las cierres.

Cuentas de IA avisa cuando dos cuentas conectadas entraron con el mismo e-mail. Eso pasa cuando un `/login` hecho dentro de una sesión cambia la cuenta sin que Persisty lo sepa. Desconecta la repetida y vuelve a conectar la cuenta que tenía.

## Iniciar sesión de nuevo

Una cuenta con **Acceso vencido** (*Access expired*), **Inicio de sesión rechazado** (*Sign-in refused*) o **Sin sesión** (*Signed out*) recibe el botón **Iniciar sesión de nuevo** (*Sign in again*), junto al motivo. Ejecuta el login del propio Claude Code para esa cuenta, incluida la de esta computadora, y se abre el navegador; termina como en [Conectar una cuenta](#conectar-una-cuenta). La cuenta se queda en la lista todo el tiempo, y la cuota vuelve enseguida, con **Sesión iniciada de nuevo.** (*Signed in again.*) en la fila. Si entras con otro e-mail, la fila pasa a ser de esa cuenta, y el aviso dice cuál.

Con **Acceso vencido**, Claude Code suele renovar el acceso solo la próxima vez que se ejecuta; inicia sesión de nuevo si una sesión te pide login. **Iniciar sesión de nuevo** vale en cualquier plan.

## Lo que comparten las cuentas

El login y el historial de prompts quedan separados por cuenta. Los ajustes (`settings.json`), las instrucciones (`CLAUDE.md`), los agentes, los comandos, las skills, los estilos de salida y los plugins son los de la cuenta de esta computadora, compartidos con las demás.

Las conversaciones y la memoria de cada proyecto también están en una sola carpeta, la `~/.claude/projects` de la cuenta de esta computadora. Por eso una sesión que cambia de cuenta no pierde nada, y el `/resume` de cualquier cuenta encuentra la conversación entera. Una cuenta que tenía su propia carpeta de conversaciones se unió a esa una vez, sin borrar nada: cuando los dos lados tenían un archivo distinto con el mismo nombre, uno se quedó y el otro fue a una carpeta de respaldo.

## Rotación

![En Cuentas de IA, activar la Rotación entre cuentas marca la Próxima en la rotación; en Nueva sesión, el campo Cuenta de Claude viene con Automática · rotación.](/docs-media/ai-accounts/rodizio.mp4)

Con la **Rotación entre cuentas** (*Rotate between accounts*) activada, cada sesión nueva de Claude Code va a la cuenta con más margen, y la lista marca cuál es la **Próxima en la rotación** (*Next in rotation*). En **Nueva sesión** (*New session*), el campo **Cuenta de Claude** (*Claude account*) viene con **Automática · rotación** (*Automatic · rotation*); elige una cuenta ahí para abrir esa sesión en ella.

En **Cambiar de cuenta al llegar a** (*Switch accounts at*), que aparece con la rotación activada, eliges el límite: 80%, 90% (el predeterminado), 95% o **100% · solo en el límite** (*100% · only at the limit*). Cuenta la ventana más llena, la de 5 horas o la de 7 días. Una cuenta en ese punto queda fuera de las sesiones nuevas hasta renovarse; si todas están en él, va la que se renueva primero.

Cuando una sesión llega al límite que elegiste, pasa a otra cuenta con margen en cuanto termina su respuesta y sigue con la misma conversación. Si la sesión dejó un subagente o un comando en marcha, el cambio espera a que ese trabajo termine. La rotación es Pro.

## Cambiar la cuenta de una sesión

En Pro, haz clic en el e-mail de la cuenta, en la barra inferior de la sesión, para ver las cuentas conectadas, cada una con su ventana de cuota más llena, y elegir otra. Con el agente respondiendo, la barra inferior muestra **cambia al terminar la respuesta** (*switches when the answer ends*) y el cambio ocurre cuando termina la respuesta. Como en la rotación, un subagente o un comando que quedó en marcha hace esperar el cambio. En una terminal común, el próximo `claude` ya abre en la cuenta elegida. Al final del menú, **Administrar cuentas…** (*Manage accounts…*) lleva a Cuentas de IA; con una sola cuenta, el elemento es **Conectar otra cuenta…** (*Connect another account…*).

## Una cuenta para un proyecto

En Pro, en los ajustes del proyecto, en **Cuenta de Claude**, fija el proyecto a una cuenta, por ejemplo la de la empresa. Sus sesiones solo abren en esa cuenta, nunca cambian a otra y, en el límite, esperan a que su ventana se renueve. **Cualquier cuenta** (*Any account*) suelta el proyecto.

En **Configuración › Cuentas de IA**, **Usar solo en los proyectos fijados en ella** (*Use only for the projects pinned to it*) reserva una cuenta para los proyectos fijados en ella: la rotación y los otros proyectos dejan esa cuenta de lado. En el menú de la barra inferior, una cuenta que la sesión no puede usar aparece cerrada, y al pasar el puntero dice por qué, como **Reservada para los proyectos fijados en ella** (*Reserved for the projects pinned to it*). La cuenta de esta computadora no se puede reservar.

## Cuando la cuota se acaba

Si la cuenta llega al límite y no hay otra con margen, el encabezado de la sesión muestra "Sin cuota · vuelve a las 19:14 en la cuenta …" (*Out of quota · back at 19:14 on …*), y la [cola de pedidos](/docs/queue) espera en todas las sesiones de esa cuenta, incluso con la app reabierta. Un turno que falla por un error del servidor de Anthropic también retiene la cola de esa sesión, con **El último turno falló:** (*The last turn failed:*) y el motivo en el encabezado. **Soltar la cola ahora** (*Let the queue go now*), arriba de la cola, deja pasar los pedidos de esa sesión. Esto vale en cualquier plan, y un aviso te dice cuándo la cuenta se queda sin cuota y cuántas sesiones esperan.

## Seguir con la tarea cortada

En Pro, con **Continuar la tarea cortada por el límite** (*Go on with the task the limit cut*) activado, en Cuentas de IA, con o sin rotación (viene activado), la conversación que cortó el límite sigue sola. Persisty escribe "continue" después de pasar la sesión a otra cuenta o, con la app abierta, cuando la ventana se renueva, una vez por renovación, y las colas de la cuenta vuelven a avanzar. Si la hora pasó con la app cerrada, la reanudación llega en cuanto se abre. Un aviso te dice cuándo se reanuda cada sesión; si escribes antes, la reanudación queda en tus manos.

## Sobre usar varias cuentas

Persisty no crea cuentas ni toca límites. Usa las cuentas que ya tienes, como la personal y la de la empresa, con el login del propio Claude Code. Cumplir los términos de cada cuenta sigue siendo cosa tuya.

## Plan y límites

Ver las cuentas y sus cuotas y volver a iniciar sesión en una cuenta son del plan gratuito, y la cola espera a que la cuota se renueve en cualquier plan. Conectar otras cuentas, la rotación, cambiar la cuenta de una sesión, fijar un proyecto a una cuenta, reservar una cuenta y seguir con la tarea cortada son Pro.

Las cuentas y la rotación valen solo para Claude Code.

En Windows, que está en versión preliminar, Persisty encuentra la cuenta de esta computadora por la carpeta del usuario, aunque no exista la variable `HOME`, y una sesión puede salir de una cuenta reservada. Eso todavía se está comprobando en un Windows real.
