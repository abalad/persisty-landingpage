---
title: Configuración, pantalla por pantalla
description: Cada pestaña de Configuración, en el orden de la app, con sus opciones, el valor por defecto de cada una y la página que explica la función.
group: reference
order: 2
---

**Configuración** (*Settings*) se abre con <kbd>⌘</kbd> <kbd>,</kbd>. Las pestañas están en cinco grupos: **Interfaz** (*Interface*), con Apariencia (*Appearance*), Workspace y Notificaciones (*Notifications*); **Código** (*Code*), con Editor, Terminal y Archivos (*Files*); **Agentes** (*Agents*), con Agentes (*Agents*), Cuentas de IA (*AI accounts*) y Voz (*Voice*); **Conexiones** (*Connections*), con Integraciones (*Integrations*), Servidores MCP (*MCP servers*), Uso de IA (*AI usage*) y Privacidad y red (*Privacy & network*); y **Persisty**, con Atajos (*Shortcuts*), Cuenta (*Account*) y Acerca de (*About*). Esta página sigue ese orden; el nombre de una opción lleva a la página que explica la función, cuando la hay.

## Apariencia

Tema, idioma y la mascota.

| Opción | Por defecto |
| --- | --- |
| **Tema** | **Oscuro**. También **Claro** o **Sistema**, que sigue el modo claro u oscuro de la computadora |
| **Idioma** | **Português (Brasil)**. También **English**. Cambia los textos de la interfaz |
| [**Mascota en la terminal**](/docs/mascot#en-la-terminal) | encendido. Con la mascota fuera de la app, la de la terminal desaparece |
| [**Mascota fuera de la app**](/docs/mascot#fuera-de-la-app) | apagado. Solo en macOS |
| [**La mascota camina sobre tus ventanas**](/docs/mascot#fuera-de-la-app) | encendido. Vale con la mascota fuera de la app |

## Workspace

Guardado, IDE, división de los paneles y dónde quedan las carpetas propias.

| Opción | Por defecto |
| --- | --- |
| [**Guardar automáticamente**](/docs/editor#guardar-automáticamente) | apagado. Encendido, guarda 1 s después de la última edición, nunca encima de un cambio hecho fuera del editor |
| [**IDE por defecto**](/docs/files#abrir-en) | **Ninguno**. La lista trae las IDE que Persisty encuentra en la computadora |
| [**Tamaño de los paneles**](/docs/sessions#panel-lateral) | **Restablecer** devuelve el editor y la terminal a la división por defecto en todas las sesiones |
| [**Carpeta de los worktrees**](/docs/worktrees#dónde-quedan) | `~/.persist/worktrees`. **Elegir…** la cambia, y **Usar la predeterminada** vuelve; vale para worktrees nuevos |

## Notificaciones

El grupo **Cuando un agente te necesita**.

| Opción | Por defecto |
| --- | --- |
| [**Silenciar con Persisty en foco**](/docs/notifications#configurar) | encendido. Con la ventana en foco, no envía la notificación del sistema |
| [**Alertas dentro de la app**](/docs/notifications#configurar) | encendido |
| [**Reproducir sonido**](/docs/notifications#configurar) | encendido |
| [**Enviar prueba**](/docs/notifications#enviar-una-prueba) | dispara la alerta, el sonido y la notificación del sistema a la vez |

## Editor

Los grupos, en orden: **Fuente**, **Comportamiento**, **Atajos**, **Markdown**, **Minimapa**, **Autor de la línea (git blame)** y **Pestañas**. Los cambios valen al instante en los editores abiertos.

| Opción | Por defecto |
| --- | --- |
| **Familia de la fuente** | vacío, que usa la pila por defecto: SF Mono, Menlo, Monaco y otras |
| **Tamaño** | 13, de 8 a 32 |
| **Peso** | normal |
| **Altura de la línea** | 1,55, de 1 a 2,5 |
| **Ligaduras** | apagado. Solo con fuentes que las tienen, como Fira Code y JetBrains Mono |
| **Ancho de la tabulación** | 2, de 1 a 8 |
| **Insertar espacios** | encendido. Apagado, la tecla Tab inserta un carácter de tabulación |
| **Ajustar líneas** | apagado |
| **Números de línea** | encendido |
| [**Contexto fijo al desplazar**](/docs/editor#contexto-fijo-y-minimapa) | apagado |
| **Modificador del multicursor** | **⌘ (Ctrl)**. También **⌥ (Alt)** |
| [**Mapa de teclas**](/docs/editor#mapa-de-teclas) | **WebStorm**. También **WebStorm (macOS)** y **VS Code** |
| [**Abrir archivos .md en**](/docs/editor#markdown-e-imágenes) | **Código**. También **Vista previa** |
| [**Mostrar el minimapa**](/docs/editor#contexto-fijo-y-minimapa) | apagado |
| **Dibujo** | **Caracteres**. También **Bloques** |
| **Escala** | 1. También 2 y 3 |
| **Área visible** | **Al pasar el puntero**. También **Siempre** |
| **Ocultar hasta pasar el puntero** | apagado |
| [**Mostrar el autor al final de la línea**](/docs/git-in-the-editor#autor-de-la-línea) | encendido |
| **Autor**, **Fecha** y **Mensaje** | encendidos |
| **Retraso** | 600 ms. También 300, 1000 y 2000 ms |
| [**Límite de pestañas**](/docs/tabs-and-groups#opciones-de-las-pestañas) | 20. También 10, 30, 50 y **Sin límite** |
| **Al cerrar, ir a** | **La pestaña usada antes**. También **La pestaña vecina** |
| **Abrir pestaña nueva** | **Al final**. También **Justo después de la actual** |
| **Mostrar la carpeta en nombres repetidos** | encendido |
| **Marcar pestañas sin guardar** | **Punto**. También **Nombre en cursiva** |
| **Pestaña de vista previa** | apagado |

El **Peso** va de 100 a 900, además de normal y bold. Las opciones del minimapa aparecen con él encendido, y las del autor de la línea, con **Mostrar el autor al final de la línea** encendido.

**Modificador del multicursor** es la tecla que, con el clic, agrega otro cursor. Con **⌘ (Ctrl)**, hacer clic en un nombre va a la definición cuando el archivo tiene servidor del lenguaje; fuera de un nombre, o en un archivo sin servidor, el clic agrega el cursor. Para seleccionar en bloque, arrastra manteniendo <kbd>⌥</kbd> con **⌘ (Ctrl)**, o <kbd>⌥</kbd> <kbd>⌘</kbd> con **⌥ (Alt)**.

## Terminal

Los grupos, en orden: **Fuente**, **Cursor**, **Visualización** y **Teclado**. Los cambios valen al instante, sin reiniciar las sesiones.

| Opción | Por defecto |
| --- | --- |
| **Familia de la fuente** | vacío, que usa la misma pila por defecto del editor |
| **Tamaño** | 13, de 8 a 32 |
| **Peso** | normal |
| **Peso de la negrita** | bold |
| **Altura de la línea** | 1,2, de 1 a 2 |
| **Estilo** | **Bloque**. También **Subrayado** y **Barra**. Los programas pueden cambiar la forma |
| **Parpadear** | encendido |
| **Espaciado interno (px)** | 8, de 0 a 40 |
| **Renderizador** | **WebGL**. También **DOM (compatibilidad)**, más lento, pero funciona en cualquier lugar |
| **Líneas de historial** | 5000, de 1000 a 50000 |
| **Option como Meta** | encendido. Apágalo para escribir símbolos con <kbd>⌥</kbd> |

## Archivos

**Ocultar archivos** lista patrones como `**/node_modules`, y lo que coincide con uno de ellos queda fuera del árbol, de la búsqueda y de **Abrir archivo**. El patrón de fábrica es `**/.DS_Store`. Cada patrón tiene un interruptor y un botón para quitarlo; **Nuevo patrón** y **Agregar** suman otro. El `.git` queda siempre oculto. Mira [Ocultar archivos](/docs/files#ocultar-archivos).

## Agentes

| Opción | Por defecto |
| --- | --- |
| **Terminales y agentes** | muestra **listo** cuando las terminales pueden abrirse en esta computadora |
| [**Agente por defecto**](/docs/agents#agente-por-defecto) | **Claude Code**. También **Codex CLI** y **Terminal** |
| [**Herramientas de Persisty en los agentes**](/docs/agent-access#encender) | apagado |
| [**Verificar instalación**](/docs/agent-access#verificar-instalación) | prueba, paso a paso, el servidor de esas herramientas |
| [**Codex CLI**](/docs/agent-access#codex-cli) | el comando para correr una vez en la terminal, con **Copiar** |
| [**Agentes detectados**](/docs/agents#agentes-detectados) | la versión y la ruta de Claude Code y de Codex CLI |

Si **Terminales y agentes** muestra **no disponible**, vuelve a abrir Persisty; si sigue, reinstala la app.

## Cuentas de IA

La lista muestra las cuentas de Claude Code, con la de esta computadora marcada como **Esta computadora** y las ventanas de cuota de cada una.

| Opción | Por defecto |
| --- | --- |
| [**Otra cuenta › Conectar cuenta**](/docs/ai-accounts#conectar-una-cuenta) | solo la cuenta de esta computadora. Pro |
| [**Rotación entre cuentas**](/docs/ai-accounts#rotación) | apagado. Pro |
| [**Cambiar de cuenta al llegar a**](/docs/ai-accounts#rotación) | 90%. También 80%, 95% y **100% · solo en el límite**. Aparece con la rotación encendida |
| [**Continuar la tarea cortada por el límite**](/docs/ai-accounts#seguir-con-la-tarea-cortada) | encendido. Pro |
| [**Usar solo en los proyectos fijados en ella**](/docs/ai-accounts#una-cuenta-para-un-proyecto) | apagado, en cada cuenta conectada. Pro |

## Voz

Con **Dictado por voz** apagado, la pantalla muestra solo ese interruptor; las demás opciones aparecen al encenderlo.

| Opción | Por defecto |
| --- | --- |
| [**Dictado por voz**](/docs/voice#encender-el-dictado) | apagado |
| [**Atajo**](/docs/voice#atajo) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. **Cambiar** pone otro, y **Por defecto** vuelve |
| [**Idioma del dictado**](/docs/voice#idioma-y-sustituciones) | **Igual que la app**. También **Português (Brasil)** e **English** |
| [**Modelo de voz**](/docs/voice#modelo-de-voz) | **No descargado**. **Descargar** trae unos 640 MB |
| [**Micrófono**](/docs/voice#micrófono) | la **Entrada** por defecto del sistema y, en el Mac, el **Permiso** |
| [**Sustituciones**](/docs/voice#idioma-y-sustituciones) | vacío. **Probar** muestra en qué se convierte una frase |

## Integraciones

La pantalla muestra primero las **Conectadas** y después las **Disponibles**; haz clic en un servicio para abrir su página. GitHub, GitLab y Bitbucket conectan cuentas para listar y clonar tus repositorios; mira [GitHub, GitLab y Bitbucket](/docs/forges). Linear, Jira y ClickUp traen issues para empezar sesiones; mira [Issues](/docs/issues#conectar-el-servicio). Al final, **Clonación › Carpeta por defecto para clones** viene en `~/Documents/GitHub`; mira [Carpeta de los clones](/docs/forges#carpeta-de-los-clones).

## Servidores MCP

**Instalados** lista los servidores que instalaste, y **Disponibles** tiene una selección de 16 servidores oficiales. La búsqueda también consulta el registro oficial de MCP, y **Agregar manualmente** instala un servidor que no está en la lista. Cada proyecto elige los servidores que reciben sus sesiones, en los ajustes del proyecto. Mira [Servidores MCP](/docs/mcp-servers).

## Uso de IA

| Opción | Por defecto |
| --- | --- |
| [**Alerta diaria (USD)**](/docs/usage-and-quota#alertas-de-gasto) | vacío, que apaga la alerta |
| [**Alerta mensual (USD)**](/docs/usage-and-quota#alertas-de-gasto) | vacío, que apaga la alerta |
| [**Fuentes de datos**](/docs/usage-and-quota#fuentes-de-datos) | cada fuente, con la última lectura o **No conectado** |
| [**Abrir uso detallado**](/docs/usage-and-quota#gasto-estimado) | abre la página **Uso de IA** |

## Privacidad y red

Arriba, **Privacidad** dice que la **Telemetría** está apagada, que los **Datos de las sesiones** quedan en esta máquina y que las **Integraciones externas** son opcionales; nada de eso se configura. Abajo, **Llamadas de red desde que se abrió la app** lista cada llamada hacia fuera, y **Actualizar** vuelve a leer la lista. Mira [Privacidad y red](/docs/privacy-and-network).

## Atajos

Todas las teclas del mapa del editor y de Persisty, en palabras y con búsqueda. Aquí no se cambia nada: el mapa está en **Editor › Mapa de teclas**, y la tecla del dictado, en **Voz › Atajo**. Mira [Lista completa](/docs/shortcuts#lista-completa).

## Cuenta

Esta pestaña solo aparece con la cuenta de Persisty Cloud conectada. Muestra el **E-mail**, el **Plan**, la **Licencia** y los **Recursos del plan**; en el plan gratis, la fila **Suscripción** tiene **Ver planes**. Abajo están **Actualizar licencia** y **Salir de la cuenta**. Sin cuenta, el pie de Configuración tiene **Entrar** y **Crear cuenta gratis**. Mira [Cuenta y licencia](/docs/account-and-license#plan-y-recursos).

## Acerca de

| Opción | Por defecto |
| --- | --- |
| **Versión** y **Sistema** | la versión de la app y el sistema, como "macOS · Apple Silicon" |
| **Carpeta de datos** | dónde quedan la base local, los hooks y los registros de las sesiones, con **Mostrar en Finder** |
| [**Buscar actualizaciones**](/docs/updates#actualizar-en-la-app) | busca al instante |
| [**Buscar actualizaciones automáticamente**](/docs/updates#apagar-la-búsqueda-automática) | encendido: al abrir la app y cada 6 horas |
| **Saber más** | **Novedades**, **Documentación**, **Privacidad** y **Términos de uso**, cada uno con **Abrir** |

## Plan y límites

Casi todo en Configuración es del plan gratis. En **Cuentas de IA**, son de Pro conectar otra cuenta, la **Rotación entre cuentas**, **Continuar la tarea cortada por el límite** y **Usar solo en los proyectos fijados en ella**. Sin Pro, **Conectar cuenta** queda desactivado, la rotación y la reserva aparecen con la marca **Pro**, y **Continuar la tarea cortada por el límite** no aparece. La **Carpeta de los worktrees** es de todos los planes, pero la [carpeta propia](/docs/worktrees) que va en ella es de Pro.

En Windows y Linux, que están en versión preliminar, las teclas de esta página usan <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>. **La mascota camina sobre tus ventanas** solo aparece en macOS.
