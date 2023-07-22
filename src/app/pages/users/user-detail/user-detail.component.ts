import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, of } from 'rxjs';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  user!: User;
  originalUser?: User;
  processing = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private routeService: ActivatedRoute,
    private location: Location,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.user = this.retrieveUserFromRouteResolution();
    this.originalUser = { ...this.user };
  }

  private retrieveUserFromRouteResolution() {
    return this.routeService.snapshot.data['user'] ?? new User;
  }

  ngOnDestroy(): void {
    this.processing = false;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  refreshUser(): void {
    const id = this.user?.id;
    if (id) {
      this.processing = true;

      const subscription = this.usersService.retrieve(id).pipe(
        catchError(error => {
          console.error(error);
          this.processing = false;
          return of(this.user);
        })
      ).subscribe(user => {
        this.processing = false;
        this.user = { ...user };
      });

      this.subscriptions.push(subscription);
    }
  }

  saveUser(): void {
    this.processing = true;
    const id = this.user?.id;
    const operation = id
      ? this.usersService.update(this.user)
      : this.usersService.create(this.user);

    const subscription = operation.pipe(
      catchError(error => {
        console.error(error);
        this.processing = false;
        return of(this.user);
      })
    ).subscribe(user => {
      this.processing = false;
      this.user = { ...user };
      this.originalUser = { ...user };
    });

    this.subscriptions.push(subscription);
  }

  deleteUser(): void {
    const id = this.user?.id;
    if (id) {
      this.processing = true;

      const subscription = this.usersService.delete(id).pipe(
        catchError(error => {
          console.error(error);
          this.processing = false;
          return of(this.user);
        })
      ).subscribe(() => {
        this.location.back();
      });

      this.subscriptions.push(subscription);
    }
  }

  cancelEdit(): void {
    this.processing = true;
    this.location.back();
  }

}
