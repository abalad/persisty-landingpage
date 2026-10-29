---
title: Política de privacidad
description: Qué datos guardan el sitio, la app y Persisty Cloud, dónde quedan, para qué y cómo pedir que se borren.
updated: 2026-10-29
---

Persisty se hizo para guardar lo mínimo. La app funciona sin cuenta y sin internet, y lo que haces en ella se queda en tu máquina.

## En la app

Los proyectos, las sesiones, el historial de la terminal, las notas y el uso de IA quedan en una base de datos local en tu computadora. Persisty no envía código, salida de la terminal ni prompts a ninguna parte y no tiene telemetría.

La app solo habla con afuera para:

- leer la cuota de Claude Code, con la credencial que Claude Code ya guarda;
- entrar a la cuenta de Persisty Cloud y renovar la licencia;
- hablar con GitHub, GitLab o Bitbucket, en las integraciones que conectes;
- clonar, buscar, traer y enviar commits en el remoto de tus repositorios git. Para mostrar lo que falta traer y enviar, la búsqueda también ocurre sola al abrir y cada 5 minutos con la app en pantalla;
- buscar versiones nuevas de la app (ver abajo).

Cada llamada aparece en **Configuración › Privacidad y red** (*Settings › Privacy & network*), con destino, motivo, tamaño y resultado.

### Búsqueda de versiones nuevas

Para saber si salió una versión nueva, la app descarga de GitHub un archivo público que solo dice cuál es la versión más reciente (`github.com/abalad/persisty-releases`). GitHub ve la dirección IP de tu computadora y, en el encabezado del pedido, la versión de la app. Ningún dato de tu cuenta ni de tus proyectos va con él.

La búsqueda ocurre al abrir la app, cada 6 horas con ella abierta y cuando haces clic en **Buscar actualizaciones** (*Check for updates*). Para apagar la búsqueda automática, usa **Configuración › Acerca de** (*Settings › About*); el botón sigue funcionando. Cuando pides instalar, la app descarga la versión nueva del mismo lugar.

## En el sitio

El sitio no usa analítica ni cookies de rastreo. Guarda dos tipos de cookie, los dos necesarios para que funcione:

- el idioma que elegiste;
- la sesión de tu cuenta, cuando entras.

El sitio está alojado en Vercel, que recibe los datos normales de cualquier visita a un sitio (dirección IP, navegador, página pedida).

## En la cuenta de Persisty Cloud

Cuando creas una cuenta, guardamos:

- tu e-mail y un nombre para mostrar tomado de él;
- tu organización personal y, si las hay, las organizaciones de equipo de las que formas parte;
- las computadoras conectadas: nombre, sistema, versión de la app y último acceso;
- tu plan y, cuando existan, los datos de la suscripción;
- las preferencias que marques, como el e-mail de versiones nuevas (y el idioma en que llega) y el interés en Enterprise.

Estos datos quedan en Supabase, en la región de São Paulo. Los usamos para mantener la cuenta, emitir la licencia y enviar los avisos que pediste. No vendemos datos ni los usamos para publicidad.

Cuando haya pagos, los procesará Stripe; Persisty no ve ni guarda datos de tarjeta.

## Tus derechos

Según la LGPD (la ley de protección de datos de Brasil), puedes pedir acceso a tus datos, su corrección o la eliminación de la cuenta. Al eliminar la cuenta, los datos personales se borran; solo quedan números agregados que no identifican a nadie.

{{contact}}

## Cambios

Si esta política cambia, la fecha de arriba cambia también, y los cambios que afecten lo que guardamos se avisan por e-mail a quien tiene cuenta.
