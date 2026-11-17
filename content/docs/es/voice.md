---
title: Dictado por voz
description: Habla y el texto entra en la terminal o el editor en foco, con el modelo de voz corriendo en tu computadora.
group: integrations
order: 5
---

Con el dictado encendido, hablas y el texto entra en la terminal o el editor en foco, sin apretar Enter. La transcripción corre en tu computadora, y el audio no sale de ella.

## Encender el dictado

En **Configuración › Voz** (*Settings › Voice*), enciende **Dictado por voz** (*Voice dictation*); viene apagado. Antes del primer dictado, descarga el modelo de voz: en **Modelo de voz** (*Voice model*), haz clic en **Descargar** (*Download*), que muestra el tamaño, unos 640 MB. La descarga viene de `huggingface.co` y solo ocurre cuando la pides.

## Dictar

Haz clic en la terminal o el editor que debe recibir el texto y aprieta <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. El indicador en la parte de abajo de la ventana muestra **Escuchando** (*Listening*). Habla y aprieta la misma tecla otra vez: el indicador pasa a **Transcribiendo…** (*Transcribing…*) y después dice dónde entró el texto, como "Inserted into terminal api". <kbd>Esc</kbd> cancela.

El texto va adonde estaba el foco cuando empezaste, aunque hagas clic en otro lugar. En la terminal, se escribe como si fueras tú, sin Enter: en un agente, queda en el prompt esperando que lo envíes. En el editor, entra en el cursor. Un archivo de solo lectura, o tapado por la vista previa de Markdown, no recibe dictado. Si la terminal o el archivo se cierra antes, no se inserta nada, y **Copiar texto** (*Copy text*) copia lo que se transcribió.

Un dictado dura hasta 2 minutos. En los últimos 10 segundos, el indicador cuenta el tiempo, y al final el texto entra solo. Si Persisty deja de estar al frente, el dictado se cancela. Mientras hablas, la [mascota](/docs/mascot#en-la-terminal) de la terminal que va a recibir el texto sostiene un micrófono.

## Idioma y sustituciones

**Idioma del dictado** (*Dictation language*) viene en **Igual que la app** (*Same as the app*) y también puede ser **Português (Brasil)** o **English**. El modelo entiende los dos idiomas; la elección decide cómo los números y los términos se vuelven texto. En inglés, los números hablados se vuelven dígitos, "main dot rs" se vuelve `main.rs`, "dash dash release" se vuelve `--release`, "underscore" une palabras con `_`, "at sign" se vuelve `@`, y "slash" al principio se vuelve un comando, como `/compact`.

En **Sustituciones** (*Replacements*), **Tus sustituciones** (*Your replacements*) recibe una regla por línea, con el formato `hablado => Sustitución`; una línea que empieza con `#` es un comentario. Tus reglas valen antes de los cambios de Persisty. Son hasta 200 reglas, de hasta 200 caracteres cada una. **Probar** (*Try it*) muestra en qué se convierte una frase escrita, como si fuera hablada.

## Modelo de voz

El modelo es Parakeet TDT 0.6B v3, de NVIDIA (licencia CC BY 4.0), convertido por el proyecto sherpa-onnx. Viene de `huggingface.co`, se comprueba por sha256 y aparece en el registro de [Privacidad y red](/docs/privacy-and-network). Antes de descargar, la fila muestra el espacio libre en el disco.

Durante la descarga, la fila muestra el progreso y **Cancelar** (*Cancel*). Una descarga interrumpida queda **Incompleta** (*Incomplete*), con **Continuar** (*Resume*), que descarga solo lo que falta, y **Empezar de nuevo** (*Start over*). Con el modelo listo, la fila muestra su tamaño en disco y **Borrar** (*Delete*); sin el modelo, el dictado se detiene hasta que lo descargues otra vez. Si los archivos no coinciden, la fila dice **Dañado** (*Damaged*) y ofrece **Descargar de nuevo** (*Download again*). El modelo queda en la carpeta de datos de Persisty.

## Micrófono

Persisty usa la entrada por defecto del sistema, que aparece en **Entrada** (*Input*). En el Mac, macOS pide el permiso en el primer dictado; si está **Bloqueado** (*Blocked*), **Abrir Ajustes** (*Open Settings*) lleva a la página del micrófono en Ajustes del Sistema. El audio queda en memoria solo mientras dictas y desaparece después de la transcripción: no se graba nada en disco ni se envía.

## Atajo

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> es el atajo por defecto en el Mac. En Windows y Linux, que están en versión preliminar, es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. Para cambiarlo, haz clic en **Cambiar** (*Change*) en la fila **Atajo** (*Shortcut*) y aprieta la combinación nueva; <kbd>Esc</kbd> desiste, y **Por defecto** (*Default*) vuelve a la original.

En el Mac, el atajo necesita <kbd>⌘</kbd> y una letra, un número o una tecla de función. En Windows y Linux, necesita <kbd>Ctrl</kbd> <kbd>Shift</kbd> y una tecla, porque <kbd>Ctrl</kbd> con una letra va a la terminal. Una combinación del sistema, como copiar o pegar, o una que Persisty o el mapa de teclas del editor ya usan, se rechaza, y la pantalla dice quién ya la usa. El atajo solo funciona con Persisty al frente, y **Dictar** (*Dictate*) aparece en **Configuración › Atajos** (*Settings › Shortcuts*) con el dictado encendido.

## Plan y límites

El dictado es del plan gratis. Funciona con Persisty al frente, en una terminal o en el editor, hasta 2 minutos cada vez. Los cambios de números y términos existen en portugués y en inglés.

En Windows y Linux, la pantalla no muestra el permiso del micrófono; si el micrófono no manda sonido, revisa la entrada en la configuración de sonido del sistema.
