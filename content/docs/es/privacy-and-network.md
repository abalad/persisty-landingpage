---
title: Privacidad y red
description: Qué se queda en tu máquina, qué sale y por qué, y cómo revisar cada llamada de red de Persisty.
group: account
order: 3
---

Persisty es local: [proyectos](/docs/projects-and-workspaces), [sesiones](/docs/sessions), historial, [notas](/docs/notes) y [uso](/docs/usage-and-quota) quedan en una base de datos SQLite en tu máquina. No hay telemetría. En [**Configuración › Privacidad y red**](/docs/settings#privacidad-y-red) (*Settings › Privacy & network*), lo compruebas y ves cada llamada que la app hizo hacia afuera.

## Privacidad

Arriba en la pantalla, el grupo **Privacidad** (*Privacy*) dice que la **Telemetría** (*Telemetry*) está apagada, que los **Datos de las sesiones** (*Session data*) quedan en esta máquina y que las **Integraciones externas** (*External integrations*) son opcionales.

El código, la salida de la terminal y los prompts nunca salen de tu máquina a través de Persisty, salvo los commits que tú mismo envías al remoto de tu repositorio git. Los agentes hablan con sus proveedores, y con los [servidores MCP](/docs/mcp-servers) que actives en el proyecto, como lo harían sin Persisty. El [dictado por voz](/docs/voice) corre en la computadora, y el audio no sale de ella.

El sitio persisty.app usa Google Analytics solo después de que haces clic en **Aceptar** en el aviso de cookies. Eso vale para el sitio, no para la app. Más detalles en [Seguridad](/security) y en la [Política de privacidad](/privacy).

## Lo que sale, y por qué

La app solo habla con afuera para:

- leer la cuota de Claude Code (`api.anthropic.com`), con la credencial que Claude Code ya guarda; el token no se guarda ni se registra;
- entrar a la cuenta de Persisty Cloud y renovar la [licencia](/docs/account-and-license#licencia), en el servidor de Persisty Cloud, una dirección `supabase.co`;
- hablar con GitHub, GitLab o Bitbucket, en las [cuentas que conectes](/docs/forges);
- leer las [issues](/docs/issues) de Linear, Jira, ClickUp y GitHub, en las integraciones de tareas que conectes; al **Concluir** (*Finish*), cuando haces clic en **Enviar** (*Send*), escribir en la issue el comentario que revisaste, si no está vacío, y el nuevo estado;
- clonar, buscar, traer y enviar commits en el remoto de tus repositorios git (la búsqueda también ocurre sola al abrir y cada 5 minutos con la app en pantalla, para mostrar lo que falta traer y enviar);
- descargar un [servidor de lenguaje](/docs/editor#el-servidor-del-lenguaje) cuando el editor necesita uno que no está en el proyecto ni en el sistema: Node de `nodejs.org`, los paquetes de npm de `registry.npmjs.org` (o del registro de tu `.npmrc`) y rust-analyzer de GitHub;
- descargar el [modelo de voz](/docs/voice#modelo-de-voz) del dictado de `huggingface.co`, cuando haces clic en **Descargar** (*Download*) en **Configuración › Voz** (*Settings › Voice*);
- en **Configuración › Servidores MCP** (*Settings › MCP servers*), [buscar en el registro oficial de MCP](/docs/mcp-servers#buscar-en-el-registro-oficial) (`registry.modelcontextprotocol.io`) el nombre que escribes y descargar los íconos de los servidores; en **Probar** (*Test*), pedirle a un servidor remoto que inicie la conexión, con las credenciales que le diste;
- [buscar versiones nuevas](/docs/updates) en GitHub, al abrirse, cada 6 horas y cuando lo pides, y descargar la actualización cuando haces clic en **Instalar y reiniciar** (*Install and restart*). Puedes apagar la búsqueda automática en [**Configuración › Acerca de**](/docs/settings#acerca-de) (*Settings › About*).

Una función en versión preliminar que actives puede hacer otras llamadas, y esas también aparecen en el [registro de red](#registro-de-red).

## Registro de red

![Una búsqueda de sentry en Servidores MCP consulta el registro oficial; en Privacidad y red, la lista de llamadas de red muestra esa llamada, con el destino, el motivo, los bytes enviados y recibidos, la hora y el resultado.](/docs-media/privacy-and-network/rede.mp4)

Abajo, **Llamadas de red desde que se abrió la app** (*Network calls since the app opened*) lista cada llamada con destino, motivo, bytes enviados y recibidos, resultado y hora. Clonar, buscar, traer y enviar commits aparecen como `GIT`, con 0 bytes: quien transfiere es el propio git, y la app no lo mide. Una llamada redirigida, como la búsqueda y la descarga de una actualización, tiene una línea por cada servidor por el que pasó. Los encabezados, el cuerpo y los parámetros nunca se muestran ni se guardan. La lista no se actualiza sola: **Actualizar** (*Refresh*) la lee de nuevo.

## Permisos de macOS

En Mac, los programas que corren en las sesiones no usan los permisos de privacidad dados a Persisty, como el micrófono, las carpetas y la accesibilidad: macOS decide por ellos y pregunta cuando lo necesita. Por eso, la primera sesión en una carpeta protegida, como Documentos, Escritorio o Descargas, puede pedir acceso a ella.

Si actualizaste desde una versión anterior a la 0.9.0, las sesiones, incluidas las nuevas, siguen usando los permisos de Persisty hasta que el Mac se reinicie.

## Plan y límites

Todo en esta página vale en cualquier plan, sin cuenta. El registro guarda las 500 llamadas más recientes y se vacía al cerrar la app. La separación de permisos de las sesiones existe solo en macOS.
