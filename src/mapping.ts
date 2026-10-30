// Same modes and byte sequences as tabby-terminal's InputProcessor.
export type BackspaceMode = 'backspace'|'ctrl-h'|'ctrl-?'|'delete'

export const BACKSPACE_MODES: BackspaceMode[] = ['backspace', 'ctrl-h', 'ctrl-?', 'delete']

const DEL = 0x7f

/**
 * Plugin default stored in profiles that did not pick a mode. Built-in profiles copy
 * configDefaults into their own options, which would pin a real mode and hide the user's
 * "Local terminal" defaults, so "unset" gets its own value.
 */
export const INHERIT_MODE = 'inherit'

export function normalizeMode (mode: unknown): BackspaceMode {
    return BACKSPACE_MODES.includes(mode as BackspaceMode) ? mode as BackspaceMode : 'backspace'
}

/** A mode chosen on the profile wins; otherwise the user's local-terminal defaults apply. */
export function resolveMode (profileValue: unknown, defaultsValue: unknown): BackspaceMode {
    return BACKSPACE_MODES.includes(profileValue as BackspaceMode) ? profileValue as BackspaceMode : normalizeMode(defaultsValue)
}

/** Remaps a lone Backspace byte (0x7f); any other input is returned untouched. */
export function mapBackspace (data: Buffer, mode: BackspaceMode): Buffer {
    if (data.length !== 1 || data[0] !== DEL) {
        return data
    }
    switch (normalizeMode(mode)) {
        case 'ctrl-h': return Buffer.from('\x08')
        case 'delete': return Buffer.from('\x1b[3~')
        default: return Buffer.from('\x7f')
    }
}

export function isTargetProfile (profile: { type?: string }|null|undefined): boolean {
    return profile?.type === 'local'
}
