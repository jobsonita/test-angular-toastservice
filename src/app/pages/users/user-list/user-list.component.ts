import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, debounceTime, of, tap } from 'rxjs';

import { User } from 'src/app/interfaces';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  errorToast = { title: 'User list', message: 'Unable to retrieve user list' };

  users$: Observable<User[]> = of([]);

  searchField!: FormControl;

  private subscription?: Subscription;

  constructor(
    private routeService: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    const initialTerms = this.retrieveLatestSearchTermsFromQueryParams();
    this.createSearchField(initialTerms);
    this.loadUserList();
    this.pipeUserListFromSearchTermsChanges();
  }

  private retrieveLatestSearchTermsFromQueryParams(): string {
    return this.routeService.snapshot.queryParams['search'] ?? '';
  }

  private createSearchField(initialTerms: string) {
    this.searchField = new FormControl(initialTerms);
  }

  private loadUserList() {
    this.users$ = this.usersService.list({ search: this.searchField.value });
  }

  private pipeUserListFromSearchTermsChanges() {
    this.subscription = this.searchField.valueChanges.pipe(
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

  refreshUserList(): void {
    this.searchField.setValue(this.searchField.value);
  }

  clearSearchField(): void {
    if (this.searchField.value) {
      this.searchField.setValue('');
    }
  }

}
