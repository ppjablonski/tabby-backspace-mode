# Installing tabby-backspace-mode (Windows, Tabby 1.0.238)

## Install

1. Close Tabby completely (including the tray icon).
2. Open the plugins folder: `%APPDATA%\tabby\plugins`
   (the button name in Settings > Plugins was not checked against the Tabby source).
   Portable Tabby: `data\plugins` next to the executable.
3. Unzip `tabby-backspace-mode-0.1.5-windows.zip` into that folder. The result must be:
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

Tabs restored from the previous session keep the profile they were saved with, including an
older Backspace mode. Close all tabs, quit Tabby completely, start it and open a **new** tab
from the `+` menu. Changing the mode in Advanced > Local terminal also only affects new tabs.
