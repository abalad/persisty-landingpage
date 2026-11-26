---
title: Usos, renombrar y refactorizar
description: Buscar los usos de un nombre o de un archivo, ir a la implementación y al tipo, resaltar usos, renombrar en todos los archivos, correcciones rápidas, extraer, insertar en línea y mover a un archivo nuevo, reformatear, optimizar imports e inspeccionar código, con el servidor del lenguaje.
group: code
order: 3
---

Estas acciones le preguntan al servidor del lenguaje por el nombre del cursor y cambian el código con su respuesta. Hoy el servidor existe para TypeScript, JavaScript y Rust, y cada acción necesita un servidor en marcha que la ofrezca; sin él, la tecla pasa a la app. No se le pide nada al servidor mientras solo mueves el cursor, solo cuando pulsas la tecla o eliges la acción en la paleta. Las teclas del texto son las del mapa WebStorm en Mac, y las de cada mapa están en [Teclas](#teclas).

## Buscar usos

**Buscar usos** (*Find Usages*, <kbd>⌥</kbd> <kbd>F7</kbd>) lista dónde se usa el nombre del cursor, junto con su declaración, en la pestaña **Usos** (*Usages*) del [panel inferior](/docs/editor#panel-inferior). Los usos vienen por archivo, empezando por el archivo en el que estás, cada uno con la línea, la columna y el texto de la línea; un clic o <kbd>↵</kbd> abre el lugar. Con un solo uso, el editor va directo a él. Si el servidor no responde en 3 segundos, un aviso lo dice.

Con la lista a la vista, **Uso siguiente** (*Next Usage*) y **Uso anterior** (*Previous Usage*), con <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> y <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd>, abren un uso tras otro, y desde el último vuelven al primero. Sin la lista, las mismas teclas agregan un cursor abajo o arriba.

## Usos de un archivo

**Buscar usos** (*Find Usages*), en el menú de un archivo en el [árbol](/docs/files#usos-e-inspección) y en el [menú de la pestaña](/docs/tabs-and-groups#el-menú-de-la-pestaña), lista en la pestaña **Usos** los archivos que importan ese archivo, cada uno con la línea del import. En los mapas WebStorm, la tecla es la misma, <kbd>⌥</kbd> <kbd>F7</kbd>, con el foco en el árbol o en la pestaña; dentro del código, sigue buscando los usos del nombre del cursor.

En TypeScript, JavaScript y Rust, la lista viene del servidor del lenguaje. Cuando no responde, o todavía no conoce el archivo, el editor busca por texto lo que parece un import de la ruta del archivo, y el título dice "Usages of nombre (text search)". Esa búsqueda es aproximada: puede perder un import escrito de otra forma, como con un alias, o traer uno que no apunta al archivo.

## Implementación y tipo

**Ir a la implementación** (*Go to Implementation*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd>) lleva de una interfaz o de un miembro abstracto a donde se implementa. **Ir a la declaración del tipo** (*Go to Type Declaration*, <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd>) lleva a la declaración del tipo del valor del cursor. Con un solo destino, el editor va directo; con varios, aparecen en la pestaña **Usos**, bajo **Implementaciones de "nombre"** (*Implementations of "name"*) o **Tipos de "nombre"** (*Types of "name"*).

## Resaltar usos en el archivo

**Resaltar usos en el archivo** (*Highlight Usages in File*, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd>) marca todas las apariciones del nombre del cursor en el archivo. Los lugares que le dan un valor al nombre quedan un poco más marcados que las lecturas, y la barra de estado dice cuántos son, como "3 usos en este archivo" (*3 usages in this file*). Las marcas se van con <kbd>Esc</kbd>, al editar el texto o al pulsar la tecla de nuevo.

## Renombrar en todos los archivos

**Renombrar símbolo** (*Rename Symbol*, <kbd>⇧</kbd> <kbd>F6</kbd>) abre un campo pequeño sobre el nombre: escribe el nuevo y pulsa <kbd>↵</kbd>. El cambio vale en todos los archivos de la sesión. Las pestañas abiertas reciben el texto nuevo con deshacer, y los archivos cerrados se guardan si no cambiaron mientras el servidor respondía; antes, el editor guarda la versión anterior de cada uno en el [historial local](/docs/local-history). Un aviso dice en cuántos archivos cambió el nombre y cuáles quedaron fuera, con el motivo, como "cambió durante el pedido" (*changed during the request*).

Un renombrado que también crearía, renombraría o borraría archivos no se hace, y el aviso lo dice. En el árbol y en la pestaña, <kbd>⇧</kbd> <kbd>F6</kbd> sigue renombrando el archivo; mira [Renombrar, mover y copiar](/docs/files#renombrar-mover-y-copiar).

## Correcciones rápidas

**Mostrar correcciones rápidas y acciones** (*Show Quick Fixes and Actions*, <kbd>⌥</kbd> <kbd>↵</kbd>) abre, junto al cursor, una lista de lo que el servidor ofrece ahí, como corregir un error, refactorizar u organizar, con las preferidas arriba. Las flechas recorren la lista, <kbd>↵</kbd> aplica, y <kbd>Esc</kbd> la cierra y devuelve el foco al código. Editar, desplazarte o hacer clic fuera también la cierran, y un carácter escrito cierra la lista y entra en el código.

El cambio entra en el deshacer de la pestaña en un solo paso. La lista solo se abre cuando la pides, nunca con cada movimiento del cursor, y sin ninguna acción el aviso dice "Ninguna acción aquí" (*No actions here*).

## Extraer, insertar en línea y refactorizar

**Extraer variable** (*Extract Variable*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>), **Extraer constante** (*Extract Constant*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>C</kbd>), **Extraer función** (*Extract Function*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>M</kbd>) e **Insertar en línea** (*Inline*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd>) le piden al servidor las refactorizaciones de ese tipo en el cursor. Si solo una sirve, se ejecuta directo; si hay varias, se abre una lista con las pedidas arriba. **Refactorizar…** (*Refactor This…*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd>) lista todas las refactorizaciones que el servidor ofrece ahí.

Cada refactorización entra en un paso del deshacer, incluido lo que el servidor manda después, como al extraer una función en TypeScript. Sin ninguna, el aviso dice "Ninguna refactorización aquí" (*No refactorings here*); cuando solo hay refactorizaciones que no aplican, muestra el motivo.

En el código, con un servidor que tiene acciones de código, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> inserta en línea en lugar de abrir una sesión con el agente por defecto; sin él, la tecla pasa a la app.

## Mover a un archivo nuevo

En TypeScript y JavaScript, **Mostrar correcciones rápidas y acciones** y **Refactorizar…** ofrecen **Move to a new file**, con el nombre en inglés que le da el servidor, en una declaración del nivel superior del archivo o en una selección de ellas. El código sale de la pestaña y va a un archivo nuevo, que se abre en una pestaña. **Mover a un archivo…** (*Move to a file…*), que pide elegir el destino, todavía no existe.

Las demás acciones del servidor que crean, renombran o borran archivos también se aplican, siempre dentro de la carpeta del proyecto. Un archivo borrado va a la Papelera, un archivo sobrescrito deja la versión de antes en el [historial local](/docs/local-history), y las pestañas siguen al archivo renombrado o borrado.

## Reformatear y optimizar imports

**Reformatear código** (*Reformat Code*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd>) formatea el archivo, o solo la selección cuando la hay, con el ancho de tabulación y la sangría de la pestaña, en un paso del deshacer. Un servidor que solo formatea el archivo entero no cambia una selección, y el aviso lo explica; sin nada que cambiar, dice "Nada que formatear" (*Nothing to format*).

**Optimizar imports** (*Optimize Imports*, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>) le pide al servidor la acción que organiza los imports del archivo y aplica la primera, sin lista, en un paso del deshacer. Sin nada que hacer, el aviso dice "Nada que organizar" (*Nothing to organize*).

## Inspeccionar código

**Inspeccionar código** (*Inspect Code*) les pide a los servidores del lenguaje los problemas de varios archivos a la vez, abiertos o no. Está en el menú de un archivo, de una carpeta o de varios elementos seleccionados en el [árbol](/docs/files#usos-e-inspección), en el [menú de la pestaña](/docs/tabs-and-groups#el-menú-de-la-pestaña) y en la paleta, y no tiene tecla. En una carpeta, entran sus archivos de un lenguaje con servidor, hasta 2.000 por proyecto, contados como en la lista de **Abrir archivo**, sin los ocultos ni lo que ignora el `.gitignore`.

Los problemas aparecen en la pestaña **Problemas** del [panel inferior](/docs/editor#panel-inferior), en una sección **Inspección** (*Inspection*) aparte de la lista en vivo, por archivo y con los errores primero; un clic lleva a la línea. Mientras corre, la sección muestra el avance, como "20 of 45 files", y tiene **Cancelar** (*Cancel*), que guarda lo encontrado hasta ahí, y **Cerrar** (*Close*). El resultado es una foto del momento: no cambia mientras escribes y desaparece al cerrarlo.

Un archivo que el servidor no llegó a analizar queda fuera, y la sección dice cuántos y por qué: el servidor no estuvo listo a tiempo, se detuvo a mitad de camino o no pudo abrir el archivo. Esos archivos nunca aparecen como sin problemas. Como referencia, 200 archivos tardan unos 20 segundos con el servidor ya cargado.

## Teclas

Las teclas en Mac. Donde la tabla muestra —, el mapa no tiene tecla para la acción, y está en la paleta.

| Acción | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Buscar usos | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⇧</kbd> <kbd>F12</kbd> |
| Buscar usos de un archivo, en el árbol y en la pestaña | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⌥</kbd> <kbd>F7</kbd> | — |
| Uso siguiente / Uso anterior | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | — |
| Ir a la implementación | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Ir a la declaración del tipo | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd> o <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | — |
| Resaltar usos en el archivo | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | — |
| Renombrar símbolo | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>F2</kbd> |
| Mostrar correcciones rápidas y acciones | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌘</kbd> <kbd>.</kbd> |
| Extraer variable, constante, función | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | — |
| Insertar en línea | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | — |
| Refactorizar… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Reformatear código | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>F</kbd> o <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>F</kbd> |
| Optimizar imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |

**Inspeccionar código** no tiene tecla en ningún mapa. Las teclas del panel inferior están en [Panel inferior](/docs/editor#panel-inferior).

En Windows y Linux, que están en versión preliminar, <kbd>Ctrl</kbd> y <kbd>Alt</kbd> hacen el papel de <kbd>⌘</kbd> y <kbd>⌥</kbd>, y los dos mapas WebStorm usan las teclas de la columna WebStorm: **Refactorizar…** es <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd>, y **Optimizar imports**, <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>O</kbd>. En el mapa de VS Code, **Reformatear código** es <kbd>Shift</kbd> <kbd>Alt</kbd> <kbd>F</kbd> en Windows y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> en Linux, además de <kbd>Ctrl</kbd> <kbd>K</kbd> <kbd>Ctrl</kbd> <kbd>F</kbd> en los dos, y **Refactorizar…** es <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>. Con el servidor, esas teclas van antes que las de la app en el código; sin él, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> abre **Detalles** (*Details*), y <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>, **Restaurar todo** (*Restore all*).

## Plan y límites

Todo lo de esta página es del plan gratis.

Las acciones existen solo en TypeScript, JavaScript y Rust, con el servidor del lenguaje en marcha, y lo que ofrece cada una depende del servidor. Los cambios en archivos que pide una acción solo valen dentro de la carpeta del proyecto.

En **Move to a new file**, si el archivo nuevo cambia mientras el servidor responde, queda fuera, y el aviso dice "changed during the request"; el código sale igual de la pestaña de origen, y <kbd>⌘</kbd> <kbd>Z</kbd> en esa pestaña lo trae de vuelta. En Rust, <kbd>⇧</kbd> <kbd>F6</kbd> sobre el nombre de un `mod` en el código todavía no renombra el archivo del módulo; renombra el archivo en el [árbol](/docs/files#imports-al-renombrar-y-mover).

**Inspeccionar código** llega hasta 2.000 archivos por proyecto, solo en los lenguajes con servidor, y tarda más con el servidor todavía cargando el proyecto.
