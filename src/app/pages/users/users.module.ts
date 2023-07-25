import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersService } from 'src/app/services/users.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
  ],
  providers: [UsersService]
})
export class UsersModule { }
