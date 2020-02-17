import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
} from '@ionic/angular';
import {
  ICMSLayout,
  CMSService,
} from '../../services/cms.service';
import { isFunction } from 'util';

@Component({
  selector: 'app-cms-create',
  templateUrl: './cms-create.component.html',
  styleUrls: ['./cms-create.component.scss'],
})
export class CmsCreateComponent implements OnInit {
  currentLayout: ICMSLayout | undefined;
  createElement = false;
  refresh: () => Promise<void> | undefined;
  name = '';

  constructor(
    protected modalController: ModalController,
    protected toastController: ToastController,
    protected cmsService: CMSService,
  ) {
  }

  ngOnInit() {
  }

  async create() {
    if (!this.currentLayout) {
      console.error('no current layout');
      return;
    }

    const succeed = this.createElement
      ? await this.createLayoutElement()
      : await this.createLayout();
    if (succeed) {
      await this.modalController.dismiss();
      if (isFunction(this.refresh)) {
        await this.refresh();
      }
    }
  }

  async createLayout() {
    if (!this.name.length) {
      const toast = await this.toastController.create({
        message: 'Please Enter Name',
        duration: 2000
      });
      await toast.present();
      return false;
    }

    try {
      await this.cmsService.createLayout(
        this.currentLayout.uuid,
        this.name,
      );
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  async createLayoutElement() {
    return true;
  }

  async close() {
    await this.modalController.dismiss();
  }
}
