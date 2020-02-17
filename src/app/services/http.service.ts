import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    protected httpClient: HttpClient,
    protected storageService: StorageService,
  ) {

  }

  protected formatUrl(
    url: string,
    params?: object,
  ): string {
    if (!params) {
      return url;
    }

    const paramsText = Array.from(Object.entries(params))
      .map(i => `${encodeURIComponent(i[0])}=${encodeURIComponent(i[1])}`)
      .join('&');
    return url + (
      url.indexOf('?') < 0 ? '?' : '&') + paramsText;
  }

  protected formatHeaders(
    headers?: object
  ) {
    const headersMapping: { [name: string]: string } = {};
    if (headers) {
      for (const i of Object.entries(headers)) {
        headersMapping[i[0]] = i[1];
      }
    }

    const accessToken = this.storageService.get('access_token');
    if (accessToken) {
      headersMapping[
        String('Authorization')] = `Bearer ${accessToken}`;
    }

    return headersMapping;
  }

  public get(
    url: string,
    params?: object,
    headers?: object,
  ) {
    return this.httpClient.get<object>(
      this.formatUrl(url, params),
      { headers: this.formatHeaders(headers) },
    ).toPromise();
  }

  public post(
    url: string,
    data: object,
    params?: object,
    headers?: object,
  ) {
    return this.httpClient.post<object>(
      this.formatUrl(url, params),
      data,
      { headers: this.formatHeaders(headers) },
    ).toPromise();
  }

  public patch(
    url: string,
    data: object,
    params?: object,
    headers?: object,
  ) {
    return this.httpClient.patch<object>(
      this.formatUrl(url, params),
      data,
      { headers: this.formatHeaders(headers) },
    ).toPromise();
  }

  public delete(
    url: string,
    params?: object,
    headers?: object,
  ) {
    return this.httpClient.delete<object>(
      this.formatUrl(url, params),
      { headers: this.formatHeaders(headers) },
    ).toPromise();
  }
}
