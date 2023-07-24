import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, catchError, of } from 'rxjs';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';
import { ToastService, ToastType } from 'toast';

export const userDetailResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const usersService = inject(UsersService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  try {
    const id = parseInt(route.paramMap.get('id')!);
    return usersService.retrieve(id).pipe(
      catchError(error => {
        console.error(error);
        toastService.show({
          title: "User",
          message: `Unable to find user with id ${id}`,
          type: ToastType.Error
        });
        router.navigate(['users']);
        return EMPTY;
      })
    );
  } catch (error) {
    console.error(error);
    toastService.show({
      title: "User",
      message: `Unable to find user`,
      type: ToastType.Error
    });
    router.navigate(['users']);
    return EMPTY;
  }
}
