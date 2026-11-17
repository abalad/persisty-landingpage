---
title: Servidores MCP
description: Instala servidores MCP de otros servicios, como GitHub, Sentry o Supabase, y elige cuáles reciben las sesiones de Claude Code de cada proyecto.
group: integrations
order: 3
---

Un servidor MCP le da al agente herramientas de otro servicio, como las issues de GitHub, los errores de Sentry o las tablas de Supabase. En Persisty, instalas el servidor una vez, en **Configuración › Servidores MCP** (*Settings › MCP servers*), y lo enciendes en los proyectos que deben recibirlo. Los servidores valen solo para Claude Code.

## Instalar desde la selección

En **Disponibles** (*Available*) hay una selección de 16 servidores, cada uno publicado por la propia empresa, con búsqueda y filtro por categoría. Cada tarjeta dice cómo se conecta el servidor, como **Inicio de sesión en el navegador** (*Sign in in the browser*), **Token** o **Usa tu cuenta de GitHub** (*Uses your GitHub account*).

**Instalar** (*Install*) abre la ventana del servidor, con quién lo publicó, el **Nombre de esta instalación** (*Name of this installation*), **Lo que va a correr** (*What will run*) y los campos de **Configuración** (*Configuration*), con los obligatorios marcados. Cuando el servidor tiene las dos formas, **Cómo se conecta** (*How it connects*) elige entre **Remoto, inicio de sesión en el navegador** (*Remote, sign-in in the browser*) y **En esta computadora, con token** (*On this computer, with a token*). El de GitHub pide la **Cuenta de GitHub** (*GitHub account*), una de las conectadas en [Integraciones](/docs/forges).

**Probar** (*Test*) lo prueba antes de instalar: un servidor en la computadora se abre y lista sus herramientas, y uno remoto responde al pedido de conexión. Un servidor que pide iniciar sesión en el navegador lo hace en la primera sesión que lo use.

## Buscar en el registro oficial

A partir de dos letras, la búsqueda también consulta el registro oficial de MCP, `registry.modelcontextprotocol.io`. Lo que encuentra aparece en **En el registro oficial** (*In the official registry*): los servidores publicados por la propia empresa con ✔, los demás con el nombre del autor. Al instalar uno de estos, la ventana avisa que Persisty no revisó el servidor. Algunos formatos todavía no se pueden instalar, y la tarjeta dice por qué.

## Agregar manualmente

Para un servidor fuera de la lista, como el de tu empresa o uno de un README, usa **Agregar manualmente** (*Add manually*). Ponle un **Nombre** (*Name*) y elige **Cómo corre** (*How it runs*): **Comando en la computadora** (*Command on this computer*), con el comando, los argumentos y las **Variables de entorno** (*Environment variables*), o **Dirección remota (URL)** (*Remote address (URL)*), con los **Encabezados** (*Headers*). Marca **Secreta** (*Secret*) en los valores que son tokens. La dirección tiene que empezar con `https://`; `http://` solo vale para `localhost`.

También puedes pegar la configuración: el JSON que el README manda poner en Claude Code, o el comando `claude mcp add` (o `add-json`). Persisty llena el formulario, y varios servidores pegados se agregan uno tras otro. **Probar conexión** (*Test connection*) lo prueba, y **Agregar** (*Add*) lo instala.

## Encender en un proyecto

Instalar no enciende el servidor en ningún proyecto. En **Ajustes del proyecto › Servidores MCP** (*Project settings › MCP servers*), cada servidor instalado tiene un interruptor, apagado por defecto. Justo después de instalar, **Encender en** (*Switch on in*), seguido del nombre del proyecto en foco, te lleva directo a esa pantalla.

La elección vale para las sesiones de Claude Code que empiecen o se reinicien después. El `claude` que escribes en una terminal de Persisty también recibe los servidores del proyecto, salvo que pases tu propio `--mcp-config`.

## Servidores instalados

En **Instalados** (*Installed*), cada tarjeta muestra en qué proyectos está encendido el servidor y su estado, como **Listo** (*Ready*), **Falta el token** (*Token missing*) o **Necesita npx** (*Needs npx*). Solo los listos, y los que inician sesión en el navegador en la primera sesión, llegan a las sesiones. **Configurar** (*Configure*) cambia la instalación, y **Poner token** (*Add token*) aparece cuando falta el token. **Instalar otra vez** (*Install again*) crea una segunda instalación con otro nombre, como una base de datos por proyecto. **Quitar** (*Remove*) saca el servidor de todos los proyectos y borra sus secretos.

Los tokens quedan en el almacén de contraseñas del sistema, el Keychain en el Mac, y solo llegan al archivo de configuración de la sesión mientras el agente corre; el archivo se borra cuando la sesión se detiene. Persisty no lee ni cambia tu `~/.claude.json` ni el `.mcp.json`, y los nombres que usa terminan en `-persisty`, para no ocultar un servidor tuyo con el mismo nombre.

## Plan y límites

Los servidores MCP son del plan gratis. Persisty solo se los pasa a las sesiones de Claude Code; Codex CLI no los recibe. Un servidor que corre en la computadora necesita el programa que lo ejecuta, como `npx`, `uvx` o `docker`. Cuando un servidor recibe el secreto en la línea de comandos, la ventana avisa que otros programas de la computadora pueden verlo mientras corre.

La búsqueda en el registro, los íconos y **Probar** en un servidor remoto son llamadas de red que aparecen en [Privacidad y red](/docs/privacy-and-network). Las herramientas del propio Persisty para los agentes están en otra pantalla; mira [Agentes que leen Persisty](/docs/agent-access).
