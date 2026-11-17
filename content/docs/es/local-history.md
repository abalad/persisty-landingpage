---
title: Historial local
description: Las versiones que el editor guarda de cada archivo, solo en esta computadora, para ver qué cambió, volver a una versión o a un fragmento y recuperar un archivo eliminado.
group: code
order: 6
---

El editor guarda las versiones de cada archivo de texto de la carpeta de la sesión, solo en esta computadora. Con ellas ves quién cambió un archivo y cuándo, lo comparas con el texto actual, vuelves a una versión entera o solo a un fragmento y recuperas un archivo eliminado, incluso uno que nunca entró en un commit.

## Qué se guarda

Entra una versión nueva cuando guardas, cuando un archivo abierto cambia fuera del editor, como en una edición del agente, y antes de que Persisty renombre, mueva, reemplace, elimine o descarte un archivo. También entra antes de que **Renombrar símbolo** (*Rename Symbol*), una acción de código o [**Reemplazar en archivos**](/docs/search#reemplazar-en-archivos) (*Replace in Files*) guarden un archivo cerrado. **Descartar** (*Discard*), al cerrar una pestaña, y **Recargar** (*Reload*) guardan antes el texto que no se había guardado.

Quedan fuera los archivos de más de 1 MB, los que no son texto y lo que está en `.git`, `node_modules`, `target`, `dist`, `build` y `.next`. El historial nunca sale de esta computadora. Eliminar un proyecto borra el historial de sus carpetas.

## Ver las versiones de un archivo

**Historial local › Mostrar historial** (*Local History › Show History*), en el menú del [árbol](/docs/files#favoritos-e-historial-local) o de la [pestaña](/docs/tabs-and-groups#el-menú-de-la-pestaña), abre una pestaña con las versiones del archivo, de la más nueva a la más antigua. Cada fila dice cuándo entró la versión y de dónde vino: **Tú, en el editor** (*You, in the editor*), **Fuera de Persisty** (*Outside Persisty*), **Al abrir** (*When opened*), o lo que Persisty iba a hacer, como **Antes de renombrar** (*Before renaming*) o **Texto sin guardar (Cerrar)** (*Unsaved text (Close)*). La lista trae también el **Último commit** (*Last commit*) del archivo y los [puntos de restauración](/docs/restore-points) de las sesiones que lo cambiaron. Las flechas recorren la lista, y el diff muestra la versión elegida frente al texto actual.

Un cambio hecho por un agente viene con el nombre de la sesión cuando Persisty recibe los eventos de ese agente, como con Claude Code. Sin esos eventos, como con Codex CLI por defecto, aparece como **Fuera de Persisty**.

## Volver a una versión o a un fragmento

**Volver a esta versión** (*Go back to this version*) reemplaza el archivo por la versión elegida. El texto actual se guarda antes, y un archivo que cambió en el disco mientras tanto no se sobrescribe: el aviso dice que no se sobrescribió nada. En una pestaña con cambios sin guardar, el editor pregunta antes y guarda esos cambios en el historial.

Cada fragmento cambiado del diff tiene **Revertir este fragmento** (*Revert this chunk*), que deshace solo ese fragmento y mantiene el resto del texto actual. **Fragmento siguiente** (*Next chunk*) y **Fragmento anterior** (*Previous chunk*) pasan de un fragmento a otro.

## Selección y etiquetas

Con líneas seleccionadas en el código, **Mostrar historial de la selección** (*Show History for Selection*), en el submenú de la pestaña o en la paleta, lista solo las versiones en las que cambiaron esas líneas, leyendo hasta las 200 versiones más nuevas.

**Poner etiqueta…** (*Put Label…*) marca un momento con el nombre que le des, y la etiqueta aparece entre las versiones. Vale para un archivo, para una carpeta o, desde el menú del espacio vacío del árbol, para el proyecto entero.

## Recuperar un archivo eliminado

En una carpeta, **Mostrar historial** lista lo que cambió dentro de ella en el plazo guardado, con cada archivo marcado como **Creado** (*Created*), **Cambiado** (*Changed*) o **Eliminado** (*Deleted*). Un clic en un archivo abre su historial, y **Recuperar** (*Recover*) trae de vuelta un archivo eliminado y lo abre. Si otro archivo ya tiene ese nombre, no se reemplaza nada.

## Plazo y espacio

En [**Configuración › Editor › Historial local**](/docs/settings#editor) (*Settings › Editor › Local history*), **Guardar por (días)** (*Keep for (days)*) viene en 5, de 1 a 30, y **Límite por carpeta (MB)** (*Limit per folder (MB)*) viene en 200, de 50 a 2.000. Pasado el límite, se borran las versiones más antiguas de la carpeta. **Borrar el historial local** (*Clear local history*) borra, después de confirmar, las versiones guardadas de todas las carpetas; los archivos en sí no cambian, y esto no se puede deshacer.

## Plan y límites

El historial local es del plan gratis.

Guarda solo archivos de texto de hasta 1 MB, dentro de la carpeta de la sesión; en una pestaña de fuera de la carpeta, el submenú dice "este archivo está fuera de la carpeta de la sesión" (*this file is outside the session folder*). Las acciones no tienen tecla en ningún mapa: están en los menús, en la paleta y en el grupo **Historial local** de [**Configuración › Atajos**](/docs/shortcuts#lista-completa) (*Settings › Shortcuts*).
