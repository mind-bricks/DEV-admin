import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { isFunction } from 'util';


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
    protected router: Router,
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
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      if (layout.parent === currentLayout.uuid) {
        this.layoutPath.push(layout);
      } else {
        const i = this.layoutPath.indexOf(layout);
        if (i !== -1) {
          this.layoutPath.splice(i + 1);
        }
      }
    } else {
      if (!layout.parent) {
        this.layoutPath.push(layout);
      }
    }
    await this.refresh();
  }

  async selectElement(element: ICMSElement) {
    try {
      const content =
        await this.cmsService.getContent(element.content);
      if (content.file) {
        window.open(content.file);
        // await this.router.navigateByUrl(content.file);
      }
    } catch (e) {
      console.log(e);
      const toast = await this.toastController.create({
        message: e.error[String('error_description')],
        duration: 2000,
      });
      await toast.present();
    }
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

  async deleteElement(element: ICMSElement) {
    const layout = await this.getCurrentLayout();
    if (!layout) {
      console.error('element should be in a layout');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: '<strong>Delete Anyway ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => { }
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.cmsService.deleteElement(
                layout.uuid, element.name);
              await this.refresh();
              await this.cmsService.deleteContent(
                element.content);

            } catch (e) {
              const toast = await this.toastController.create({
                message: e.error[String('error_description')],
                duration: 2000,
              });
              await toast.present();
            }
          }
        },
        {
          text: 'Delete Reference Only',
          handler: async () => {
            try {
              await this.cmsService.deleteElement(
                layout.uuid, element.name);
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

  async refresh(event?: Event) {
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

    if (event) {
      const completeFunc = event.target[String('complete')];
      if (isFunction(completeFunc)) {
        completeFunc.bind(event.target)();
      }
    }
  }

}
