import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { userDetailResolver } from './services/users.resolver';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';

import { User } from 'src/app/interfaces';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'new',
    component: UserDetailComponent,
    resolve: { user: () => new User }
  },
  {
    path: ':id',
    component: UserDetailComponent,
    resolve: { user: userDetailResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
