---
title: Actualizaciones
description: Cómo Persisty busca e instala versiones nuevas, qué pasa con las sesiones abiertas y dónde descargar cada versión.
group: account
order: 4
---

Persisty busca versiones nuevas solo e instala la nueva cuando haces clic. La búsqueda y la descarga vienen del repositorio de versiones de Persisty en GitHub, y cada una aparece en [Privacidad y red](/docs/privacy-and-network).

## Actualizar en la app

La búsqueda automática corre medio minuto después de que la app se abre y, después, cada 6 horas mientras sigue abierta. Cuando hay una versión nueva, aparece un aviso en la esquina de abajo a la derecha con su número, como "Persisty 0.13.0 disponible", y la versión que usas. **Novedades** (*What's new*) abre en el navegador lo que cambió en esa versión. **Instalar y reiniciar** (*Install and restart*) descarga la actualización mostrando el progreso, verifica la firma del archivo, la instala y abre Persisty en la versión nueva.

Para buscar en el momento, haz clic en **Buscar actualizaciones** (*Check for updates*) en [**Configuración › Acerca de**](/docs/settings#acerca-de) (*Settings › About*). La fila pasa a decir "Buscando…" (*Checking…*) y después "Estás en la versión más reciente" (*You're on the newest version*) o la versión nueva, con **Instalar y reiniciar** al lado. Si no se puede buscar, dice "No se pudo buscar ahora" (*Couldn't check right now*). La búsqueda automática que falla no muestra nada y lo intenta de nuevo la próxima vez.

El botón de cerrar del aviso, **Omitir esta versión** (*Skip this version*), oculta el aviso de esa versión; el de la siguiente aparece como siempre. La versión omitida sigue en **Configuración › Acerca de**, para instalarla cuando quieras.

Si la descarga pasa 30 segundos sin recibir nada, se rinde. Cuando la instalación falla, el aviso muestra **No se pudo instalar:** (*Couldn't install:*) con el motivo y cambia el botón por **Descargar** (*Download*), que abre la [página de descarga](/download).

## Las sesiones abiertas

En Mac, la app instala y reinicia sin preguntar nada, y los procesos de las sesiones abiertas no se terminan: al abrirse, Persisty vuelve a conectar la terminal de cada una a su proceso, como en [Volver después de un cuelgue](/docs/sessions-and-recovery#al-abrir-persisty).

En Windows y Linux, que están en versión preliminar, instalar puede terminar las sesiones abiertas. Con alguna abierta, la app pregunta antes: **¿Instalar la nueva versión ahora?** (*Install the new version now?*) dice cuántas sesiones pueden terminarse, e **Instalar de todos modos** (*Install anyway*) sigue adelante. Al abrirse, las que terminaron vuelven según la [regla de cada una](/docs/sessions-and-recovery#cuándo-relanzar).

## Apagar la búsqueda automática

**Buscar actualizaciones automáticamente** (*Check for updates automatically*), en **Configuración › Acerca de**, viene encendido. Apagado, la app solo busca cuando haces clic en **Buscar actualizaciones**. Cada búsqueda y cada descarga aparecen en el [registro de red](/docs/privacy-and-network#registro-de-red), con una línea por cada servidor por el que pasaron.

## Windows y Linux

Windows y Linux están en versión preliminar: la app sale sin firma y todavía no se probó en máquinas reales. En Windows, el instalador de la actualización corre sin hacer preguntas y cierra Persisty solo para reemplazar los archivos.

En Linux, solo el AppImage se actualiza desde la app. Instalada con el paquete `.deb`, el aviso y **Configuración › Acerca de** muestran **Descargar** en lugar de **Instalar y reiniciar**, y la versión nueva viene de la página de descarga. El `.deb` se instala junto a los programas que el sistema ya tiene, sin choque de nombres.

## Descargar

La [página de descarga](/download) ofrece la versión más reciente de cada sistema: en Mac, un DMG universal, para Apple Silicon e Intel, firmado y notarizado por Apple; en Windows, un instalador `.exe` (x64); en Linux, el AppImage y el paquete `.deb` (x64).

[Todas las versiones](/download/versions) lista cada versión, de la más nueva a la más antigua, con la fecha, el tamaño y el SHA-256 de cada archivo. Para comprobar una descarga, compara su SHA-256 con lo que muestra `shasum -a 256 nombre-del-archivo` en Mac y Linux, o `Get-FileHash nombre-del-archivo` en PowerShell de Windows.

## Novedades y aviso por e-mail

El [changelog](/changelog) dice lo que cambió en cada versión y tiene un feed RSS en cada idioma. En **Configuración › Acerca de**, **Abrir** (*Open*), en la fila **Novedades**, abre esa página. Para recibir un e-mail cuando salga una versión nueva, actívalo en [Mi cuenta](/account), en **Avisos de versión**.

## Plan y límites

Actualizar es del plan gratis y no pide cuenta. La búsqueda y la instalación solo ocurren con Persisty abierto, y nada se instala hasta que haces clic. La app pide macOS 12 o más nuevo; se probó en Apple Silicon y en Intel debería funcionar.
