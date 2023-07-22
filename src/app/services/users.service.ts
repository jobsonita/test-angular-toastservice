import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from 'src/app/interfaces';

interface UserFilters {
  search: string;
}

@Injectable({
  providedIn: 'any'
})
export class UsersService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private resourceUrl = 'api/users';

  constructor(private http: HttpClient) { }

  list(filters?: UserFilters): Observable<User[]> {
    let url = `${this.resourceUrl}`;
    const terms = filters?.search?.trim();
    if (terms) {
      url += `?firstname=${terms}`;
    }
    return this.http.get<User[]>(url);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.resourceUrl, user, this.httpOptions);
  }

  retrieve(id: number): Observable<User> {
    const url = `${this.resourceUrl}/${id}`;
    return this.http.get<User>(url);
  }

  update(user: User): Observable<User> {
    const url = `${this.resourceUrl}/${user.id}`;
    return this.http.put<User>(url, user, this.httpOptions)
  }

  delete(id: number): Observable<any> {
    const url = `${this.resourceUrl}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

}
