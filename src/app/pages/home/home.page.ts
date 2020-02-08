import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    protected router: Router,
    protected loginService: LoginService,
  ) {

  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (!await this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

}
