---
title: Uso, costo y cuota
description: Gasto estimado por sesión, proyecto y modelo, alertas de gasto, las ventanas de 5 horas y 7 días y el contexto usado, con lo que quiere decir cada número.
group: agents
order: 6
---

La barra inferior de cada sesión de agente muestra el modelo, el gasto estimado, el contexto usado y las ventanas de 5 h y 7 d de la cuenta en la que corre. En una sesión de Claude Code, el modelo de la barra inferior es un selector; mira [Modelo por sesión](/docs/agents#modelo-por-sesión).

## Gasto estimado

El panel **Detalles** (*Details*, <kbd>⌘</kbd> <kbd>I</kbd>) muestra esos números de la sesión en foco y el gasto del proyecto en el mes, en **IA en el mes** (*AI this month*). **Uso detallado** (*Usage details*), en el mismo panel, abre la página **Uso de IA** (*AI usage*) del proyecto: pedidos, tokens y costo de **Hoy** (*Today*) y **Este mes** (*This month*), las sesiones de Claude Code con su costo, contexto y ventanas, y las tablas **Por sesión** (*By session*), **Por modelo** (*By model*) y **Por proveedor** (*By provider*). **Todos los proyectos** (*All projects*), arriba, reúne todo y muestra **Por proyecto** (*By project*) en lugar de **Por sesión**.

La página también se abre con **Uso de IA — todos los proyectos** (*AI usage — all projects*) en la paleta de comandos, y con **Abrir uso detallado** (*Open detailed usage*) en **Configuración › Uso de IA** (*Settings › AI usage*). **Sincronizar** (*Sync*) vuelve a leer los registros, y **Volver** (*Back*) o <kbd>Esc</kbd> cierran la página.

El gasto viene de los registros locales de Claude Code y de la status line que el propio Claude Code calcula. Las estimaciones por tokens usan precios de lista con fecha y origen, y **no son la factura** del proveedor.

## Alertas de gasto

En **Configuración › Uso de IA**, **Alerta diaria (USD)** (*Daily alert (USD)*) y **Alerta mensual (USD)** (*Monthly alert (USD)*) ponen un aviso arriba del workspace cuando la estimación del día o del mes, sumando todos los proyectos, llega al valor. Vacío o 0 lo desactiva.

## Fuentes de datos

La misma pantalla lista las **Fuentes de datos** (*Data sources*) y cuándo se leyó cada una por última vez. Hoy los números vienen de dos: los registros locales de Claude Code y su status line. Las demás de la lista, como Codex CLI y las APIs de Anthropic y de OpenAI, aparecen como **No conectado** (*Not connected*), y el gasto de Codex todavía no se cuenta.

## Ventanas de 5 h y 7 d

Las ventanas de 5 horas y 7 días son porcentajes de la suscripción, no dinero. Vienen en vivo del mismo servicio que el `/usage` de Claude Code y se consultan como máximo una vez por minuto por cuenta. Cada sesión muestra las ventanas de la cuenta en la que corre, con el e-mail y el plan al lado; con varias cuentas, cada sesión tiene sus propios números. Las ventanas de 7 días por modelo, cuando la cuenta las tiene, aparecen en el panel **Detalles**.

Cuando la cuenta se queda sin cuota, el encabezado de la sesión muestra **Sin cuota · vuelve a las …** (*Out of quota · back at …*) con la hora en que se renueva la ventana. Cuando el último turno falla por un error de Anthropic, muestra **El último turno falló: …** (*The last turn failed: …*) con el motivo. En los dos casos la cola de la sesión espera; mira [Cuando la cuota se acaba](/docs/ai-accounts#cuando-la-cuota-se-acaba). En la barra inferior, al hacer clic en la cuenta se abren las cuentas conectadas para cambiar la de la sesión (Pro); mira [Cuentas de IA y rotación](/docs/ai-accounts).

## Contexto

El porcentaje de contexto es cuánto de la ventana de contexto del modelo ya ocupa la conversación, según el propio Claude Code.

El gasto, la cuota y el contexto son del plan gratis.
