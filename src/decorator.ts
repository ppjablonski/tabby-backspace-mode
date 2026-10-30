import { Inject, Injectable } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { BaseSession, BaseTerminalTabComponent, TerminalDecorator } from 'tabby-terminal'
import { BackspaceModeMiddleware } from './middleware'
import { isTargetProfile } from './mapping'

@Injectable()
export class BackspaceModeDecorator extends TerminalDecorator {
    private handled = new WeakSet<BaseSession>()

    constructor (@Inject(ConfigService) private config: ConfigService) {
        super()
    }

    attach (tab: BaseTerminalTabComponent<any>): void {
        if (!isTargetProfile(tab.profile)) {
            return
        }
        // Same timing as upstream decorators: the session is created after attach().
        setTimeout(() => {
            this.bind(tab, tab.session)
            this.subscribeUntilDetached(tab, tab.sessionChanged$.subscribe(session => this.bind(tab, session)))
        })
    }

    private bind (tab: BaseTerminalTabComponent<any>, session: BaseSession|null): void {
        if (!session || this.handled.has(session)) {
            return
        }
        this.handled.add(session)
        session.middleware.push(new BackspaceModeMiddleware(() => tab.profile.options?.input?.backspace))
        console.log('[tabby-backspace-mode] attached, profile:', tab.profile.id, tab.profile.name,
            'mode:', tab.profile.options?.input?.backspace,
            'local defaults:', JSON.stringify(this.config.store.profileDefaults?.local?.options?.input))
    }
}
