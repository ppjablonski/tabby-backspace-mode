import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mapBackspace, normalizeMode, isTargetProfile, resolveMode, INHERIT_MODE } from '../src/mapping'

const DEL = Buffer.from([0x7f])

test('pass-through keeps 0x7f', () => {
    assert.deepEqual(mapBackspace(DEL, 'backspace'), DEL)
})

test('ctrl-h sends 0x08', () => {
    assert.deepEqual(mapBackspace(DEL, 'ctrl-h'), Buffer.from([0x08]))
})

test('ctrl-? sends 0x7f', () => {
    assert.deepEqual(mapBackspace(DEL, 'ctrl-?'), Buffer.from([0x7f]))
})

test('delete sends CSI 3~', () => {
    assert.deepEqual(mapBackspace(DEL, 'delete'), Buffer.from('\x1b[3~'))
})

test('only a lone 0x7f is remapped', () => {
    for (const data of [Buffer.from('a'), Buffer.from('\x7f\x7f'), Buffer.from('ab\x7f'), Buffer.alloc(0)]) {
        assert.equal(mapBackspace(data, 'ctrl-h'), data)
    }
})

test('unknown or missing mode behaves as pass-through', () => {
    assert.equal(normalizeMode(undefined), 'backspace')
    assert.equal(normalizeMode('nope'), 'backspace')
    assert.equal(normalizeMode('delete'), 'delete')
    assert.deepEqual(mapBackspace(DEL, 'nope' as any), DEL)
})

test('only local profiles are targeted', () => {
    assert.equal(isTargetProfile({ type: 'local' }), true)
    for (const type of ['ssh', 'serial', 'telnet', undefined]) {
        assert.equal(isTargetProfile({ type }), false)
    }
    assert.equal(isTargetProfile(null), false)
})

test('resolveMode: explicit profile mode wins, otherwise inherit local defaults', () => {
    assert.equal(resolveMode('ctrl-h', 'delete'), 'ctrl-h')
    assert.equal(resolveMode('backspace', 'delete'), 'backspace')
    assert.equal(resolveMode(INHERIT_MODE, 'delete'), 'delete')
    assert.equal(resolveMode(undefined, 'ctrl-h'), 'ctrl-h')
    assert.equal(resolveMode(INHERIT_MODE, undefined), 'backspace')
    assert.equal(resolveMode(INHERIT_MODE, INHERIT_MODE), 'backspace')
    assert.equal(resolveMode('junk', 'junk'), 'backspace')
})
