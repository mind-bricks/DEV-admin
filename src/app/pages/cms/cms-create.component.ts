import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  IonInput,
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
export class CmsCreateComponent implements OnInit, AfterViewInit {
  currentLayout: ICMSLayout | undefined;
  isCreateElement = false;
  refresh: () => Promise<void> | undefined;
  name = '';

  @ViewChild('file', { static: false })
  fileInput: IonInput | undefined;
  fileInputElement: HTMLElement | undefined;
  fileBlob: File | undefined;

  constructor(
    protected modalController: ModalController,
    protected toastController: ToastController,
    protected cmsService: CMSService,
  ) {
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.fileInputElement = this.fileInput
      ? await this.fileInput.getInputElement()
      : undefined;
  }

  async create() {
    const succeed = this.isCreateElement
      ? await this.createElement()
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
        this.currentLayout ? this.currentLayout.uuid : null,
        this.name,
      );
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  async createElement() {
    if (!this.currentLayout) {
      const toast = await this.toastController.create({
        message: 'Can not create Element without Layout!',
        duration: 2000
      });
      await toast.present();
      return true;
    }

    if (!this.name.length) {
      const toast = await this.toastController.create({
        message: 'Please Enter Name',
        duration: 2000
      });
      await toast.present();
      return false;
    }

    if (!this.fileBlob) {
      const toast = await this.toastController.create({
        message: 'Please Select File',
        duration: 2000
      });
      await toast.present();
      return false;
    }

    try {
      const res = await this.cmsService.createContent(this.fileBlob);
      await this.cmsService.createElement(
        this.currentLayout.uuid, this.name, res.uuid);
    } catch (e) {
      console.error(e);
      const toast = await this.toastController.create({
        message: e.error[String('error_description')],
        duration: 2000
      });
      await toast.present();
    }

    return true;
  }

  async fileSelect() {
    if (this.fileInputElement) {
      this.fileInputElement.click();
    }
  }

  async fileChange(event: Event) {
    const files = event.target[String('files')];
    if (files instanceof FileList) {
      this.fileBlob = files[0];
    }
  }

  async close() {
    await this.modalController.dismiss();
  }
}
