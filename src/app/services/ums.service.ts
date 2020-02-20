import { Injectable } from '@angular/core';
import { ConfigureService } from './configure.service';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { IPageResult } from './util';

export interface IUMSUser {
  readonly uuid: string;
  readonly username: string;
  readonly email?: string;
  readonly mobile?: string;
}

export interface IUMSPermission {
  readonly name: string;
}

export interface IUMSGroup {
  readonly name: string;
}

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
        this.configService.get('url:ums:login'),
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
      await this.getUser();
      return true;

    } catch (e) {
      console.error(e);
    }

    return null;
  }

  public async getUser(): Promise<IUMSUser> {
    const res = await this.httpService.get(
      this.configService.get('url:ums:self'),
    );
    return res as IUMSUser;
  }

  public async getPermissions(
    offset: number = 0,
    limit: number = 100,
    params?: object,
  ) {
    const res = await this.httpService.get(
      this.configService.get('url:ums:selfPermissionList'),
      Object.assign({ offset, limit }, params),
    );
    return res as IPageResult<IUMSPermission>;
  }

  public async getGroups(
    offset: number = 0,
    limit: number = 100,
    params?: object,
  ) {
    const res = await this.httpService.get(
      this.configService.get('url:ums:selfGroupList'),
      Object.assign({ offset, limit }, params),
    );
    return res as IPageResult<IUMSGroup>;
  }
}
