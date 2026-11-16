---
title: Política de privacidad
description: Qué datos guardan el sitio, la app y Persisty Cloud, dónde quedan, para qué y cómo pedir que se borren.
updated: 2026-11-16
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

Para saber si salió una versión nueva, la app descarga de GitHub un archivo público que solo dice cuál es la versión más reciente (`github.com/abalad/persisty-releases`). GitHub ve la dirección IP de tu computadora y el nombre del componente que hace la consulta; la versión de la app no va en el pedido. Ningún dato de tu cuenta ni de tus proyectos va con él.

La búsqueda ocurre al abrir la app, cada 6 horas con ella abierta y cuando haces clic en **Buscar actualizaciones** (*Check for updates*). Para apagar la búsqueda automática, usa **Configuración › Acerca de** (*Settings › About*); el botón sigue funcionando. Cuando pides instalar, la app descarga la versión nueva del mismo lugar.

## En el sitio

El sitio usa Google Analytics solo si aceptas en el aviso de cookies. Sin esa respuesta, o si rechazas, no se carga nada de Google.

Con tu aceptación, Google Analytics mide:

- las páginas vistas y de dónde vino la visita (el sitio anterior y la campaña, cuando la hay);
- dispositivo, navegador y región aproximada;
- cuatro acciones: descargar la app, crear una cuenta, empezar una suscripción y completar una suscripción.

La dirección de la página llega a Google sin los parámetros que podrían tener datos personales. Tu e-mail, tu nombre y lo que escribes nunca se envían. Google Analytics guarda las cookies `_ga` y `_ga_<id>` hasta 13 meses, y los datos quedan 14 meses en nuestra cuenta. Google trata estos datos como encargado, y pueden transferirse a Estados Unidos.

Para cambiar de opinión, usa **Cookies** en el pie de cualquier página. Si rechazas después de aceptar, el sitio deja de enviar datos y borra las cookies de Google.

Además, el sitio guarda tres cookies necesarias para que funcione:

- el idioma que elegiste;
- la sesión de tu cuenta, cuando entras;
- tu respuesta al aviso de cookies (`persisty_consent`, por 12 meses).

El sitio está alojado en Vercel, que recibe los datos normales de cualquier visita a un sitio (dirección IP, navegador, página pedida).

## En la cuenta de Persisty Cloud

Cuando creas una cuenta, guardamos:

- tu e-mail y un nombre para mostrar tomado de él;
- tu organización personal y, si las hay, las organizaciones de equipo de las que formas parte;
- las computadoras conectadas: nombre, sistema, versión de la app y último acceso;
- tu plan y, cuando existan, los datos de la suscripción;
- si cancelas un plan pago en Mi cuenta: el motivo que elijas, el texto que escribas (si escribes) y lo que hiciste con las ofertas para quedarte;
- las preferencias que marques, como el e-mail de versiones nuevas (y el idioma en que llega) y los intereses que registres.

Estos datos quedan en Supabase, en la región de São Paulo. Los usamos para mantener la cuenta, emitir la licencia, enviar los avisos que pediste y entender por qué las personas cancelan. No vendemos datos ni los usamos para publicidad.

Los pagos los procesa Stripe; Persisty no ve ni guarda datos de tarjeta.

## Tus derechos

Según la LGPD (la ley de protección de datos de Brasil), puedes pedir acceso a tus datos, su corrección o la eliminación de la cuenta. Al eliminar la cuenta, los datos personales se borran; solo quedan números agregados que no identifican a nadie.

{{contact}}

## Cambios

Si esta política cambia, la fecha de arriba cambia también, y los cambios que afecten lo que guardamos se avisan por e-mail a quien tiene cuenta.
