# Installing tabby-backspace-mode (Windows, Tabby 1.0.238)

## Install

1. Close Tabby completely (including the tray icon).
2. Open the plugins folder: `%APPDATA%\tabby\plugins`
   (the button name in Settings > Plugins was not checked against the Tabby source).
   Portable Tabby: `data\plugins` next to the executable.
3. Unzip `tabby-backspace-mode-0.1.1-windows.zip` into that folder. The result must be:
   ```
   plugins\node_modules\tabby-backspace-mode\package.json
   plugins\node_modules\tabby-backspace-mode\dist\index.js
   ```
   Tabby loads folders in `plugins\node_modules` named `tabby-*` whose `package.json`
   has the `tabby-plugin` keyword.
4. Start Tabby. Edit a local profile; **Backspace key mode** is on the **Input** tab.
   If the plugin does not show up in Settings > Plugins, check that `package.json` contains an `author` field.

## Uninstall

1. Close Tabby.
2. Delete `%APPDATA%\tabby\plugins\node_modules\tabby-backspace-mode`.
3. Start Tabby. Leftover `options.input` keys in `config.yaml` are harmless.

## Check after install

- The option is visible in a local profile and in *Defaults for Local terminal*.
- In WSL run `cat -v`, press Backspace: Pass-through/Ctrl-? shows `^?`, Ctrl-H shows `^H`,
  Delete shows `^[[3~`.
- An SSH profile behaves as before.

## If it has no effect in a profile

Open DevTools in Tabby (Ctrl+Shift+I), Console tab, then open a new tab of that profile.
`[tabby-backspace-mode] attached, mode: ...` means the plugin is wired to that session and
shows the mode it read. Test **Delete (CSI 3~)** too: if only Ctrl-H fails on Windows, the
likely cause is ConPTY re-encoding `0x08` (not confirmed).
