---
title: GitHub, GitLab y Bitbucket
description: Conecta tus cuentas para listar y clonar repositorios, también los privados, y traer las issues de GitHub.
group: integrations
order: 2
---

En [**Configuración › Integraciones**](/docs/settings#integraciones) (*Settings › Integrations*), conectas cuentas de GitHub, de GitLab (gitlab.com o el de tu empresa) y de Bitbucket Cloud. Con una cuenta conectada, [**Agregar workspace**](/docs/projects-and-workspaces#agregar-workspace) (*Add workspace*) lista tus repositorios y clona los privados.

## Conectar cuentas

La pantalla **Integraciones** muestra primero las **Conectadas** (*Connected*), con la cuenta de cada una, y después las **Disponibles** (*Available*). Haz clic en un servicio para abrir su página: **Conectar cuenta** (*Connect account*) hace la primera conexión, y **Agregar cuenta** (*Add account*), las siguientes. Cada servicio acepta varias cuentas, y cada cuenta muestra la dirección, si entró **por código** (*by code*) o **por token** (*by token*) y desde cuándo.

Persisty guarda las cuentas y sus tokens en el almacén de contraseñas del sistema; en el Mac, es el elemento `Persisty Integrations` del Keychain. **Desconectar** (*Disconnect*) hace que Persisty olvide la cuenta, pero no revoca el acceso en el servicio. El enlace al pie de cada página te lleva adonde lo revocas: las apps autorizadas en GitHub y en gitlab.com, o los tokens en Atlassian. Con un GitLab de empresa, ese enlace también abre gitlab.com; borra el token en la página de tokens de tu GitLab.

## GitHub

**Conectar cuenta** abre **Conectar a GitHub** (*Connect to GitHub*) con un código. Haz clic en **Abrir GitHub** (*Open GitHub*), entra en la cuenta que quieres conectar, confirma el código y autoriza a Persisty. La ventana espera la confirmación y se cierra sola; Persisty nunca ve tu contraseña. El acceso que pide, `repo` y `read:org`, cubre tus repositorios, también los privados y los de tus organizaciones, e incluye escritura: Persisty lo usa para listar y clonar y, al [concluir una issue](/docs/issues#concluir), para comentarla y cerrarla. Si los de una organización no aparecen, ella tiene que aprobar a Persisty.

## GitLab

**¿Dónde está tu cuenta?** (*Where is your account?*) ofrece dos caminos. Con **gitlab.com**, **Continuar en el navegador** (*Continue in the browser*) muestra un código para confirmar en gitlab.com, como en GitHub. Con **GitLab de la empresa** (*Company GitLab*), escribe la **Dirección de GitLab** (*GitLab address*), como `gitlab.empresa.com`, y haz clic en **Crear token en GitLab** (*Create token on GitLab*): la página se abre con el nombre y los scopes `read_api` y `read_repository` ya marcados. Elige la validez, crea el token, pégalo en **Pega el token** (*Paste the token*) y haz clic en **Conectar** (*Connect*). GitLab muestra el token una sola vez.

## Bitbucket

Bitbucket Cloud se conecta con un token de API de Atlassian. **Abrir tokens de Atlassian** (*Open Atlassian tokens*) te lleva a la página; elige Create API token with scopes, selecciona Bitbucket y marca `read:user` y `read:repository`. De vuelta en Persisty, escribe el **E-mail de la cuenta de Atlassian** (*Atlassian account e-mail*), pega el token y haz clic en **Conectar**.

## Qué hacen las cuentas

En **Agregar workspace**, con **Repositorio remoto** (*Remote repository*), el campo pasa a ser **Enlace o búsqueda** (*Link or search*) y lista los repositorios de las cuentas conectadas, con un filtro por servicio; los pasos están en [Clonar un repositorio](/docs/projects-and-workspaces#clonar-un-repositorio). Un enlace pegado se consulta con las cuentas de ese servicio, una por una, hasta que una ve el repositorio; sin cuenta de ese servicio, se consulta sin iniciar sesión, y solo aparece un repositorio público. El clon lo hace git, directo con el servicio: por HTTPS, con el token de esa cuenta, solo en su dirección; por SSH, con tus propias claves.

La cuenta de GitHub también trae las issues de tus repositorios, para [empezar sesiones desde ellas](/docs/issues), y sirve al servidor MCP de GitHub; mira [Servidores MCP](/docs/mcp-servers).

## Carpeta de los clones

Al final de la pantalla **Integraciones**, **Clonación › Carpeta por defecto para clones** (*Cloning › Default folder for clones*) dice adónde va el clon cuando el proyecto todavía no tiene workspaces. La carpeta por defecto es `~/Documents/GitHub`, y **Elegir…** (*Choose…*) la cambia. En un proyecto con workspaces, el clon va junto a ellos. La misma carpeta vale para los tres servicios.

## Abrir en la forja

En el árbol de archivos y en la pestaña, el menú **Abrir en** (*Open in*) tiene **Abrir en GitHub** (*Open on GitHub*), o en GitLab o Bitbucket, que abre la página del archivo, y **Copiar ruta** (*Copy path*) tiene **Enlace en GitHub** (*Link on GitHub*), que copia su dirección. La tarjeta del [autor de la línea](/docs/git-in-the-editor#autor-de-la-línea) tiene **Abrir en la forja** (*Open on the forge*). Estos enlaces salen del remoto git de la carpeta y no necesitan una cuenta conectada. Funcionan en github.com, gitlab.com y bitbucket.org; con un GitLab de empresa, el elemento queda deshabilitado y dice "no remote on a known forge". Mira [Abrir en](/docs/files#abrir-en) y [Copiar ruta](/docs/files#copiar-ruta).

## Plan y límites

Las integraciones con GitHub, GitLab y Bitbucket son del plan gratis. El código en el navegador vale para GitHub y gitlab.com; el GitLab de empresa y Bitbucket entran por token. De Bitbucket, solo Bitbucket Cloud. De los tres, solo GitHub trae issues.

Cada llamada hecha con las cuentas aparece en [Privacidad y red](/docs/privacy-and-network); los clones aparecen como `GIT`.
