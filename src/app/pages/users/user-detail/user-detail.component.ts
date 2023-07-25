import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, of, switchMap, tap } from 'rxjs';

import { ToastService, ToastType } from 'toast';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  errorToast = { title: 'User', message: 'Unable to perform operation on user data' };
  operation = "Loading user data...";

  user$!: Observable<User>;
  latestUser$ = new Subject<User>();

  userForm!: FormGroup;

  private subscription?: Subscription;

  constructor(
    private routeService: ActivatedRoute,
    private location: Location,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.createFormAndSubscribeToLatestUserChanges();
    this.retrieveUserFromRouteResolution();
  }

  private createFormAndSubscribeToLatestUserChanges() {
    this.subscription = this.latestUser$.subscribe(user => {
      this.userForm = this.formBuilder.group({
        id: [user.id],
        firstname: [user.firstname, Validators.required],
        lastname: [user.lastname, Validators.required],
      });
    });
  }

  private retrieveUserFromRouteResolution() {
    this.user$ = this.routeService.data.pipe(
      map(data => data['user']),
      tap(user => this.latestUser$.next(user))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refreshUser(): void {
    const id = this.userForm.value.id;
    this.operation = "Refreshing user data...";
    this.user$ = this.usersService.retrieve(id).pipe(
      tap(user => this.latestUser$.next(user))
    );
  }

  saveUser(): void {
    if (this.userForm.value.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private updateUser() {
    const user = this.userForm.value;
    this.operation = "Updating user...";
    this.user$ = this.usersService.update(user).pipe(

      tap(() => this.toastService.show({
        title: `User updated`,
        message: `${user.firstname} ${user.lastname} updated with success`,
        type: ToastType.Success
      })),
      tap(() => this.latestUser$.next(user)),

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

  private createUser() {
    const user = this.userForm.value;
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
      tap((createdUser) => this.latestUser$.next(createdUser)),

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

  deleteUser(): void {
    const user = this.userForm.value;
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
      tap((newUser) => this.latestUser$.next(newUser)),

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

  reset(): void {
    this.userForm.reset();
  }

  cancelEdit(): void {
    this.returnToPreviousPage();
  }

  private returnToPreviousPage() {
    this.location.back();
  }

}
