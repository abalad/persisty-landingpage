---
title: "Issues: Linear, Jira, ClickUp y GitHub"
description: Empieza una sesión desde una issue y, al final, coméntala y cambia su estado sin salir de Persisty.
group: integrations
order: 1
---

Persisty lee las issues de Linear, Jira, ClickUp y GitHub. Eliges una al crear la sesión, el agente recibe el pedido con el título, el enlace y la descripción, y al final **Concluir** (*Finish*) comenta en la issue y cambia su estado.

## Conectar el servicio

Las issues de GitHub vienen de la cuenta que conectaste para clonar repositorios; mira [GitHub, GitLab y Bitbucket](/docs/forges). Linear, Jira y ClickUp se conectan con un token, en **Configuración › Integraciones** (*Settings › Integrations*): abre el servicio, haz clic en **Conectar cuenta** (*Connect account*) y sigue los pasos de su página.

En Linear, crea una clave personal en Security & access, en la sección Personal API keys; **Abrir Linear** (*Open Linear*) te lleva ahí. En Jira, escribe la **Dirección de Jira** (*Jira address*), como `empresa.atlassian.net`, crea un token de API en Atlassian con Create API token, sin scopes, y escribe el **E-mail de la cuenta de Atlassian** (*Atlassian account e-mail*) que creó el token. En ClickUp, genera tu token personal en Settings › Apps, en API Token; empieza con `pk_`. Pega la clave o el token y haz clic en **Conectar** (*Connect*). Persisty comprueba el token con el servicio antes de guardarlo en el almacén de contraseñas del sistema.

Cada servicio acepta más de una cuenta, y cada una aparece en **Cuentas** (*Accounts*) con **Desconectar** (*Disconnect*). Desconectar hace que Persisty olvide el token, pero no lo borra en el servicio: para revocarlo, bórralo allí o, en ClickUp, genera otro.

## Vincular al proyecto

Cada proyecto toma las issues de un solo servicio. Haz clic derecho en el proyecto, abre **Ajustes del proyecto › Tareas** (*Project settings › Tasks*) y haz clic en **Vincular un servicio** (*Link a service*). Elige la **Cuenta** (*Account*) y de dónde vienen las issues: el **Repositorio** (*Repository*) en GitHub, el **Equipo** (*Team*) en Linear, el **Proyecto** (*Project*) en Jira o la **Lista** (*List*) en ClickUp. En GitHub, los repositorios de los workspaces del proyecto aparecen primero, marcados con "this project's workspace", y el primero ya viene elegido. **Vincular** (*Link*) lo guarda.

Después, **Cambiar** (*Change*) cambia la cuenta o el alcance, y **Desvincular** (*Unlink*) quita el vínculo. Sin ninguna cuenta conectada, la sección muestra **Abrir Integraciones** (*Open Integrations*).

## Empezar desde una issue

En la ventana **Nueva sesión** (*New session*) (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>), el grupo **Issue** tiene **Empezar desde una issue** (*Start from an issue*). **Elegir issue** (*Choose issue*) lista las issues abiertas de lo que vinculaste al proyecto, las actualizadas más recientemente primero. **Mías** (*Mine*), la opción por defecto, muestra solo las asignadas a ti, y **Todas abiertas** (*All open*) las muestra todas. La búsqueda filtra por clave o título lo que ya llegó, y **Cargar más** (*Load more*) trae la página siguiente. En un proyecto todavía sin servicio, **Vincular un servicio** abre ahí mismo la sección **Tareas**.

La issue elegida le da nombre a la sesión, como `ENG-123 Fix the login`, y llena el **Pedido al agente** (*Request to the agent*) con "Work on issue ENG-123: Fix the login", el enlace y la descripción. Edita el pedido si quieres: entra como el primer pedido en cuanto el agente esté listo. En una **Terminal** no hay pedido, y la issue queda solo vinculada a la sesión.

Con **Carpeta propia (worktree)** (*Own folder (worktree)*) encendida, la **Rama nueva** (*New branch*) también viene de la issue: el nombre que sugiere Linear o, en los otros servicios, la clave y el título en minúsculas, sin acentos y unidos por guiones, como `eng-123-fix-the-login`, cortado en una palabra entera hasta 60 caracteres. La carpeta propia es Pro; mira [Carpeta propia](/docs/worktrees).

## Concluir

La sesión abierta desde una issue muestra la clave en el encabezado; al hacer clic se abre la issue en el navegador. Al lado, **Concluir** abre la ventana para concluirla. El **Comentario** (*Comment*) ya viene escrito, con el agente y la rama actual de la carpeta, como "Done with Claude Code, through Persisty." y "Branch: eng-123-fix-the-login". Cambia el texto como quieras; vacío, no se comenta nada.

**Nuevo estado** (*New status*) lista los estados del equipo en Linear, las transiciones que la issue ofrece ahora en Jira y los estados de la lista en ClickUp. En GitHub, las opciones son **Cerrar** (*Close*) y **Mantener abierta** (*Keep open*). La opción por defecto es **Dejar como está** (*Leave as is*), y el estado que envíes viene elegido en la próxima issue del mismo proyecto.

Nada llega al servicio antes de que hagas clic en **Enviar** (*Send*). La ventana dice qué salió bien y qué falló, y **Reintentar** (*Try again*) envía solo la parte que falló: el comentario nunca sale dos veces.

## Plan y límites

Las integraciones de tareas son del plan gratis. Solo listan issues abiertas, y cada proyecto vincula un servicio a la vez. De Jira, vale Jira Cloud. Las issues de GitLab y Bitbucket no se leen.

El primer pedido sale cuando Persisty sabe que el agente está listo. En Codex CLI, Persisty no recibe el estado del agente por defecto, y el pedido se queda esperando en la [cola](/docs/queue) de la sesión.

Leer las issues, comentar y cambiar el estado son llamadas de red, y cada una aparece en [Privacidad y red](/docs/privacy-and-network).
