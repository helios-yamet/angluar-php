import { Component, OnInit } from '@angular/core';

import { User } from './../models/user';
import { UserService } from './../services/user.service';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
	users: User[];
	error = '';
	success = '';
	//creating a User class instance to save the input in the user-form
	user = new User('', '');

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.getUsers();
	}
	getUsers(): void{
		this.userService.getAll().subscribe(
			(res: User[]) => { 
				this.users = res 
			},
			(err) => { 
				this.error = err 
			}
		);
	}
	save(user) {
	    this.error = '';
	    this.success = '';

	    this.userService.saveUser(this.user)
	      .subscribe(
	        (res: User[]) => {
	          // Update the list of cars
	          this.users = res;

	          // Inform the user
	          this.success = 'Created successfully';

	          // Reset the form
	          user.reset();
	        },
	        (err) => this.error = err
	      );
	}
	update(name, email, uid){
		this.error = '';
	    this.success = '';

	    this.userService.updateUser({ uid: +uid, name: name.value, email: email.value})
	    	.subscribe(
		        (res) => {
		          // Update the list of cars
		          this.users = res;

		          // Inform the user
		          this.success = 'Updated successfully';
		        },
		        (err) => this.error = err
		      );
	}
	delete(uid){
		this.error = '';
		this.success = '';

		this.userService.deleteUser(+uid)
			.subscribe(
				(res) => {
					//
					this.users = res;
					//
					this.success = 'Deleted successfully';
				},
				(err) => this.error = err
			);
	}
}
