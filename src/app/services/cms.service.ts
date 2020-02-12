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

  public async getRootLayouts(
    offset: number = 0,
    limit?: number,
  ) {
    const res = await this.httpService.get(
      this.configService.get('url:cms:layouts'),
      { parent__isnull: true, offset, limit, },
    );
    return res ? res as IPageResult<ICMSLayout> : null;
  }

  public async getSubLayouts(
    layoutId: string,
    offset: number = 0,
    limit?: number,
  ) {
    const res = await this.httpService.get(
      this.configService.get('url:cms:layouts'),
      { parent: layoutId, offset, limit, },
    );
    return res ? res as IPageResult<ICMSLayout> : null;
  }

  public async getLayoutElements(
    layoutId: string,
    offset: number = 0,
    limit?: number,
  ) {
    const res = await this.httpService.get(
      this.configService.get(
        'url:cms:layoutElements',
        { layoutId, },
      ),
      { offset, limit, }
    );
    return res ? res as IPageResult<ICMSLayoutElement> : null;
  }
}
