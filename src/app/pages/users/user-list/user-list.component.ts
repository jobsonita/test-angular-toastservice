import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, of, skip, startWith } from 'rxjs';

import { ToastService, ToastType } from 'toast';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  terms = '';
  users: User[] = [];
  processing = false;

  private searchTerms = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(
    private routeService: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.processing = true;
    this.terms = this.retrieveLatestSearchTermFromQueryParams();
    this.subscribeToRetrieveUserListFromRouteResolution();
    this.subscribeToNavigateOnSearchTermsChanges(this.terms);
  }

  private retrieveLatestSearchTermFromQueryParams() {
    return this.routeService.snapshot.queryParams['search'] ?? '';
  }

  private subscribeToRetrieveUserListFromRouteResolution() {
    let subscription = this.routeService.data.subscribe(data => {
      this.users = data['users'];
      this.processing = false;
    });

    this.subscriptions.push(subscription);
  }

  private subscribeToNavigateOnSearchTermsChanges(initialTerms: string) {
    let subscription = this.searchTerms.pipe(
      startWith(initialTerms),
      debounceTime(1000),
      distinctUntilChanged(),
      skip(1),
    ).subscribe(terms => {
      this.processing = true;
      this.router.navigate([''], { queryParams: { search: terms } }).then(
        () => this.processing = false
      )
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.processing = false;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  refreshUserList(): void {
    this.processing = true;
    this.usersService.list({ search: this.terms }).pipe(
      catchError(error => {
        console.error(error);
        this.processing = false;
        return of([]);
      })
    ).subscribe(users => {
      this.processing = false;
      this.users = users;
      this.toastService.show({
        title: "User Refresh",
        message: "The list of users was refreshed!",
        milliseconds: 4000,
        type: ToastType.Info
      });
    });
  }

  searchUser(term: string): void {
    this.searchTerms.next(term);
  }

  clearSearchField(): void {
    this.terms = '';
    this.searchTerms.next(this.terms);
  }

}
