import { Component, Inject, Optional } from '@angular/core'
import { PlatformService } from 'tabby-core'
import { UACService } from 'tabby-local'

/**
 * Copy of Tabby's local profile settings (General, Colors) plus the stock
 * "Input" tab that SSH, Serial and Telnet profiles already have.
 * Keep in sync with tabby-local's localProfileSettings.component.
 */
@Component({
    template: `
        <ul ngbNav #nav="ngbNav" class="nav-tabs">
            <li ngbNavItem>
                <a ngbNavLink translate>General</a>
                <ng-template ngbNavContent>
                    <command-line-editor [model]="profile.options"></command-line-editor>

                    <div class="form-line" *ngIf="uac?.isAvailable">
                        <div class="header">
                            <div class="title" translate>Run as administrator</div>
                        </div>
                        <toggle [(ngModel)]="profile.options.runAsAdministrator"></toggle>
                    </div>

                    <div class="mb-3">
                        <label translate>Working directory</label>
                        <div class="input-group">
                            <input class="form-control" type="text" placeholder="Home directory"
                                [(ngModel)]="profile.options.cwd">
                            <button class="btn btn-secondary" (click)="pickWorkingDirectory()">
                                <i class="fas fa-folder-open"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label translate>Environment</label>
                        <environment-editor type="text" [(model)]="profile.options.env"></environment-editor>
                    </div>
                </ng-template>
            </li>
            <li ngbNavItem>
                <a ngbNavLink translate>Colors</a>
                <ng-template ngbNavContent>
                    <color-scheme-selector [(model)]="profile.terminalColorScheme"></color-scheme-selector>
                </ng-template>
            </li>
            <li ngbNavItem>
                <a ngbNavLink translate>Input</a>
                <ng-template ngbNavContent>
                    <input-processing-settings [options]="profile.options.input"></input-processing-settings>
                </ng-template>
            </li>
        </ul>
        <div [ngbNavOutlet]="nav"></div>
    `,
})
export class LocalInputSettingsComponent {
    profile: any

    constructor (
        @Optional() @Inject(UACService) public uac: UACService|undefined,
        @Inject(PlatformService) private platform: PlatformService,
    ) { }

    async pickWorkingDirectory (): Promise<void> {
        const cwd = await this.platform.pickDirectory()
        if (!cwd) {
            return
        }
        this.profile.options.cwd = cwd
    }
}
