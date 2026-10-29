---
title: Privacidad y registro de red
description: Qué se queda en tu máquina, qué sale y cómo revisar cada llamada de red de Persisty.
group: account
order: 2
---

Persisty es local: proyectos, sesiones, historial, notas y uso quedan en una base de datos SQLite en tu máquina. No hay telemetría.

## Lo que nunca sale

El código, la salida de la terminal y los prompts nunca salen de tu máquina a través de Persisty. Los agentes hablan con sus proveedores como lo harían sin Persisty.

## Lo que sale, y por qué

La app solo habla con afuera para:

- leer la cuota de Claude Code (`api.anthropic.com`), con la credencial que Claude Code ya guarda; el token no se guarda ni se registra;
- entrar a la cuenta de Persisty Cloud y renovar la licencia;
- hablar con GitHub, GitLab o Bitbucket, en las integraciones que conectes;
- clonar, buscar, traer y enviar commits en el remoto de tus repositorios git (la búsqueda también ocurre sola al abrir y cada 5 minutos con la app en pantalla, para mostrar lo que falta traer y enviar);
- buscar versiones nuevas en GitHub, al abrirse, cada 6 horas y cuando lo pides. Puedes apagar la búsqueda automática en **Configuración › Acerca de** (*Settings › About*).

## Registro de red

En **Configuración › Privacidad y red** (*Settings › Privacy & network*), cada llamada que hizo la app desde que se abrió aparece con destino, motivo, tamaño, resultado y hora. Los encabezados, el cuerpo y los parámetros nunca se muestran ni se guardan. El registro se vacía al cerrar la app.

Más detalles en [Seguridad](/security) y en la [Política de privacidad](/privacy).
