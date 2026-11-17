---
title: Configuración, pantalla por pantalla
description: Cada pestaña de Configuración, en el orden de la app, con sus opciones, el valor por defecto de cada una y la página que explica la función.
group: reference
order: 2
---

**Configuración** (*Settings*) se abre con <kbd>⌘</kbd> <kbd>,</kbd>. Las pestañas están en cinco grupos: **Interfaz** (*Interface*), con Apariencia (*Appearance*), Workspace y Notificaciones (*Notifications*); **Código** (*Code*), con Editor, Terminal y Archivos (*Files*); **Agentes** (*Agents*), con Agentes (*Agents*), Cuentas de IA (*AI accounts*) y Voz (*Voice*); **Conexiones** (*Connections*), con Integraciones (*Integrations*), Servidores MCP (*MCP servers*), Uso de IA (*AI usage*) y Privacidad y red (*Privacy & network*); y **Persisty**, con Atajos (*Shortcuts*), Cuenta (*Account*) y Acerca de (*About*). Esta página sigue ese orden; el nombre de una opción lleva a la página que explica la función, cuando la hay. Como la app no está en español, cada opción lleva su nombre en inglés la primera vez que aparece.

## Apariencia

Tema, idioma y la mascota.

| Opción | Por defecto |
| --- | --- |
| **Tema** (*Theme*) | **Oscuro** (*Dark*). También **Claro** (*Light*) o **Sistema** (*System*), que sigue el modo claro u oscuro de la computadora |
| **Idioma** (*Language*) | **Português (Brasil)**. También **English**. Cambia los textos de la interfaz |
| [**Mascota en la terminal**](/docs/mascot#en-la-terminal) (*Mascot in the terminal*) | encendido. Con la mascota fuera de la app, la de la terminal desaparece |
| [**Mascota fuera de la app**](/docs/mascot#fuera-de-la-app) (*Mascot outside the app*) | apagado. Solo en macOS |
| [**La mascota camina sobre tus ventanas**](/docs/mascot#fuera-de-la-app) (*The mascot walks on your windows*) | encendido. Vale con la mascota fuera de la app |

## Workspace

Guardado, IDE, división de los paneles y dónde quedan las carpetas propias.

| Opción | Por defecto |
| --- | --- |
| [**Guardar automáticamente**](/docs/editor#guardar-automáticamente) (*Save automatically*) | apagado. Encendido, guarda 1 s después de la última edición, nunca encima de un cambio hecho fuera del editor |
| [**IDE por defecto**](/docs/files#abrir-en) (*Default IDE*) | **Ninguno** (*None*). La lista trae las IDE que Persisty encuentra en la computadora |
| [**Tamaño de los paneles**](/docs/sessions#panel-lateral) (*Panel size*) | **Restablecer** (*Reset*) devuelve el editor y la terminal a la división por defecto en todas las sesiones |
| [**Carpeta de los worktrees**](/docs/worktrees#dónde-quedan) (*Worktrees folder*) | `~/.persist/worktrees`. **Elegir…** (*Choose…*) la cambia, y **Usar la predeterminada** (*Use the default*) vuelve; vale para worktrees nuevos |

## Notificaciones

El grupo **Cuando un agente te necesita** (*When an agent needs you*).

| Opción | Por defecto |
| --- | --- |
| [**Silenciar con Persisty en foco**](/docs/notifications#configurar) (*Mute while Persisty is focused*) | encendido. Con la ventana en foco, no envía la notificación del sistema |
| [**Alertas dentro de la app**](/docs/notifications#configurar) (*In-app alerts*) | encendido |
| [**Reproducir sonido**](/docs/notifications#configurar) (*Play a sound*) | encendido |
| [**Enviar prueba**](/docs/notifications#enviar-una-prueba) (*Send a test*) | dispara la alerta, el sonido y la notificación del sistema a la vez |

## Editor

Los grupos, en orden: **Fuente** (*Font*), **Comportamiento** (*Behavior*), **Atajos**, **Markdown**, **Minimapa** (*Minimap*), **Autor de la línea (git blame)** (*Line author (git blame)*) y **Pestañas** (*Tabs*). Los cambios valen al instante en los editores abiertos.

| Opción | Por defecto |
| --- | --- |
| **Familia de la fuente** (*Font family*) | vacío, que usa la pila por defecto: SF Mono, Menlo, Monaco y otras |
| **Tamaño** (*Size*) | 13, de 8 a 32 |
| **Peso** (*Weight*) | normal |
| **Altura de la línea** (*Line height*) | 1,55, de 1 a 2,5 |
| **Ligaduras** (*Ligatures*) | apagado. Solo con fuentes que las tienen, como Fira Code y JetBrains Mono |
| **Ancho de la tabulación** (*Tab width*) | 2, de 1 a 8 |
| **Insertar espacios** (*Insert spaces*) | encendido. Apagado, la tecla Tab inserta un carácter de tabulación |
| **Ajustar líneas** (*Wrap lines*) | apagado |
| **Números de línea** (*Line numbers*) | encendido |
| [**Contexto fijo al desplazar**](/docs/editor#contexto-fijo-y-minimapa) (*Sticky scroll*) | apagado |
| **Modificador del multicursor** (*Multi-cursor modifier*) | **⌘ (Ctrl)**. También **⌥ (Alt)** |
| [**Mapa de teclas**](/docs/editor#mapa-de-teclas) (*Keymap*) | **WebStorm**. También **WebStorm (macOS)** y **VS Code** |
| [**Abrir archivos .md en**](/docs/editor#markdown-e-imágenes) (*Open .md files in*) | **Código**. También **Vista previa** (*Preview*) |
| [**Mostrar el minimapa**](/docs/editor#contexto-fijo-y-minimapa) (*Show the minimap*) | apagado |
| **Dibujo** (*Drawing*) | **Caracteres** (*Characters*). También **Bloques** (*Blocks*) |
| **Escala** (*Scale*) | 1. También 2 y 3 |
| **Área visible** (*Visible area*) | **Al pasar el puntero** (*On hover*). También **Siempre** (*Always*) |
| **Ocultar hasta pasar el puntero** (*Hide until hovered*) | apagado |
| [**Mostrar el autor al final de la línea**](/docs/git-in-the-editor#autor-de-la-línea) (*Show the author at the end of the line*) | encendido |
| **Autor** (*Author*), **Fecha** (*Date*) y **Mensaje** (*Message*) | encendidos |
| **Retraso** (*Delay*) | 600 ms. También 300, 1000 y 2000 ms |
| [**Límite de pestañas**](/docs/tabs-and-groups#opciones-de-las-pestañas) (*Tab limit*) | 20. También 10, 30, 50 y **Sin límite** (*No limit*) |
| **Al cerrar, ir a** (*On close, go to*) | **La pestaña usada antes** (*The tab used before*). También **La pestaña vecina** (*The neighbour tab*) |
| **Abrir pestaña nueva** (*Open new tab*) | **Al final** (*At the end*). También **Justo después de la actual** (*Right after the current one*) |
| **Mostrar la carpeta en nombres repetidos** (*Show the folder for repeated names*) | encendido |
| **Marcar pestañas sin guardar** (*Mark unsaved tabs*) | **Punto** (*Dot*). También **Nombre en cursiva** (*Name in italics*) |
| **Pestaña de vista previa** (*Preview tab*) | apagado |

El **Peso** va de 100 a 900, además de normal y bold. Las opciones del minimapa aparecen con él encendido, y las del autor de la línea, con **Mostrar el autor al final de la línea** encendido.

**Modificador del multicursor** es la tecla que, con el clic, agrega otro cursor. Con **⌘ (Ctrl)**, hacer clic en un nombre va a la definición cuando el archivo tiene servidor del lenguaje; fuera de un nombre, o en un archivo sin servidor, el clic agrega el cursor. Para seleccionar en bloque, arrastra manteniendo <kbd>⌥</kbd> con **⌘ (Ctrl)**, o <kbd>⌥</kbd> <kbd>⌘</kbd> con **⌥ (Alt)**.

## Terminal

Los grupos, en orden: **Fuente**, **Cursor**, **Visualización** (*Display*) y **Teclado** (*Keyboard*). Los cambios valen al instante, sin reiniciar las sesiones.

| Opción | Por defecto |
| --- | --- |
| **Familia de la fuente** | vacío, que usa la misma pila por defecto del editor |
| **Tamaño** | 13, de 8 a 32 |
| **Peso** | normal |
| **Peso de la negrita** (*Bold weight*) | bold |
| **Altura de la línea** | 1,2, de 1 a 2 |
| **Estilo** (*Style*) | **Bloque** (*Block*). También **Subrayado** (*Underline*) y **Barra** (*Bar*). Los programas pueden cambiar la forma |
| **Parpadear** (*Blink*) | encendido |
| **Espaciado interno (px)** (*Inner spacing (px)*) | 8, de 0 a 40 |
| **Renderizador** (*Renderer*) | **WebGL**. También **DOM (compatibilidad)** (*DOM (compatibility)*), más lento, pero funciona en cualquier lugar |
| **Líneas de historial** (*History lines*) | 5000, de 1000 a 50000 |
| **Option como Meta** (*Option as Meta*) | encendido. Apágalo para escribir símbolos con <kbd>⌥</kbd> |

## Archivos

**Ocultar archivos** (*Hide files*) lista patrones como `**/node_modules`, y lo que coincide con uno de ellos queda fuera del árbol, de la búsqueda y de **Abrir archivo** (*Open file*). El patrón de fábrica es `**/.DS_Store`. Cada patrón tiene un interruptor y un botón para quitarlo; **Nuevo patrón** (*New pattern*) y **Agregar** (*Add*) suman otro. El `.git` queda siempre oculto. Mira [Ocultar archivos](/docs/files#ocultar-archivos).

## Agentes

| Opción | Por defecto |
| --- | --- |
| **Terminales y agentes** (*Terminals and agents*) | muestra **listo** (*ready*) cuando las terminales pueden abrirse en esta computadora |
| [**Agente por defecto**](/docs/agents#agente-por-defecto) (*Default agent*) | **Claude Code**. También **Codex CLI** y **Terminal** |
| [**Herramientas de Persisty en los agentes**](/docs/agent-access#encender) (*Persisty tools in agents*) | apagado |
| [**Verificar instalación**](/docs/agent-access#verificar-instalación) (*Check installation*) | prueba, paso a paso, el servidor de esas herramientas |
| [**Codex CLI**](/docs/agent-access#codex-cli) | el comando para correr una vez en la terminal, con **Copiar** (*Copy*) |
| [**Agentes detectados**](/docs/agents#agentes-detectados) (*Detected agents*) | la versión y la ruta de Claude Code y de Codex CLI |

Si **Terminales y agentes** muestra **no disponible** (*unavailable*), vuelve a abrir Persisty; si sigue, reinstala la app.

## Cuentas de IA

La lista muestra las cuentas de Claude Code, con la de esta computadora marcada como **Esta computadora** (*This computer*) y las ventanas de cuota de cada una.

| Opción | Por defecto |
| --- | --- |
| [**Otra cuenta › Conectar cuenta**](/docs/ai-accounts#conectar-una-cuenta) (*Another account › Connect account*) | solo la cuenta de esta computadora. Pro |
| [**Rotación entre cuentas**](/docs/ai-accounts#rotación) (*Rotate between accounts*) | apagado. Pro |
| [**Cambiar de cuenta al llegar a**](/docs/ai-accounts#rotación) (*Switch accounts at*) | 90%. También 80%, 95% y **100% · solo en el límite** (*100% · only at the limit*). Aparece con la rotación encendida |
| [**Continuar la tarea cortada por el límite**](/docs/ai-accounts#seguir-con-la-tarea-cortada) (*Go on with the task the limit cut*) | encendido. Pro |
| [**Usar solo en los proyectos fijados en ella**](/docs/ai-accounts#una-cuenta-para-un-proyecto) (*Use only for the projects pinned to it*) | apagado, en cada cuenta conectada. Pro |

## Voz

Con **Dictado por voz** (*Voice dictation*) apagado, la pantalla muestra solo ese interruptor; las demás opciones aparecen al encenderlo.

| Opción | Por defecto |
| --- | --- |
| [**Dictado por voz**](/docs/voice#encender-el-dictado) | apagado |
| [**Atajo**](/docs/voice#atajo) (*Shortcut*) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. **Cambiar** (*Change*) pone otro, y **Por defecto** (*Default*) vuelve |
| [**Idioma del dictado**](/docs/voice#idioma-y-sustituciones) (*Dictation language*) | **Igual que la app** (*Same as the app*). También **Português (Brasil)** e **English** |
| [**Modelo de voz**](/docs/voice#modelo-de-voz) (*Voice model*) | **No descargado** (*Not downloaded*). **Descargar** (*Download*) trae unos 640 MB |
| [**Micrófono**](/docs/voice#micrófono) (*Microphone*) | la **Entrada** (*Input*) por defecto del sistema y, en el Mac, el **Permiso** (*Permission*) |
| [**Sustituciones**](/docs/voice#idioma-y-sustituciones) (*Replacements*) | vacío. **Probar** (*Try it*) muestra en qué se convierte una frase |

## Integraciones

La pantalla muestra primero las **Conectadas** (*Connected*) y después las **Disponibles** (*Available*); haz clic en un servicio para abrir su página. GitHub, GitLab y Bitbucket conectan cuentas para listar y clonar tus repositorios; mira [GitHub, GitLab y Bitbucket](/docs/forges). Linear, Jira y ClickUp traen issues para empezar sesiones; mira [Issues](/docs/issues#conectar-el-servicio). Al final, **Clonación › Carpeta por defecto para clones** (*Cloning › Default folder for clones*) viene en `~/Documents/GitHub`; mira [Carpeta de los clones](/docs/forges#carpeta-de-los-clones).

## Servidores MCP

**Instalados** (*Installed*) lista los servidores que instalaste, y **Disponibles** tiene una selección de 16 servidores oficiales. La búsqueda también consulta el registro oficial de MCP, y **Agregar manualmente** (*Add manually*) instala un servidor que no está en la lista. Cada proyecto elige los servidores que reciben sus sesiones, en los ajustes del proyecto. Mira [Servidores MCP](/docs/mcp-servers).

## Uso de IA

| Opción | Por defecto |
| --- | --- |
| [**Alerta diaria (USD)**](/docs/usage-and-quota#alertas-de-gasto) (*Daily alert (USD)*) | vacío, que apaga la alerta |
| [**Alerta mensual (USD)**](/docs/usage-and-quota#alertas-de-gasto) (*Monthly alert (USD)*) | vacío, que apaga la alerta |
| [**Fuentes de datos**](/docs/usage-and-quota#fuentes-de-datos) (*Data sources*) | cada fuente, con la última lectura o **No conectado** (*Not connected*) |
| [**Abrir uso detallado**](/docs/usage-and-quota#gasto-estimado) (*Open detailed usage*) | abre la página **Uso de IA** |

## Privacidad y red

Arriba, **Privacidad** (*Privacy*) dice que la **Telemetría** (*Telemetry*) está apagada, que los **Datos de las sesiones** (*Session data*) quedan en esta máquina y que las **Integraciones externas** (*External integrations*) son opcionales; nada de eso se configura. Abajo, **Llamadas de red desde que se abrió la app** (*Network calls since the app opened*) lista cada llamada hacia fuera, y **Actualizar** (*Refresh*) vuelve a leer la lista. Mira [Privacidad y red](/docs/privacy-and-network).

## Atajos

Todas las teclas del mapa del editor y de Persisty, en palabras y con búsqueda. Aquí no se cambia nada: el mapa está en **Editor › Mapa de teclas**, y la tecla del dictado, en **Voz › Atajo**. Mira [Lista completa](/docs/shortcuts#lista-completa).

## Cuenta

Esta pestaña solo aparece con la cuenta de Persisty Cloud conectada. Muestra el **E-mail**, el **Plan**, la **Licencia** (*License*) y los **Recursos del plan** (*Plan features*); en el plan gratis, la fila **Suscripción** (*Subscription*) tiene **Ver planes** (*See plans*). Abajo están **Actualizar licencia** (*Refresh license*) y **Salir de la cuenta** (*Sign out*). Sin cuenta, el pie de Configuración tiene **Entrar** (*Sign in*) y **Crear cuenta gratis** (*Create free account*). Mira [Cuenta y licencia](/docs/account-and-license#plan-y-recursos).

## Acerca de

| Opción | Por defecto |
| --- | --- |
| **Versión** (*Version*) y **Sistema** | la versión de la app y el sistema, como "macOS · Apple Silicon" |
| **Carpeta de datos** (*Data folder*) | dónde quedan la base local, los hooks y los registros de las sesiones, con **Mostrar en Finder** (*Show in Finder*) |
| [**Buscar actualizaciones**](/docs/updates#actualizar-en-la-app) (*Check for updates*) | busca al instante |
| [**Buscar actualizaciones automáticamente**](/docs/updates#apagar-la-búsqueda-automática) (*Check for updates automatically*) | encendido: al abrir la app y cada 6 horas |
| **Saber más** (*Learn more*) | **Novedades** (*What's new*), **Documentación** (*Documentation*), **Privacidad** y **Términos de uso** (*Terms of use*), cada uno con **Abrir** (*Open*) |

## Plan y límites

Casi todo en Configuración es del plan gratis. En **Cuentas de IA**, son de Pro conectar otra cuenta, la **Rotación entre cuentas**, **Continuar la tarea cortada por el límite** y **Usar solo en los proyectos fijados en ella**. Sin Pro, **Conectar cuenta** queda desactivado, la rotación y la reserva aparecen con la marca **Pro**, y **Continuar la tarea cortada por el límite** no aparece. La **Carpeta de los worktrees** es de todos los planes, pero la [carpeta propia](/docs/worktrees) que va en ella es de Pro.

En Windows y Linux, que están en versión preliminar, las teclas de esta página usan <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>. **La mascota camina sobre tus ventanas** solo aparece en macOS.
