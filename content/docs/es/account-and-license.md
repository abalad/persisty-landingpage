---
title: Cuenta y licencia
description: Para qué sirve la cuenta de Persisty, cómo entrar, qué muestra Configuración › Cuenta y cómo funciona la licencia sin conexión en hasta 5 computadoras.
group: account
order: 2
---

El plan gratis no pide cuenta. La cuenta de Persisty Cloud sirve para los planes pagos y para los [avisos de versión](/docs/updates#novedades-y-aviso-por-e-mail) que pidas: entrar con ella en la app trae a esta computadora la licencia de tu plan.

## Entrar

![En el pie de Configuración, Entrar pide el e-mail, y Continuar con e-mail envía el código de 8 dígitos; con el último dígito, la app entra sola y muestra la Cuenta, con el e-mail, el plan, la licencia y los recursos del plan.](/docs-media/account-and-license/entrar.mp4)

Sin cuenta, el pie de [**Configuración**](/docs/settings#cuenta) (*Settings*) muestra **Entrar** (*Sign in*) y **Crear cuenta gratis** (*Create free account*). Los dos abren la misma ventana, en dos pasos. En el primero, escribe tu e-mail y haz clic en **Continuar con e-mail** (*Continue with e-mail*). En el segundo, escribe el código de 8 dígitos que llegó por e-mail; con el último dígito, la app entra sola. El código vale por 10 minutos y una sola vez. La cuenta se crea en el primer acceso, sin contraseña.

Si el código no llega, **Reenviar código** (*Resend code*) manda otro después de 60 segundos, y **Usar otro e-mail** (*Use another e-mail*) vuelve al primer paso. Si ya tienes un código, **Escribir código** (*Enter code*) lleva directo al segundo paso: pedir uno nuevo anularía el que llegó.

La sesión de la cuenta queda en el almacén de contraseñas del sistema: el Keychain en macOS y, en las versiones preliminares, el Administrador de credenciales en Windows y el Secret Service en Linux. Con la cuenta conectada, el pie de Configuración muestra el e-mail, el plan y **Administrar cuenta** (*Manage account*), que abre **Configuración › Cuenta** (*Settings › Account*). Esa pestaña solo existe con la cuenta conectada.

## Plan y recursos

**Configuración › Cuenta** muestra el **E-mail**, el **Plan** (gratis, Pro o Team), la **Licencia** (*License*) y los **Recursos del plan** (*Plan features*), cada función paga en una etiqueta; en el plan gratis, **Ningún recurso pago** (*No paid features*). Lo que desbloquea cada etiqueta está en [Planes y funciones Pro](/docs/pro).

En el plan gratis, la fila **Suscripción** (*Subscription*) tiene **Ver planes** (*See plans*), que abre los precios en el sitio. Abajo, **Actualizar licencia** (*Refresh license*) busca la licencia en el momento, y **Salir de la cuenta** (*Sign out*) cierra la sesión de la cuenta en esta computadora, que vuelve al plan gratis.

## Licencia

Las funciones pagas vienen de una licencia firmada, que la app verifica sola, sin internet. La fila **Licencia** muestra **válida** (*valid*) y "Funciona sin internet hasta" (*Works offline until*), con la fecha.

La licencia vale 14 días. Con la cuenta conectada y la app abierta, Persisty pide una nueva al abrirse y cada 6 horas; sin internet, la guardada sigue valiendo hasta vencer. Si vence o no coincide, la fila muestra **atención** (*attention*) y el motivo, y las funciones pagas se detienen hasta que llegue otra: conéctate y haz clic en **Actualizar licencia**.

## Computadoras

Una cuenta vale en hasta 5 computadoras. Una computadora entra en la lista de la cuenta la primera vez que entras en ella desde la app, con el nombre que tiene en el sistema. En una sexta, la cuenta entra, pero la licencia no llega, y **Actualizar licencia** dice que la cuenta ya está en 5 computadoras. Quita una en [Mi cuenta](/account/devices) y actualiza de nuevo.

Una computadora quitada en el sitio sale de la cuenta en la próxima renovación de la licencia, y la app dice "This computer was signed out from the account. Sign in again." Para volver a usarla, basta con entrar en ella otra vez. **Salir de la cuenta** no libera el lugar: la computadora sigue en la lista hasta que la quites.

Después de que sales, otra cuenta de Persisty puede entrar en la misma computadora, que pasa a contar también entre las 5 de esa cuenta.

## Cuenta en el sitio

En el sitio, [Entrar](/sign-in) usa el mismo código por e-mail. En [Mi cuenta](/account) ves el plan, gestionas la suscripción a través de Stripe, invitas a tu equipo, quitas computadoras y activas el e-mail que avisa cuando sale una versión nueva.

## Plan y límites

Crear la cuenta es gratis. Una cuenta cubre hasta 5 computadoras, y la licencia vale 14 días sin internet. Si el almacén de contraseñas del sistema no está disponible, la sesión de la cuenta dura solo hasta que cierras la app, y hay que entrar de nuevo al reabrirla.
