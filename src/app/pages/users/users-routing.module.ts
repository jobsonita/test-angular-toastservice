import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { userDetailResolver, userListResolver } from './services/users.resolver';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    resolve: { users: userListResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'new',
    component: UserDetailComponent
  },
  {
    path: ':id',
    component: UserDetailComponent,
    resolve: { user: userDetailResolver }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
