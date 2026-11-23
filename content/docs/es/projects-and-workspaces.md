---
title: Proyectos y workspaces
description: Cómo organiza Persisty productos y carpetas, y cómo crear, ajustar, ordenar, archivar y eliminar proyectos y workspaces.
group: start
order: 2
---

Persisty organiza el trabajo en tres niveles, del mayor al menor.

| Nivel | Qué es | Dónde aparece |
| --- | --- | --- |
| Proyecto | Un producto, cliente o negocio tuyo | Barra de proyectos, a la izquierda |
| Workspace | Una carpeta de ese proyecto, con o sin git | Tarjetas en la franja de abajo |
| Sesión | Una terminal: un agente o un shell | Pestañas arriba |

Las sesiones tienen su propia página, [Sesiones y terminales](/docs/sessions). Los proyectos y los workspaces son del plan gratuito.

## Barra de proyectos

![Cambio de la pestaña de la sesión api a web, después al workspace atlas-site en la lista de workspaces y, por último, del proyecto Atlas a Nimbus en la barra de proyectos de la izquierda.](/docs-media/projects-and-workspaces/projetos.mp4)

Cada proyecto es un bloque con las dos primeras letras del nombre. Un punto en la esquina del bloque dice cómo está el proyecto: amarillo cuando un agente terminó y te espera o pide permiso, azul cuando un agente está trabajando, verde cuando hay sesiones corriendo, y un anillo hueco cuando hay sesiones por restaurar. El punto muestra lo más urgente, y al pasar el puntero dice lo mismo en palabras, como "2 waiting for you".

Presiona <kbd>⌘</kbd> <kbd>B</kbd> para expandir la barra. Expandida, muestra el nombre y el estado de cada proyecto y la lista de **Agentes** (*Agents*), con el estado y el workspace de cada uno; el filtro alterna entre **Proyecto** (*Project*) y **Todos** (*All*). Cambia de proyecto con <kbd>⌘</kbd> <kbd>1</kbd> a <kbd>⌘</kbd> <kbd>9</kbd>. En Windows y Linux, que están en versión preliminar, usa <kbd>Ctrl</kbd> en lugar de <kbd>⌘</kbd>.

Para crear un proyecto, usa el **+** de la barra. En **Nuevo proyecto** (*New project*), ponle un **Nombre** (*Name*) y, si quieres, una **Descripción** (*Description*), y haz clic en **Crear proyecto** (*Create project*). El **Identificador** (*Identifier*) sale del nombre y no cambia después.

## Ajustes del proyecto

Con el clic derecho en un proyecto abres **Ajustes del proyecto** (*Project settings*) o **Datos del proyecto** (*Project data*), dos partes de la misma ventana.

En **General** están el nombre, la descripción y el ícono, que puede ser otras iniciales (hasta dos caracteres), un símbolo de la lista o una imagen PNG, JPG, WebP o SVG de hasta 5 MB; esos cambios valen cuando haces clic en **Guardar** (*Save*). Ahí también están la **Cuenta de Claude** (*Claude account*) del proyecto, que es [Pro](/docs/pro) (mira [Cuentas de IA y rotación](/docs/ai-accounts)), y **Archivar proyecto** (*Archive project*).

**Visión general** (*Overview*) muestra los números del proyecto, como workspaces, sesiones activas y sesiones por restaurar, y el [gasto estimado en IA](/docs/usage-and-quota) del mes, con **Abrir uso detallado** (*Open detailed usage*). **Workspaces** y **Sesiones** (*Sessions*) listan las carpetas y las terminales del proyecto. **Tareas** (*Tasks*) elige de dónde vienen las [issues](/docs/issues#vincular-al-proyecto) para empezar sesiones, y **Servidores MCP** (*MCP servers*), qué [servidores MCP](/docs/mcp-servers#encender-en-un-proyecto) reciben las sesiones de agente del proyecto.

## Archivar y eliminar proyectos

**Archivar proyecto**, en **Ajustes del proyecto**, saca el proyecto de la barra lateral; las sesiones y los workspaces siguen registrados. Si hay sesiones abiertas, eliges entre **Archivar y mantener abiertas** (*Archive and keep open*) y **Terminar y archivar** (*End and archive*).

Los archivados quedan en **Proyectos archivados** (*Archived projects*), que se abre desde el contador debajo de la lista de proyectos, con la barra expandida, o desde la paleta (<kbd>⌘</kbd> <kbd>K</kbd>), cuando hay alguno. Ahí, **Restaurar** (*Restore*) devuelve el proyecto a la barra, con sus workspaces y sesiones. En la paleta, elegir un proyecto archivado también lo restaura y lo abre.

Solo se puede eliminar un proyecto archivado: **Eliminar** (*Delete*), en su línea de **Proyectos archivados**, saca el proyecto de Persisty para siempre, con sus sesiones, workspaces y comandos, y termina las sesiones que sigan en marcha. Al eliminar, Persisty pregunta qué hacer con las carpetas: **Eliminar solo de Persisty** (*Delete from Persisty only*) deja todo en tu computadora, y **Eliminar y borrar las carpetas** (*Delete and remove the folders*) muestra cuáles van a la Papelera antes de confirmar. Una carpeta que usa otro proyecto, tu carpeta personal, la raíz del disco y los datos de Persisty se quedan donde están.

## Workspaces

Cada tarjeta de la franja de abajo es una carpeta del proyecto. Cuando la carpeta es un repositorio git, la tarjeta muestra la rama y cuántos archivos cambiaron. Dentro de la tarjeta aparecen hasta tres sesiones de ese workspace, cada una con su estado en palabras, y un clic en una de ellas la abre. El pie de la tarjeta dice cuántas sesiones están activas y hace cuánto hubo actividad.

Un workspace sin sesiones muestra la ruta de la carpeta y los atajos para abrir una; mira [Nueva sesión](/docs/sessions#nueva-sesión). Cada workspace tiene también sus [comandos](/docs/commands), en el selector junto a las pestañas.

La tarjeta **Sueltas** (*Standalone*) guarda las sesiones que no pertenecen a ningún workspace, abiertas en cualquier carpeta, y aparece cuando hay alguna o cuando el proyecto todavía no tiene workspaces. <kbd>⌘</kbd> <kbd>J</kbd> contrae la franja a íconos cuando quieres más espacio para la terminal.

Para sacar un workspace del proyecto, usa **Quitar del proyecto** (*Remove from project*) en el panel **Detalles** (*Details*), o **Quitar workspace** (*Remove workspace*) en la pantalla de un workspace sin sesiones. Los archivos de la carpeta no cambian.

## Agregar workspace

La tarjeta **Agregar workspace** (*Add workspace*), al final de la franja, abre la ventana del mismo nombre con dos orígenes: **Carpeta de la computadora** (*Folder on this computer*) y **Repositorio remoto** (*Remote repository*). En un proyecto todavía vacío, la pantalla del proyecto también acepta una carpeta arrastrada desde el Finder; ahí, <kbd>1</kbd> elige una carpeta, <kbd>4</kbd> va directo al repositorio remoto, y <kbd>2</kbd> y <kbd>3</kbd> abren la **Nueva sesión** para una terminal o un agente sueltos.

Con **Carpeta de la computadora**, escribe la ruta completa o haz clic en **Elegir carpeta…** (*Choose folder…*). En Windows, la ruta empieza por la letra del disco, como `C:\`. Persisty lee la carpeta y muestra lo que encontró: **Repositorio git** (*Git repository*) o **Carpeta común** (*Plain folder*), la rama y el remoto. El **Nombre** es lo que muestran las tarjetas y las pestañas, y **Agregar workspace** termina.

## Clonar un repositorio

![En Agregar workspace, Repositorio remoto lista los repositorios de la cuenta conectada; elegido atlas-landing, aparecen el repositorio, el branch predeterminado y la carpeta de destino, y Clonar y agregar lo descarga y abre el workspace nuevo.](/docs-media/projects-and-workspaces/workspace-remoto.mp4)

Con **Repositorio remoto**, pega el enlace del repositorio; cualquier dirección git funciona. Sin cuenta conectada, el campo se llama **Enlace** (*Link*), y **Tus repositorios** (*Your repositories*) ofrece conectar GitHub o GitLab ahí mismo; Bitbucket y el GitLab de una empresa están en [**Configuración › Integraciones**](/docs/settings#integraciones) (*Settings › Integrations*); mira [GitHub, GitLab y Bitbucket](/docs/forges). Con una cuenta conectada, el campo pasa a ser **Enlace o búsqueda** (*Link or search*) y lista tus repositorios, con un filtro por servicio, y también se pueden clonar los privados.

Persisty muestra el repositorio, la rama por defecto y la cuenta que lo va a clonar. El destino sugerido queda junto al último workspace del proyecto. En un proyecto sin workspaces, es la **Carpeta por defecto para clones** (*Default folder for clones*), que viene como `~/Documents/GitHub` y se cambia en **Configuración › Integraciones**. Si la carpeta de destino ya tiene ese repositorio, solo se agrega; si tiene otra cosa, cambia el nombre o el lugar.

**Clonar y agregar** (*Clone and add*) descarga el repositorio y muestra el avance, fase por fase. **Cancelar** (*Cancel*), o cerrar la ventana, interrumpe el clon. Al final, la carpeta se convierte en un workspace del proyecto. Clonar usa el git de tu computadora; sin él, Persisty pide que instales git.

## Cambiar el orden

Los proyectos, los workspaces y las pestañas de sesión quedan en el orden en que los dejas. Arrastra para cambiarlo, o usa el teclado con el elemento en foco: <kbd>⌥</kbd> <kbd>↑</kbd> y <kbd>⌥</kbd> <kbd>↓</kbd> en la barra de proyectos, <kbd>⌥</kbd> <kbd>←</kbd> y <kbd>⌥</kbd> <kbd>→</kbd> en las tarjetas de workspace y en las pestañas. El clic derecho en una pestaña también tiene **Mover a la izquierda** (*Move left*) y **Mover a la derecha** (*Move right*). Mientras arrastras, <kbd>Esc</kbd> devuelve el elemento a su lugar. La tarjeta **Sueltas** queda siempre al final.
