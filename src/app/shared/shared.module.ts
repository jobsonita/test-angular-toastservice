import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WithLoadingPipe } from '../pipes/with-loading.pipe';

@NgModule({
  declarations: [
    WithLoadingPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    WithLoadingPipe,
  ]
})
export class SharedModule { }
