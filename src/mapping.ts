// Same modes and byte sequences as tabby-terminal's InputProcessor.
export type BackspaceMode = 'backspace'|'ctrl-h'|'ctrl-?'|'delete'

export const BACKSPACE_MODES: BackspaceMode[] = ['backspace', 'ctrl-h', 'ctrl-?', 'delete']

const DEL = 0x7f

export function normalizeMode (mode: unknown): BackspaceMode {
    return BACKSPACE_MODES.includes(mode as BackspaceMode) ? mode as BackspaceMode : 'backspace'
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
