---
title: Editor
description: Each session's editor, beside the terminal, with syntax highlighting, Markdown and image previews, suggestions and errors from the project, and the keymap you choose.
group: code
order: 1
---

The **Code** panel is the session's editor: its folder as a tree on the left, and the open files as tabs, beside the terminal. It opens from the **Code** icon, in the tool bar on the session's right edge. The tree, the tabs and each file's Git have pages of their own: [Files](/docs/files), [Tabs and groups](/docs/tabs-and-groups) and [Git in the editor](/docs/git-in-the-editor).

## Open and save

A click on a file in the tree opens it in a tab, and <kbd>⌘</kbd> <kbd>S</kbd> saves. To open a file by name, see [Open a file by name](/docs/search#open-a-file-by-name).

The bar under the code shows the file's path, the line and column, the language, the language server's state and the line ending, LF or CRLF. For a file that is not in the last commit, such as a new file or one outside a repository, it says **not in git**.

Text files open up to 5 MB, and images up to 10 MB. Other binary files do not open in the editor.

The font, the tab width, line wrapping, line numbers and the multi-cursor modifier are in [Settings › Editor](/docs/settings#editor), each with its default.

## Save automatically

**Save automatically**, in **Settings › Workspace**, is off by default. On, the editor saves 1 second after the last edit, never over a change made outside the editor, and closing a tab with changes saves it without asking.

Off, closing a tab with unsaved changes asks first, and **Discard** closes it without saving. When several tabs close at once, a single question offers **Save all** or **Discard all**.

## When the file changes on disk

While the app is in view, the editor checks the open files every 2 seconds. A tab with no changes reloads on its own, which is how the agent's edits show up in the editor.

If you had already changed the text, the tab warns you: "This file changed on disk after you started editing." **Reload** brings in the version on disk, and **Keep mine** saves yours over it.

## Syntax highlighting

Each language's highlighting loads when its first file opens, in the colours of the app's theme, light or dark. The language comes from the extension. To read a file as another language, such as a `.env` as Shell, use [Change the file type](/docs/files#change-the-file-type).

## Markdown and images

In a `.md` file, the eye button, on the tab bar, or <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> switches between the code and the preview, which already shows what you have not saved yet. The preview has tables, task lists and code blocks. A link to a website opens in the browser, a link to a file in the folder opens that file in the editor, and a `#` link goes to its heading.

Nothing loads in the preview: HTML shows as text, and an image from the web becomes a link that opens in the browser. Over 300,000 characters, a file is not previewed. In **Settings › Editor**, **Open .md files in** chooses how a `.md` opens: **Code**, the default, or **Preview**.

PNG, JPG, GIF, WebP, BMP and ICO images open in a tab, fitted to the panel, with their dimensions and file size; a click shows the image at its actual size, and another fits it again. An SVG opens as code and gets the same preview as Markdown, drawn as an image, running no script.

## Sticky scroll and minimap

**Sticky scroll**, in **Settings › Editor**, is off by default. On, the start of the function, class or heading you are in stays at the top of the editor, in up to 5 lines, and leaves once the line that closes the block reaches the top. A click on one of those lines takes you to it.

The **Minimap** draws the whole file in a strip to the right of the code; click or drag in it to move to another part. **Show the minimap** is off by default. On, it has **Drawing**, in **Characters** (the default) or **Blocks**, **Scale** from 1 to 3, **Visible area**, which marks the part on screen **Always** or **On hover** (the default), and **Hide until hovered**, off.

## Suggestions, documentation and errors

In TypeScript, JavaScript and Rust, the editor talks to the language server. Suggestions come from the project, with each one's type and documentation, and picking a function from another file writes the `import` for you. To ask for suggestions, use **Basic Completion**: <kbd>⌃</kbd> <kbd>Space</kbd> in every keymap, or <kbd>⌥</kbd> <kbd>Esc</kbd> on the Mac. By default macOS uses <kbd>⌃</kbd> <kbd>Space</kbd> to switch the keyboard; when it does, [**Settings › Shortcuts**](/docs/shortcuts) warns you and says where to turn it off.

Resting the pointer on a name shows its documentation, opening the `(` of a call shows its parameters, and errors are underlined. In Rust, `cargo check`'s errors refresh every time you save.

Files over 2 MB or 50,000 lines, and minified files, with one of the first 50 lines over 5,000 characters, stay away from the server: the status bar says "file too big for the server", and the file opens without suggestions or errors. The same file open in two groups gets suggestions and errors in one group only; see [Split the editor](/docs/tabs-and-groups#split-the-editor).

## The language server

When the language server is not on the computer, the app downloads it. That first download needs the internet; offline, the status bar says "no server: offline".

The status bar shows the server's state (downloading, indexing, ready or stopped) and how many errors and warnings the file has. A click there restarts the server or shows its log. A server with no tab of its language in view for 5 minutes stops on its own and comes back when you open one of its files. If it crashes, the app restarts it up to three times in a row; after that, it stays stopped until you restart it from the status bar.

## Go to Declaration

**Go to Declaration** works into other files too, and <kbd>⌘</kbd> + click on a name does the same. A definition in the standard library or in a dependency outside the project opens read-only, with a lock on the tab and "Outside the project · read-only" in the status bar: you can browse and read, but nothing is edited.

In Rust, the standard library needs its source in your toolchain (`rustup component add rust-src`); the app never changes the toolchain on its own.

## Accessibility

With **Reduce motion** on in the system's accessibility settings, the app drops its transitions; in the editor, the line numbers stay lined up with the code, and a search result goes to the right line. The tree, the tabs and the menus work from the keyboard, and a screen reader hears when a tab is unsaved, in preview or pinned.

## Keymap

In **Settings › Editor › Keymap**, pick **WebStorm** (the default), **WebStorm (macOS)** or **VS Code**. The keymap applies inside the code; its tab and Find Action keys work across the app, and in the terminal only the ones a shell doesn't use. Each key does the real action, and where the action does not apply, the key goes on to the app. **Settings › Shortcuts** lists every key of the chosen keymap and of Persisty, searchable, under the same names as the table below.

The keys of the two WebStorm keymaps on the Mac:

| Action | WebStorm | WebStorm (macOS) |
| --- | --- | --- |
| Go to Declaration | <kbd>⌘</kbd> <kbd>B</kbd> or <kbd>⌘</kbd> + click | <kbd>⌘</kbd> <kbd>B</kbd> or <kbd>⌘</kbd> + click |
| Parameter Info | <kbd>⌘</kbd> <kbd>P</kbd> | <kbd>⌘</kbd> <kbd>P</kbd> |
| Quick Documentation | <kbd>⌃</kbd> <kbd>J</kbd> | <kbd>F1</kbd> or <kbd>⌃</kbd> <kbd>J</kbd> |
| Back / Forward | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd>, or <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Next / Previous Highlighted Error | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> |
| Go to File | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Duplicate Line or Selection | <kbd>⌘</kbd> <kbd>D</kbd> | <kbd>⌘</kbd> <kbd>D</kbd> |
| Delete Line | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Go to Line | <kbd>⌘</kbd> <kbd>G</kbd> | <kbd>⌘</kbd> <kbd>L</kbd> |
| Move Caret to Code Block Start / End | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>]</kbd> |
| Move Statement Up / Down, with the comments above it | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Find Action | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

The VS Code keymap keeps its own keys, such as <kbd>F12</kbd> to go to the declaration and <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> to find an action. <kbd>⌘</kbd> <kbd>K</kbd> opens the palette, which also lists the editor's actions. In the VS Code keymap, with the cursor in the code, <kbd>⌘</kbd> <kbd>K</kbd> starts its two-part keys, such as <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, which comments the line; there, the editor's actions are on <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

On Windows and Linux, which are in preview, <kbd>Ctrl</kbd> and <kbd>Alt</kbd> stand in for <kbd>⌘</kbd> and <kbd>⌥</kbd>, and both WebStorm keymaps use the keys of the WebStorm column, with one difference: **Quick Documentation** is <kbd>Ctrl</kbd> <kbd>Q</kbd>.

## Plan and limits

The editor is on the free plan, with everything on this page.

Suggestions, documentation, errors and **Go to Declaration** exist only in TypeScript, JavaScript and Rust; in other languages, the editor has the highlighting. Each server's first download needs the internet. Text files over 5 MB and images over 10 MB do not open.
