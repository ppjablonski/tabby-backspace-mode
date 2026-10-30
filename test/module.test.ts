import '@angular/compiler'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import Module from 'node:module'
import path from 'node:path'

// Load the built bundle with Tabby's modules stubbed, and check the local provider is extended.
test('module extends the local provider and leaves others alone', () => {
    const stubs: Record<string, any> = {
        'tabby-core': { __esModule: true, default: class {}, ProfileProvider: class {} },
        '@ng-bootstrap/ng-bootstrap': { NgbModule: class {} },
        'tabby-local': { __esModule: true, default: class {}, UACService: class {} },
        'tabby-terminal': { __esModule: true, default: class {}, TerminalDecorator: class { }, SessionMiddleware: class {} },
    }
    const load = (Module as any)._load
    ;(Module as any)._load = (request: string, ...rest: any[]) => stubs[request] ?? load(request, ...rest)
    let mod: any
    try {
        mod = require(path.resolve(__dirname, '../dist/index.js'))
    } finally {
        (Module as any)._load = load
    }
    const Plugin = mod.default
    const original = class {}
    const local: any = {
        id: 'local',
        settingsComponent: original,
        configDefaults: { options: { cwd: null } },
        // Mirrors LocalProfilesService.optionsFromShell, which spreads configDefaults.options.
        optionsFromShell (shell: any) { return { ...this.configDefaults.options, command: shell.command } },
    }
    const ssh: any = { id: 'ssh', settingsComponent: original, configDefaults: {} }
    new Plugin([ssh, local])
    assert.notEqual(local.settingsComponent, original)
    assert.deepEqual(local.configDefaults.options.input, { backspace: 'inherit' })
    assert.equal(ssh.settingsComponent, original)
    // Built-in profiles must not carry an explicit mode, or they would ignore the global defaults.
    assert.equal('input' in local.optionsFromShell({ command: 'wsl.exe' }), false)
    assert.equal(local.optionsFromShell({ command: 'wsl.exe' }).command, 'wsl.exe')
    const ours = local.settingsComponent
    new Plugin([local])
    assert.equal(local.settingsComponent, ours)
    assert.equal('input' in local.optionsFromShell({ command: 'x' }), false)
})
