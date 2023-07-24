import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, debounceTime, of, tap } from 'rxjs';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  errorToast = { title: 'User list', message: 'Unable to retrieve user list' };

  terms = '';
  users$: Observable<User[]> = of([]);

  private searchTerms = new Subject<string>();
  private subscription?: Subscription;

  constructor(
    private routeService: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.retrieveLatestSearchTermsFromQueryParams();
    this.loadUserList();
    this.pipeUserListFromSearchTermsChanges();
  }

  private retrieveLatestSearchTermsFromQueryParams() {
    this.terms = this.routeService.snapshot.queryParams['search'] ?? '';
  }

  private loadUserList() {
    this.users$ = this.usersService.list({ search: this.terms });
  }

  private pipeUserListFromSearchTermsChanges() {
    this.subscription = this.searchTerms.pipe(
      debounceTime(1000)
    ).subscribe(terms => {
      this.users$ = this.usersService.list({ search: terms }).pipe(
        tap(() => this.router.navigate(['users'], { queryParams: { search: terms } }))
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  searchUser(terms: string): void {
    this.searchTerms.next(terms);
  }

  refreshUserList(): void {
    this.searchUser(this.terms);
  }

  clearSearchField(): void {
    if (this.terms) {
      this.terms = '';
      this.refreshUserList();
    }
  }

}
