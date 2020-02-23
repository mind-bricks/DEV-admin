import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConfigureService } from '../../services/configure.service';
import { isFunction } from 'util';

@Component({
  selector: 'app-api-popover',
  templateUrl: './api-popover.component.html',
  styleUrls: ['./api-popover.component.scss'],
})
export class ApiPopoverComponent implements OnInit {
  loadAPI: (domain: string) => Promise<void> | undefined;

  constructor(
    protected popoverController: PopoverController,
    protected configureService: ConfigureService,
  ) { }

  ngOnInit() { }

  getDomains() {
    return this.configureService.getKeys('domain');
  }

  async changeDomain(domain: string) {
    if (isFunction(this.loadAPI)) {
      await this.loadAPI(domain);
    }
    await this.popoverController.dismiss();
  }

}
