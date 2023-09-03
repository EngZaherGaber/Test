import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: { page: number, lists: User[] }[] = [];
  selectedUsers: User[] = [];
  constructor(private http: HttpClient) { }
  private sharedValueSubject = new BehaviorSubject<{ length: number, per_page: number, page: number }>({ length: 0, per_page: 0, page: 1 });
  sharedValue$ = this.sharedValueSubject.asObservable();

  updateSharedValue(newValue: { length: number, per_page: number, page: number }) {
    this.sharedValueSubject.next(newValue);
  }
  getAllUsers(page: number) {
    const url = `https://reqres.in/api/users`;
    const params = new HttpParams()
      .set('page', page);
    return this.http.get(url, { params });
  }
  setUsersList(users: User[], page: number, length: number, per_page: number) {
    this.users.push({ page: page, lists: users });
    this.updateSharedValue({ length: length, per_page: per_page, page: page });
  }
  getUsersList(page: number): Observable<User[]> {
    const users = this.users.find(x => x.page === page);

    if (users && users.lists) {
      return of(users.lists);
    } else {
      return this.getAllUsers(page).pipe(
        tap((res) => {

          this.setUsersList(res['data'], page, res['total'], res['per_page']);
        }), map((res) => res['data'])
      )
    }
  }
  searchInUsers(id: number) {
    let newList = [];
    newList = this.users.map(x => x.lists).reduce((acc, cur) => {
      return acc.concat(cur);
    })
    return newList.find(x => x.id === id);
  }
  getUserById(id: number) {
    const url = `https://reqres.in/api/users/${id}`;
    return this.http.get(url);
  }
  getSelectedUser(id: number): Observable<User> {

    const user = this.selectedUsers.find(x => x.id === id);
    console.log(user)
    if (user) {
      return of(user);
    }
    else {
      return this.getUserById(id).pipe(
        tap((res) => {
          this.selectedUsers.push(res['data'])
        }),
        map((res) => res['data'])
      )

    }
  }

}
