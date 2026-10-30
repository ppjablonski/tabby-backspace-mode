import { Component, ComponentRef, Injectable, ViewChild, ViewContainerRef } from '@angular/core'

/** Original settings component of the local provider, captured before it is replaced. */
@Injectable({ providedIn: 'root' })
export class OriginalLocalSettings {
    type: (new (...args: any[]) => any)|null = null
}

/**
 * Renders the stock local profile settings and the stock
 * "Backspace key mode" control below them.
 */
@Component({
    template: `
        <ng-container #host></ng-container>
        <div class="mt-3" *ngIf="profile?.options?.input">
            <input-processing-settings [options]="profile.options.input"></input-processing-settings>
        </div>
    `,
})
export class LocalBackspaceSettingsComponent {
    profile: any
    @ViewChild('host', { read: ViewContainerRef, static: true }) host!: ViewContainerRef
    private inner?: ComponentRef<any>

    constructor (private original: OriginalLocalSettings) { }

    ngOnInit (): void {
        if (this.original.type) {
            this.inner = this.host.createComponent(this.original.type)
            this.inner.instance.profile = this.profile
        }
    }

    save (): void {
        this.inner?.instance.save?.()
    }

    ngOnDestroy (): void {
        this.inner?.destroy()
    }
}
