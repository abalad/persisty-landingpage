---
title: Privacidad y registro de red
description: Qué se queda en tu máquina, qué sale y cómo revisar cada llamada de red de Persisty.
group: account
order: 2
---

Persisty es local: proyectos, sesiones, historial, notas y uso quedan en una base de datos SQLite en tu máquina. No hay telemetría.

## Lo que nunca sale

El código, la salida de la terminal y los prompts nunca salen de tu máquina a través de Persisty, salvo los commits que tú mismo envías al remoto de tu repositorio git. Los agentes hablan con sus proveedores como lo harían sin Persisty.

## Lo que sale, y por qué

La app solo habla con afuera para:

- leer la cuota de Claude Code (`api.anthropic.com`), con la credencial que Claude Code ya guarda; el token no se guarda ni se registra;
- entrar a la cuenta de Persisty Cloud y renovar la licencia;
- hablar con GitHub, GitLab o Bitbucket, en las integraciones que conectes;
- leer las issues de Linear, Jira, ClickUp y GitHub, en las integraciones de tareas que conectes; al **Concluir** (*Finish*), cuando haces clic en **Enviar** (*Send*), escribir en la issue el comentario que revisaste, si no está vacío, y el nuevo estado;
- clonar, buscar, traer y enviar commits en el remoto de tus repositorios git (la búsqueda también ocurre sola al abrir y cada 5 minutos con la app en pantalla, para mostrar lo que falta traer y enviar);
- descargar un servidor de lenguaje cuando el editor necesita uno que no está en el proyecto ni en el sistema: Node de `nodejs.org`, los paquetes de npm de `registry.npmjs.org` (o del registro de tu `.npmrc`) y rust-analyzer de GitHub;
- descargar el modelo de voz del dictado de `huggingface.co`, cuando haces clic en **Descargar** (*Download*) en **Configuración › Voz** (*Settings › Voice*);
- en **Configuración › Servidores MCP** (*Settings › MCP servers*), buscar en el registro oficial de MCP (`registry.modelcontextprotocol.io`) el nombre que escribes y descargar los íconos de los servidores; en **Probar** (*Test*), pedirle a un servidor remoto que inicie la conexión, con las credenciales que le diste;
- buscar versiones nuevas en GitHub, al abrirse, cada 6 horas y cuando lo pides, y descargar la actualización cuando haces clic en **Instalar y reiniciar** (*Install and restart*). Puedes apagar la búsqueda automática en **Configuración › Acerca de** (*Settings › About*).

## Registro de red

En **Configuración › Privacidad y red** (*Settings › Privacy & network*), cada llamada que hizo la app desde que se abrió aparece con destino, motivo, bytes enviados y recibidos, resultado y hora. Clonar, buscar, traer y enviar commits aparecen como `GIT`, con 0 bytes: quien transfiere es el propio git, y la app no lo mide. Los encabezados, el cuerpo y los parámetros nunca se muestran ni se guardan. El registro guarda las 500 llamadas más recientes y se vacía al cerrar la app.

Más detalles en [Seguridad](/security) y en la [Política de privacidad](/privacy).
