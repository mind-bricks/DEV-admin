import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { HttpService } from './http.service';
import { IPageResult } from './util';

export interface ICMSLayout {
  readonly uuid: string;
  name: string;
  parent: string | null;
  is_public: boolean;
  read_grant: string | null;
  write_grant: string | null;
  readonly created_user: string;
  readonly created_time: string;
  readonly modified_time: string;
}

export interface ICMSElement {
  name: string;
  content: string;
  readonly created_time: string;
  readonly modified_time: string;
}

export interface ICMSContent {
  readonly uuid: string;
  label: string;
  text: string;
  file: string;
  is_public: boolean;
  read_grant: string | null;
  write_grant: string | null;
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

  public async getElements(
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
    return res as IPageResult<ICMSElement>;
  }

  public async createLayout(
    layoutId: string | null,
    layoutName: string,
  ) {
    const res = await this.httpService.post(
      this.configService.get('url:cms:layoutList'),
      Object.assign(
        { name: layoutName },
        layoutId ? { parent: layoutId } : {}),
    );
    return res as ICMSLayout;
  }

  public async createElement(
    layoutId: string,
    elementName: string,
    contentId: string,
  ) {
    const res = await this.httpService.post(
      this.configService.get(
        'url:cms:elementList', { layoutId, }),
      { name: elementName, content: contentId },
    );
    return res as ICMSElement;
  }

  public async createContent(
    file?: File,
    text?: string,
  ) {
    const data: FormData = new FormData();
    data.append('file', file || null);
    data.append('text', text || null);
    const res = await this.httpService.post(
      this.configService.get('url:cms:contentList'),
      data,
    );
    return res as ICMSContent;
  }

  public async deleteLayout(
    layoutId: string
  ) {
    await this.httpService.delete(
      this.configService.get(
        'url:cms:layout', { layoutId }),
    );
  }

  public async deleteElement(
    layoutId: string,
    elementName: string
  ) {
    await this.httpService.delete(
      this.configService.get(
        'url:cms:element', { layoutId, elementName }),
    );
  }

  public async deleteContent(
    contentId: string,
  ) {
    await this.httpService.delete(
      this.configService.get(
        'url:cms:content', { contentId }),
    );
  }
}
