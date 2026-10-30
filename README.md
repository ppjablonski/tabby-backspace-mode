# tabby-backspace-mode

Tabby plugin that adds the **Backspace key mode** option, which Tabby only offers for
SSH, Telnet and Serial profiles, to **local** profiles (cmd, PowerShell, WSL, Git Bash, ...).

## Usage

Open **Settings > Profiles & connections**, edit a local profile (or *Defaults for Local
terminal* to cover every local profile), open the **Input** tab and pick a mode under
**Backspace key mode**.
The change applies to tabs opened afterwards (an already open tab keeps the defaults it was opened with).

| Mode | Sent on Backspace |
|------|-------------------|
| Pass-through (default) | `0x7f` |
| Ctrl-H | `0x08` |
| Ctrl-? | `0x7f` |
| Delete (CSI 3~) | `ESC [ 3 ~` |

The modes and bytes match Tabby's own SSH implementation (`InputProcessor` in `tabby-terminal`).
The default leaves input unchanged, so installing the plugin alone changes nothing.
Changes apply to tabs opened afterwards. A tab restored from the previous session keeps the
settings it was saved with, so close old tabs (or turn off `recoverTabs`) after changing the mode or updating the plugin. Tabby's built-in profiles (WSL, PowerShell, ...) cannot be
edited directly; set the mode in **Profiles & connections > Advanced > Local terminal**
(default settings for all local profiles) or duplicate a profile first.

## How it works

- Input: a `TerminalDecorator` adds a session middleware to tabs of `local` profiles
  (the same mechanism Tabby's ZModem and auto-sudo features use).
- Settings: Tabby's profile editor has no extension slot, so at startup the plugin
  replaces the in-memory `settingsComponent` of the `local` profile provider with a copy of
  Tabby's form that has the extra Input tab, and adds `options.input.backspace` to its
  `configDefaults`. The copy has to be kept in sync with `tabby-local` by hand. Tabby itself is not modified.
  This relies on internals, so a future Tabby release may break the settings UI
  (the input handling uses public APIs).

## Supported versions

Built against Tabby **1.0.238** (source reviewed at tag `v1.0.238`). The `tabby-*` type packages
on npm only go up to 1.0.231-nightly.0, which is what it was compiled with.
Verified on Windows, Tabby 1.0.238, built-in WSL / Debian profile with Ctrl-H set in
Advanced > Local terminal. Not verified: other local profiles (cmd, PowerShell, Git Bash) and the
other modes, though they share the same code path. See [INSTALL.md](INSTALL.md) for installation.

## Development

```
npm install
npm test          # builds, then runs unit tests
npm run package   # release/*.zip and release/*.tgz
```

MIT licensed.
