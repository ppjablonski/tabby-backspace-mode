import { SessionMiddleware } from 'tabby-terminal'
import { BackspaceMode, mapBackspace, normalizeMode } from './mapping'

export class BackspaceModeMiddleware extends SessionMiddleware {
    // The mode is read per keypress, so changing the profile applies without reopening the tab.
    constructor (private getMode: () => BackspaceMode|undefined) {
        super()
    }

    feedFromTerminal (data: Buffer): void {
        this.outputToSession.next(mapBackspace(data, normalizeMode(this.getMode())))
    }
}
