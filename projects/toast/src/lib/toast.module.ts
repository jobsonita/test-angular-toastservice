import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ToastComponent } from './toast-component/toast.component';
import { ToastService, ToastServiceConfig } from './toast.service';

@NgModule({
  declarations: [
    ToastComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastComponent
  ],
})
export class ToastModule {

  constructor(@Optional() @SkipSelf() parentModule?: ToastModule) {
    if (parentModule) {
      throw new Error(
        'ToastModule is already loaded. Import it in the AppModule only'
      )
    }
  }

  static forRoot(config = new ToastServiceConfig()): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: [
        { provide: ToastServiceConfig, useValue: config },
        ToastService
      ]
    };
  }

}
