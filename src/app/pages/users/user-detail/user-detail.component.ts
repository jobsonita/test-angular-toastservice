import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

import { ToastService, ToastType } from 'toast';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  errorToast = { title: 'User', message: 'Unable to perform operation on user data' };
  operation = "Loading user data...";

  user$!: Observable<User>;

  constructor(
    private routeService: ActivatedRoute,
    private location: Location,
    private router: Router,
    private toastService: ToastService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.retrieveUserFromRouteResolution();
  }

  private retrieveUserFromRouteResolution() {
    this.user$ = this.routeService.data.pipe(
      switchMap(data => of(data['user']))
    );
  }

  refreshUser(id: number): void {
    this.operation = "Refreshing user data...";
    this.user$ = this.usersService.retrieve(id);
  }

  saveUser(user: User): void {
    if (user?.id) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  private updateUser(user: User) {
    this.operation = "Updating user...";
    this.user$ = this.usersService.update(user).pipe(

      tap(() => this.toastService.show({
        title: `User updated`,
        message: `${user.firstname} ${user.lastname} updated with success`,
        type: ToastType.Success
      })),

      catchError(() => {
        this.toastService.show({
          title: `User update failed`,
          message: `Failed to update user ${user.firstname} ${user.lastname}`,
          type: ToastType.Error
        });
        return of(user);
      })

    );
  }

  private createUser(user: User) {
    this.operation = "Creating user...";
    this.user$ = this.usersService.create(user).pipe(

      tap((createdUser) => {
        this.toastService.show({
          title: 'User created',
          message: `${user.firstname} ${user.lastname} created with success`,
          type: ToastType.Success
        });
        this.router.navigate(['users', createdUser.id]);
      }),

      catchError(() => {
        this.toastService.show({
          title: `User creation failed`,
          message: `Failed to create user ${user.firstname} ${user.lastname}`,
          type: ToastType.Error
        });
        return of(user);
      })

    );
  }

  deleteUser(user: User): void {
    this.operation = "Deleting user...";
    this.user$ = this.usersService.delete(user.id!).pipe(

      tap(() => {
        this.toastService.show({
          title: 'User deleted',
          message: `User ${user.firstname} ${user.lastname} was deleted with success`,
          type: ToastType.Success
        });
        this.router.navigate(['users']);
      }),
      switchMap(() => of(new User)),

      catchError(() => {
        this.toastService.show({
          title: `User deletion failed`,
          message: `Failed to delete user ${user.firstname} ${user.lastname}`,
          type: ToastType.Error
        });
        return of(user);
      })

    );
  }

  cancelEdit(): void {
    this.returnToPreviousPage();
  }

  private returnToPreviousPage() {
    this.location.back();
  }

}
