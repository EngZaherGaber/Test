import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Interfaces/user';
import { MaterialModule } from 'src/app/Material/Material.module';
import { Subscription, catchError, delay, interval, retryWhen, switchMap } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user: User;
  private intervalSubscription: Subscription;

  constructor(private route: ActivatedRoute, private userSrv: UserService, private router: Router) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const refreshIntervalMs = 5000;
      this.intervalSubscription = interval(refreshIntervalMs)
        .pipe(
          switchMap(() => this.userSrv.getSelectedUser(id).pipe(
            catchError(error => {
              // Handle network errors here, e.g., log the error
              console.error('Network error:', error);
              this.user = undefined
              return [];
            }),
            retryWhen(errors => errors.pipe(
              delay(refreshIntervalMs) // Retry after a delay
            ))
          ))
        )
        .subscribe(data => {
          // Update your data with the received data
          this.user = data;
        });
      this.userSrv.getSelectedUser(+id).subscribe(data => {
        this.user = data;
      });
    })
  }
  back() {
    console.log('back')
    this.router.navigate(['home'])
  }
}
