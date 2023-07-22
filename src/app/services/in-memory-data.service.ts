import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { User } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const users = [
      { id: 1, firstname: "John", lastname: "Doe" },
      { id: 2, firstname: "Sarah", lastname: "Lee" },
      { id: 3, firstname: "Henry", lastname: "Fischer" },
      { id: 4, firstname: "Noah", lastname: "Sato" },
      { id: 5, firstname: "Elijah", lastname: "Wang" }
    ];
    return { users };
  }

  // Overrides the genId method to ensure that a user always has an id.
  // If the users array is empty,
  // the method below returns the initial number (1).
  // if the users array is not empty, the method below returns the highest
  // user id + 1.
  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id!)) + 1 : 6;
  }

}
