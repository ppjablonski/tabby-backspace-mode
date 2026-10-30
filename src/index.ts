import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Inject, NgModule } from '@angular/core'
import TabbyCoreModule, { ProfileProvider } from 'tabby-core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import LocalModule from 'tabby-local'
import TerminalModule, { TerminalDecorator } from 'tabby-terminal'
import { BackspaceModeDecorator } from './decorator'
import { INHERIT_MODE } from './mapping'
import { LocalInputSettingsComponent } from './settings.component'

@NgModule({
    imports: [CommonModule, FormsModule, NgbModule, TabbyCoreModule, TerminalModule, LocalModule],
    declarations: [LocalInputSettingsComponent],
    providers: [
        BackspaceModeDecorator,
        { provide: TerminalDecorator, useExisting: BackspaceModeDecorator, multi: true },
    ],
})
export default class BackspaceModeModule {
    // Tabby's profile editor only renders provider.settingsComponent, so the local
    // provider is extended in memory instead of patching Tabby.
    constructor (
        @Inject(ProfileProvider) providers: ProfileProvider<any>[],
    ) {
        const local = providers.find(p => p.id === 'local')
        if (!local || local.settingsComponent === LocalInputSettingsComponent) {
            return
        }
        const defaults = local.configDefaults as any
        defaults.options ??= {}
        defaults.options.input ??= { backspace: INHERIT_MODE }
        local.settingsComponent = LocalInputSettingsComponent
        // optionsFromShell spreads configDefaults.options into every built-in profile (WSL, PowerShell, ...).
        // An explicit mode there would override the user's "Defaults for Local terminal", so drop it.
        const optionsFromShell = (local as any).optionsFromShell?.bind(local)
        if (optionsFromShell) {
            (local as any).optionsFromShell = (shell: any) => {
                const { input, ...options } = optionsFromShell(shell)
                return options
            }
        }
    }
}
