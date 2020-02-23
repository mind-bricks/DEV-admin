import { Component, OnInit } from '@angular/core';
import {
  PopoverController,
  ToastController
} from '@ionic/angular';
import { ConfigureService } from '../../services/configure.service';
import { StorageService } from '../../services/storage.service';
import { HttpService } from '../../services/http.service';
import { SwaggerService } from '../../services/swagger.service';
import { ApiPopoverComponent } from './api-popover.component';


@Component({
  selector: 'app-api',
  templateUrl: './api.page.html',
  styleUrls: ['./api.page.scss'],
})
export class ApiPage implements OnInit {

  constructor(
    protected popoverController: PopoverController,
    protected toastController: ToastController,
    protected configureService: ConfigureService,
    protected storageService: StorageService,
    protected httpService: HttpService,
    protected swaggerService: SwaggerService,
  ) {

  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.loadAPI('ums');
  }

  async loadAPI(domain: string) {
    const bundle = await this.swaggerService.getUIBundle();
    if (!bundle) {
      const toast = await this.toastController.create({
        message: 'Can not load SwaggerUI!',
        duration: 2000,
      });
      await toast.present();
      return;
    }

    try {
      const docURL = `${this.configureService.get(
        `domain:${domain}`)}/swagger/?format=openapi`;
      console.log(docURL);
      const res = await this.httpService.get(docURL);
      bundle({
        dom_id: '#swagger-ui',
        spec: res,
        requestInterceptor: (request) => {
          request[String('headers')][String('Authorization')] =
            `Bearer ${this.storageService.get('access_token')}`;
        }
      });

    } catch (e) {
      console.error(e);
      const toast = await this.toastController.create({
        message: 'Can not get API document!',
        duration: 2000,
      });
      await toast.present();
      return;
    }
  }

  async goAPIPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: ApiPopoverComponent,
      componentProps: {
        loadAPI: this.loadAPI.bind(this),
      },
      event: ev,
      translucent: true,
    });
    await popover.present();
  }

}
