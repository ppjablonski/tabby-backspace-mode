import { SessionMiddleware } from 'tabby-terminal'
import { BackspaceMode, mapBackspace, normalizeMode } from './mapping'

const hex = (data: Buffer) => Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')

export class BackspaceModeMiddleware extends SessionMiddleware {
    private logged = 0

    // The mode is read per keypress, so a changed profile applies without reopening the tab.
    constructor (private getMode: () => BackspaceMode|undefined) {
        super()
    }

    feedFromTerminal (data: Buffer): void {
        const mode = normalizeMode(this.getMode())
        const mapped = mapBackspace(data, mode)
        // Temporary diagnostics: only Backspace-like single bytes, first 20 per session.
        if (this.logged < 20 && data.length === 1 && (data[0] === 0x7f || data[0] === 0x08)) {
            this.logged++
            console.log('[tabby-backspace-mode] key', hex(data), '->', hex(mapped), 'mode:', mode)
        }
        this.outputToSession.next(mapped)
    }
}
