import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, of } from 'rxjs';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

export const userListResolver: ResolveFn<User[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const search = route.queryParams['search'];
  return inject(UsersService).list({ search }).pipe(
    catchError(error => {
      console.error(error);
      // Directs to empty user list,
      // but later we'll also add a toast message
      // saying "Failed to retrieve the user list"
      return of([]);
    })
  );
}

export const userDetailResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  try {
    const id = parseInt(route.paramMap.get('id')!);
    return inject(UsersService).retrieve(id).pipe(
      catchError(error => {
        console.error(error);
        // Directs to detail of empty user in order to create a new user,
        // but later we'll want to redirect to users list
        // with a toast message saying "User not found"
        return of(new User);
      })
    );
  } catch (error) {
    console.error(error);
    // Directs to detail of empty user in order to create a new user
    return new User;
  }
}
