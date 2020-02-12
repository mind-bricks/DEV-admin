import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { UMSService } from '../../services/ums.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    protected router: Router,
    protected umsService: UMSService,
  ) {

  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (!await this.umsService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  goCMSPage() {
    this.router.navigate(['/cms']);
  }

  goCMSGrantPage() {
    this.router.navigate(['/cms/grant']);
  }

}
