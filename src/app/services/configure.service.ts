import { Injectable } from '@angular/core';
import { isString, isObject } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {

  configure = {
    domain: {
      ums: 'http://ums.erythrocyte.cn',
      cms: 'http://cms.erythrocyte.cn',
    },
    url: {
      ums: {
        login: '/users/login/',
        self: '/users/self/',
        selfPermissionList: '/users/self/permissions/',
        selfGroupList: '/users/self/groups/',
      },
      cms: {
        contentList: '/contents/',
        content: '/contents/{{contentId}}/',
        layoutList: '/layouts/',
        layout: '/layouts/{{layoutId}}/',
        elementList: '/layouts/{{layoutId}}/elements/',
        element: '/layouts/{{layoutId}}/elements/{{elementName}}/',
      },
    },
  };

  constructor() {
    for (const i of Object.keys(this.configure.url)) {
      const domain = this.configure.domain[i];
      const urls = this.configure.url[i];
      for (const j of Object.keys(urls)) {
        urls[j] = domain + urls[j];
      }
    }
  }

  public get(key: string, params?: object): string | null {
    let config: object = this.configure;
    key.split(':').forEach(k => {
      config = config instanceof Object ? config[k] : null;
    });
    if (!isString(config)) {
      throw Error('invalid configuartion key');
    }

    let ret = String(config);
    if (params) {
      for (const value of Object.entries(params)) {
        ret = ret.replace(`{{${value[0]}}}`, value[1]);
      }
    }

    return ret.toString();
  }

  public getKeys(key: string): Array<string> {
    let config: object = this.configure;
    key.split(':').forEach(k => {
      config = config instanceof Object ? config[k] : null;
    });
    if (!isObject(config)) {
      throw Error('invalid configuartion key');
    }

    return Object.keys(config);
  }

}
