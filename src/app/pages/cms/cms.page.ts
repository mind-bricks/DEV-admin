import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import {
  AlertController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { CmsPopoverComponent } from './cms-popover.component';
import {
  ICMSLayout,
  ICMSElement,
  CMSService,
} from '../../services/cms.service';


@Component({
  selector: 'app-cms',
  templateUrl: './cms.page.html',
  styleUrls: ['./cms.page.scss'],
})
export class CmsPage implements OnInit {

  layoutPath: Array<ICMSLayout> = [];
  layouts: Array<ICMSLayout> = [];
  layoutElements: Array<ICMSElement> = [];

  constructor(
    protected alertController: AlertController,
    protected popoverController: PopoverController,
    protected toastController: ToastController,
    protected cmsService: CMSService,
  ) {

  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.refresh();
  }

  getCurrentPathName(): string {
    let pathName = '/';
    for (const layout of this.layoutPath) {
      pathName += `${layout.name}/`;
    }
    return pathName;
  }

  async goCMSPopover(ev: Event) {
    const currentLayout = await this.getCurrentLayout();
    const popover = await this.popoverController.create({
      component: CmsPopoverComponent,
      componentProps: {
        refresh: this.refresh.bind(this),
        refreshToRoot: this.refreshToRoot.bind(this),
        refreshToParent: this.refreshToParent.bind(this),
        currentLayout,
      },
      event: ev,
      translucent: true,
    });
    await popover.present();
  }

  async getCurrentLayout(): Promise<ICMSLayout | null> {
    return this.layoutPath.length
      ? this.layoutPath[this.layoutPath.length - 1]
      : null;
  }

  async selectLayout(layout: ICMSLayout) {
    this.layoutPath.push(layout);
    await this.refresh();
  }

  async deleteLayout(layout: ICMSLayout) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: '<strong>Delete Anyway ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'OK',
          handler: async () => {
            try {
              await this.cmsService.deleteLayout(layout.uuid);
              await this.refresh();
            } catch (e) {
              const toast = await this.toastController.create({
                message: e.error[String('error_description')],
                duration: 2000,
              });
              await toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async refreshToRoot() {
    this.layoutPath.splice(0);
    await this.refresh();
  }

  async refreshToParent() {
    this.layoutPath.pop();
    await this.refresh();
  }

  async refresh() {
    try {
      const parent = await this.getCurrentLayout();
      if (parent) {
        const res1 = await this.cmsService.getLayouts(parent.uuid);
        const res2 = await this.cmsService.getElements(parent.uuid);
        this.layouts = res1.results;
        this.layoutElements = res2.results;
      } else {
        const res = await this.cmsService.getLayouts(null);
        this.layouts = res.results;
        this.layoutElements = [];
      }
    } catch (e) {
      console.error(e);
      this.layouts = [];
      this.layoutElements = [];
    }
  }

}
