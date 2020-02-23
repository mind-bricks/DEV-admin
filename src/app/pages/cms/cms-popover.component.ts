import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { isFunction } from 'util';
import { CmsCreateComponent } from './cms-create.component';
import { ICMSLayout } from '../../services/cms.service';


@Component({
  selector: 'app-cms-popover',
  templateUrl: './cms-popover.component.html',
  styleUrls: ['./cms-popover.component.scss'],
})
export class CmsPopoverComponent implements OnInit {

  refresh: () => Promise<void> | undefined;
  refreshToRoot: () => Promise<void> | undefined;
  refreshToParent: () => Promise<void> | undefined;
  currentLayout: ICMSLayout | undefined;

  constructor(
    protected modalController: ModalController,
    protected popoverController: PopoverController,
  ) {
  }

  ngOnInit() {
  }

  async newFolder() {
    const modal = await this.modalController.create({
      component: CmsCreateComponent,
      componentProps: {
        currentLayout: this.currentLayout,
        isCreateElement: false,
        refresh: this.refresh,
      }
    });
    await modal.present();
    await this.popoverController.dismiss();
  }

  async newFile() {
    const modal = await this.modalController.create({
      component: CmsCreateComponent,
      componentProps: {
        currentLayout: this.currentLayout,
        isCreateElement: true,
        refresh: this.refresh,
      }
    });
    await modal.present();
    await this.popoverController.dismiss();
  }

  async backToRoot() {
    if (isFunction(this.refreshToRoot)) {
      await this.refreshToRoot();
    }
    await this.popoverController.dismiss();
  }

  async backToParent() {
    if (isFunction(this.refreshToParent)) {
      await this.refreshToParent();
    }
    await this.popoverController.dismiss();
  }
}
