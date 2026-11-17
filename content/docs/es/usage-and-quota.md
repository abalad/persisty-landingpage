---
title: Uso, costo y cuota
description: Gasto por sesión, contexto usado y las ventanas de 5 horas y 7 días, con lo que quiere decir cada número.
group: agents
order: 3
---

La barra inferior de cada sesión de agente muestra el modelo, el gasto, el contexto usado y las ventanas de 5 h y 7 d. En una sesión de Claude Code, el modelo de la barra inferior es un selector; mira [Modelo por sesión](/docs/agents#modelo-por-sesión).

El panel **Detalles** (*Details*, <kbd>⌘</kbd> <kbd>I</kbd>) muestra esos números de la sesión en foco y el gasto del proyecto en el mes, en **IA en el mes** (*AI this month*). **Uso detallado** (*Usage details*), en el mismo panel, abre la página de uso del proyecto: gasto y tokens de **Hoy** (*Today*) y **Este mes** (*This month*), las sesiones de Claude Code y las tablas **Por sesión** (*By session*), **Por modelo** (*By model*) y **Por proveedor** (*By provider*). Con **Todos los proyectos** (*All projects*), la página reúne todo y muestra **Por proyecto** (*By project*) en lugar de **Por sesión**.

## Gasto

El gasto viene de los registros locales de Claude Code y de la status line que el propio Claude Code calcula. Las estimaciones por tokens usan precios de lista con fecha y origen, y **no son la factura** del proveedor.

En **Configuración › Uso de IA** (*Settings › AI usage*), **Alerta diaria (USD)** (*Daily alert (USD)*) y **Alerta mensual (USD)** (*Monthly alert (USD)*) ponen un aviso arriba del workspace cuando la estimación del día o del mes, sumando todos los proyectos, llega al valor. Vacío o 0 lo desactiva. La misma pantalla muestra las fuentes de datos y tiene **Abrir uso detallado** (*Open detailed usage*).

## Cuota

Las ventanas de 5 horas y 7 días son porcentajes de la suscripción, no dinero. Vienen del mismo servicio que el `/usage` de Claude Code y se consultan como máximo una vez por minuto. Las ventanas por modelo, cuando existen, aparecen en el panel de detalles.

Cuando la cuenta se queda sin cuota, el encabezado de la sesión muestra **Sin cuota · vuelve a las …** (*Out of quota · back at …*) con la hora en que se renueva la ventana. Cuando el último turno falla por un error de Anthropic, muestra **El último turno falló: …** (*The last turn failed: …*) con el motivo. En los dos casos la cola de la sesión espera; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba).

Cada sesión muestra la cuenta en la que corre (e-mail y plan). En la barra inferior, al hacer clic en ella se abren las cuentas conectadas para cambiar la de la sesión (Pro). Si tienes varias cuentas, mira [Cuentas de IA y rotación](/docs/ai-accounts).

## Contexto

El porcentaje de contexto es cuánto de la ventana de contexto del modelo ya ocupa la conversación, según el propio Claude Code.
