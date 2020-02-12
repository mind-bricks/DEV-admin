import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class UMSService {

  constructor(
    protected configService: ConfigureService,
    protected httpService: HttpService,
    protected storageService: StorageService,
  ) {

  }

  public async login(
    username: string,
    password: string,
  ) {
    // clear cached access token first
    this.storageService.remove('access_token');
    try {
      // start login request
      const res = await this.httpService.post(
        this.configService.get('url:user:login'),
        {
          username,
          password,
        }
      );
      if (res && res[String('access_token')]) {
        // cache access token
        this.storageService.set(
          'access_token',
          res[String('access_token')],
        );
        // save username
        this.storageService.set(
          'username',
          username,
        );
      }

    } catch (e) {
      console.error(e);
      throw e.error;
    }
  }

  public async isLoggedIn(): Promise<boolean> {
    if (!this.storageService.get('access_token')) {
      return false;
    }

    try {
      const res = await this.httpService.get(
        this.configService.get('url:user:self'),
      );
      return !!res;

    } catch (e) {
      console.log(e);
    }

    return false;
  }
}
