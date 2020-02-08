import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { LoginService } from '../../services/login.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  protected username: string;
  protected password: string;

  constructor(
    protected location: Location,
    protected toastController: ToastController,
    protected loginService: LoginService,
    protected storageService: StorageService,
  ) {
    this.username = this.storageService.get('username') || '';
    this.password = '';
  }

  ngOnInit() {
  }

  async onConfirm() {
    if (!this.username.length) {
      const toast = await this.toastController.create({
        message: 'Please Enter Username.',
        duration: 2000
      });
      toast.present();
      return;
    }
    if (!this.password.length) {
      const toast = await this.toastController.create({
        message: 'Please Enter Password.',
        duration: 2000
      });
      toast.present();
      return;
    }

    try {
      await this.loginService.login(
        this.username,
        this.password,
      );
      this.location.back();
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.error,
        duration: 2000
      });
      toast.present();
      return;
    }
  }

}
