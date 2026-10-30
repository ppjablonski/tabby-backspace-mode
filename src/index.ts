import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Inject, NgModule } from '@angular/core'
import TabbyCoreModule, { ProfileProvider } from 'tabby-core'
import TerminalModule, { TerminalDecorator } from 'tabby-terminal'
import { BackspaceModeDecorator } from './decorator'
import { LocalBackspaceSettingsComponent, OriginalLocalSettings } from './settings.component'

@NgModule({
    imports: [CommonModule, FormsModule, TabbyCoreModule, TerminalModule],
    declarations: [LocalBackspaceSettingsComponent],
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
        original: OriginalLocalSettings,
    ) {
        const local = providers.find(p => p.id === 'local')
        if (!local || local.settingsComponent === LocalBackspaceSettingsComponent) {
            return
        }
        const defaults = local.configDefaults as any
        defaults.options ??= {}
        defaults.options.input ??= { backspace: 'backspace' }
        original.type = local.settingsComponent ?? null
        local.settingsComponent = LocalBackspaceSettingsComponent
    }
}
