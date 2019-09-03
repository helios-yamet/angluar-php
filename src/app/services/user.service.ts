import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './../models/user';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	//if you change it to https:// instead you will get a ERR_CONNECTION_REFUSED
	baseUrl = 'http://localhost/api';
	users: User[];
	
	constructor(private http: HttpClient) { }
	
	//rerurns the list of users wrapped in an Observable
	//HttpClient get() method fetchs the data from the server side
	getAll(): Observable<User[]> {
	    return this.http.get(`${this.baseUrl}/user-list`).pipe(
	      map((res) => {
	        this.users = res['data'];
	        return this.users;
	    }),
	    catchError(this.handleError));
	}
	//We use the httpClientModule's post() method to send the data to the server side.
	//The method accepts the URL as the first parameter and the car object as the second parameter.
	saveUser(user: User): Observable<User[]> {
		return this.http.post(`${this.baseUrl}/user-save`, { data: user })
			.pipe(map((res) => {
				this.users.push(res['data']);
				return this.users;
			}),
			catchError(this.handleError));
	}
	updateUser(user: User): Observable<User[]> {
		return this.http.put(`${this.baseUrl}/user-update`, { data: user })
			.pipe(map((res) => {
				const userFound = this.users.find((item) =>{
					return +item['uid'] === +user['uid'];
				});
				if(userFound) {
					userFound['name'] = user['name'];
					userFound['email'] = user['email'];
				}
				return this.users;
			}),
			catchError(this.handleError));
	}
	deleteUser(uid: number): Observable<User[]> {
		//const params = new HttpParams().set('uid', uid.toString());
		return this.http.delete(`${this.baseUrl}/user-delete?uid=` +uid)
			.pipe(map((res) => {
				const filteredUsers = this.users.filter((user) =>{
					return +user['uid'] !== +uid;
				});
				return this.users = filteredUsers;
			}),
			catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		console.log(error);
		// return an observable with a user friendly message
		return throwError('Error! something went wrong.');
  }
}