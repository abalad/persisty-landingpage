---
title: Problemas y limitaciones
description: Situaciones conocidas, qué hacer en cada una y lo que Persisty todavía no hace.
group: reference
order: 2
---

## El estado del agente aparece como desconocido

Claude Code muestra el aviso de confianza de la carpeta antes de cualquier hook. Responde en la terminal y el estado aparece. En Codex, aprueba los hooks con `/hooks` dentro del propio Codex.

## Escribí `claude` en una terminal y la sesión no se volvió agente

Las terminales abiertas antes de una actualización de Persisty no tienen el atajo que adopta a Claude Code. Abre una terminal nueva.

## La cuota aparece como no disponible

Persisty lee la cuota con la credencial que guarda Claude Code. Si venció, las barras usan los números de la propia sesión hasta que Claude Code la renueve. Las cuentas conectadas desde Persisty necesitan el ítem que Claude Code crea en el Keychain al completar el login.

## La cola no envió el pedido

La cola solo envía con Persisty abierto y con el agente esperando el próximo pedido. Los pedidos nunca van durante un trabajo ni encima de un pedido de permiso.

## Lo que Persisty todavía no hace

- Cambiar la cuenta de una sesión en medio de un turno. Con la rotación activada, el cambio ocurre cuando el turno termina.
- Integraciones con herramientas de analítica.
- Dividir la terminal en paneles lado a lado.
- En el editor: autocompletado inteligente, "ir a la definición", renombrar o borrar archivos.
- Instalador firmado en Windows, y Windows y Linux probados en máquinas reales.
