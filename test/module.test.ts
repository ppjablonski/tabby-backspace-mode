import '@angular/compiler'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import Module from 'node:module'
import path from 'node:path'

// Load the built bundle with Tabby's modules stubbed, and check the local provider is extended.
test('module extends the local provider and leaves others alone', () => {
    const stubs: Record<string, any> = {
        'tabby-core': { __esModule: true, default: class {}, ProfileProvider: class {} },
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
    const local: any = { id: 'local', settingsComponent: original, configDefaults: { options: { cwd: null } } }
    const ssh: any = { id: 'ssh', settingsComponent: original, configDefaults: {} }
    const holder: any = { type: null }
    new Plugin([ssh, local], holder)
    assert.notEqual(local.settingsComponent, original)
    assert.equal(holder.type, original)
    assert.deepEqual(local.configDefaults.options.input, { backspace: 'backspace' })
    assert.equal(ssh.settingsComponent, original)
    // Idempotent: a second run must not capture our own wrapper as "original".
    new Plugin([local], holder)
    assert.equal(holder.type, original)
})
