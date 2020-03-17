import { Injectable } from '@angular/core';
import { isString, isObject } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {

  configure = {
    domain: {
      ums: 'https://ums.erythrocyte.cn',
      cms: 'https://cms.erythrocyte.cn',
      crm: 'https://crm.erythrocyte.cn',
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
    this.setup(this.configure);
  }

  protected setup(configure: object) {
    const urlPaths = configure[String('url')];
    const urlDomains = configure[String('domain')];
    if (
      !isObject(urlPaths) ||
      !isObject(urlDomains) ||
      urlPaths[String('has_setup')]
    ) {
      return;
    }

    for (const i of Object.keys(urlPaths)) {
      const domain = urlDomains[i];
      const paths = urlPaths[i];
      for (const j of Object.keys(paths)) {
        paths[j] = domain + paths[j];
      }
    }

    // set has_setup
    urlPaths[String('has_setup')] = true;
  }

  public update(configure: object) {
    // update configure from environment
    for (const e of Object.entries(configure)) {
      this.configure[e[0]] = e[1];
    }
    this.setup(this.configure);

    console.log(this.configure);
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
