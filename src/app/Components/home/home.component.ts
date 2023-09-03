import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/Material/Material.module';
import { User } from 'src/app/Interfaces/user';
import { CardComponent } from '../card/card.component';
import { UserService } from 'src/app/Services/user.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, catchError, delay, interval, retryWhen, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardComponent, MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  per_page: number;
  page: number;
  length: number;
  searchInpt = new FormControl('');
  private intervalSubscription: Subscription;
  constructor(private userSrv: UserService) {

  }
  ngOnInit(): void {

    this.userSrv.sharedValue$.subscribe(x => {
      this.length = x.length;
      this.per_page = x.per_page;
      this.page = x.page;
    })
    const refreshIntervalMs = 1000;
    this.intervalSubscription = interval(refreshIntervalMs)
      .pipe(
        switchMap(() => this.userSrv.getUsersList(this.page).pipe(
          catchError(error => {
            // Handle network errors here, e.g., log the error
            console.error('Network error:', error);
            this.users = []
            return [];
          }),
          retryWhen(errors => errors.pipe(
            delay(refreshIntervalMs) // Retry after a delay
          ))
        ))
      )
      .subscribe(data => {
        // Update your data with the received data
        this.users = data;
      });
  }

  handlePageEvent(event) {

    this.page = event.pageIndex + 1;
    this.userSrv.getUsersList(this.page).subscribe(data => {
      this.users = data;
    })
  }
  Search(value) {
    if (value) {
      this.users = [];
      this.users.push(this.userSrv.searchInUsers(+value));
      console.log(this.users)
    } else {
      this.userSrv.updateSharedValue({ length: this.length, per_page: this.per_page, page: 1 });
      this.userSrv.getUsersList(this.page).subscribe(data => this.users = data);
    }
  }
}
