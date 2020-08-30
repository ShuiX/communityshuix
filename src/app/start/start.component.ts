import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../services/user.model';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  userData: Observable<User>;

  constructor(public auth: AuthService) {
   }

  ngOnInit(): void {
    this.userData = this.auth.userData();
  }

}
