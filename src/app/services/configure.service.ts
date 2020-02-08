import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService {

  configure = {
    domain: {
      user: 'https://user.macrocura.com',
      cms: 'https://cms.macrocura.cn',
    },
    url: {
      user: {
        login: '/user/managers/login/',
        self: '/user/managers/self/',
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

  public get(key: string): string | null {
    let config = this.configure;
    key.split(':').forEach(k => {
      config = config instanceof Object ? config[k] : null;
    });
    return config instanceof Object ? null : config;
  }

}
