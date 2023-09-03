import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Interfaces/user';
import { MaterialModule } from 'src/app/Material/Material.module';
import { UserService } from 'src/app/Services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  constructor(private userSrv: UserService, private rout: Router) { }

  @Input('user') user: User;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // Handle the click event here
    this.rout.navigate(['user', this.user.id])
  }
}
