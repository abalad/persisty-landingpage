---
title: Voice dictation
description: Speak and the text goes into the terminal or editor in focus, with the voice model running on your computer.
group: integrations
order: 5
---

With dictation on, you speak and the text goes into the terminal or [editor](/docs/editor) in focus, without pressing Enter. The transcription runs on your computer, and the audio never leaves it.

## Turn dictation on

In [**Settings › Voice**](/docs/settings#voice), turn on **Voice dictation**; it starts off. Before your first dictation, download the voice model: under **Voice model**, click **Download**, which shows the size, about 640 MB. The download comes from `huggingface.co` and only happens when you ask for it.

## Dictate

![With the api terminal in focus, Command, Shift and D start dictating and the indicator shows Listening; the same key stops, the indicator turns to Transcribing…, and the text lands in the prompt with the notice Inserted into terminal api.](/docs-media/voice/voz.mp4)

Click the terminal or editor that should get the text and press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. The indicator at the bottom of the window shows **Listening**. Speak and press the same key again: the indicator changes to **Transcribing…** and then says where the text went, such as "Inserted into terminal api". <kbd>Esc</kbd> cancels.

The text goes where the focus was when you started, even if you click elsewhere. In a terminal, it is typed as if by you, without Enter: in an agent, it sits in the prompt waiting for you to send it. In the editor, it goes in at the cursor. A read-only file, or one covered by the Markdown preview, takes no dictation. If the terminal or the file closes first, nothing is inserted, and **Copy text** copies what was transcribed.

A dictation lasts up to 2 minutes. In the last 10 seconds, the indicator counts down, and at the end the text goes in on its own. If Persisty loses focus, the dictation is cancelled. When something fails, the indicator says why, such as "No microphone found." or "I heard nothing." While you speak, the [mascot](/docs/mascot#in-the-terminal) of the terminal that will get the text holds a microphone.

## Language and replacements

**Dictation language** starts at **Same as the app** and can also be **Português (Brasil)** or **English**. The model understands both languages; the choice decides how numbers and terms become text. Spoken numbers become digits, "main dot rs" becomes `main.rs`, "dash dash release" becomes `--release`, "underscore" joins words with `_`, "at sign" becomes `@`, and "slash" at the start becomes a command, such as `/compact`.

Under **Replacements**, **Your replacements** takes one rule per line, in the form `spoken => Replacement`; a line starting with `#` is a comment. Your rules apply before Persisty's own. There can be up to 200 rules, of up to 200 characters each. **Try it** shows what a typed sentence becomes, as if it had been spoken.

## Voice model

The model is Parakeet TDT 0.6B v3, by NVIDIA (CC BY 4.0 licence), converted by the sherpa-onnx project. It comes from `huggingface.co`, is checked by sha256 and shows in the log in [Privacy and network](/docs/privacy-and-network). Before you download, the row shows the free space on the disk.

During the download, the row shows the progress and **Cancel**, then **Checking the files…**. An interrupted download is **Incomplete**, with **Resume**, which fetches only what is missing, and **Start over**. Once the model is ready, the row shows its size on disk and **Delete**, which asks first; without the model, dictation stops until you download it again. If the files do not match, the row says **Damaged** and offers **Download again**. The model lives in Persisty's data folder.

## Microphone

Persisty uses the system's default input, shown under **Input**. On the Mac, macOS asks for permission on the first dictation; if it is **Blocked**, **Open Settings** takes you to the microphone page in System Settings. The audio stays in memory only while you dictate and is gone after the transcription: nothing is written to disk or sent.

## Shortcut

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> is the default on the Mac. On Windows and Linux, which are in preview, it is <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. To change it, click **Change** on the **Shortcut** row and press the new combination; <kbd>Esc</kbd> gives up, and **Default** puts the original back.

On the Mac, the shortcut needs <kbd>⌘</kbd> and a letter, a number or a function key. On Windows and Linux, it needs <kbd>Ctrl</kbd> <kbd>Shift</kbd> and a key, because <kbd>Ctrl</kbd> with a letter goes to the terminal. A system combination, such as copy or paste, or one Persisty or the editor's keymap already uses, is refused, and the screen says what already uses it. The shortcut only works while Persisty is in front, and **Dictate** shows in **Settings › Shortcuts** while dictation is on.

## Plan and limits

Dictation is on the free plan. It works while Persisty is in front, in a terminal or the editor, for up to 2 minutes at a time. The number and term replacements exist in Portuguese and English.

On Windows and Linux, the screen does not show the microphone permission; if the microphone sends no sound, check the input in the system's sound settings.
