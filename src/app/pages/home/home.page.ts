import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { UMSService } from '../../services/ums.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    protected router: Router,
    protected alertController: AlertController,
    protected storageService: StorageService,
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

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: '<strong>Continue to logout ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'OK',
          handler: () => {
            this.storageService.remove('access_token');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  goCMS() {
    this.router.navigate(['/cms']);
  }

  goCMSGrant() {
    this.router.navigate(['/cms/grant']);
  }

}
