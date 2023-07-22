import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UsersService } from 'src/app/services/users.service';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
  ],
  providers: [UsersService]
})
export class UsersModule { }
