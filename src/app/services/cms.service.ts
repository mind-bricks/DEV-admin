import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { HttpService } from './http.service';
import { IPageResult } from './util';

export interface ICMSLayout {
  readonly uuid: string;
  name: string;
  parent: string | null;
  read_grant: string | null;
  write_grant: string | null;
  readonly created_user: string;
  readonly created_time: string;
  readonly modified_time: string;
}

export interface ICMSLayoutElement {
  name: string;
  content: string;
  readonly created_time: string;
  readonly modified_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  constructor(
    protected configService: ConfigureService,
    protected httpService: HttpService,
  ) {
  }

  public async getLayouts(
    layoutId: string | null,
    offset: number = 0,
    limit: number = 100,
  ) {
    const res = await this.httpService.get(
      this.configService.get('url:cms:layoutList'),
      Object.assign(
        { offset, limit },
        layoutId
          ? { parent: layoutId }
          : { parent__isnull: true }),
    );
    return res as IPageResult<ICMSLayout>;
  }

  public async getLayoutElements(
    layoutId: string,
    offset: number = 0,
    limit: number = 100,
  ) {
    const res = await this.httpService.get(
      this.configService.get(
        'url:cms:elementList',
        { layoutId, },
      ),
      { offset, limit, }
    );
    return res as IPageResult<ICMSLayoutElement>;
  }

  public async createLayout(
    layoutId: string | null,
    name: string,
  ) {
    const res = await this.httpService.post(
      this.configService.get('url:cms:layoutList'),
      Object.assign(
        { name },
        layoutId ? { parent: layoutId } : {}),
    );
    return res as ICMSLayout;
  }

  public async deleteLayout(
    layoutId: string
  ) {
    await this.httpService.delete(
      this.configService.get(
        'url:cms:layout', { layoutId }),
    );
  }
}
