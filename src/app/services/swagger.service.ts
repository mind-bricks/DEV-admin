import { Injectable } from '@angular/core';

declare const SwaggerUIBundle: any;


@Injectable({
  providedIn: 'root'
})
export class SwaggerService {

  bundle: any;

  constructor() { }

  async getUIBundle(): Promise<any> {
    if (this.bundle) {
      return this.bundle;
    }

    return new Promise<any>((resolve, reject) => {
      const swaggerScriptId = 'swagger-ui-script';
      if (!document.getElementById(swaggerScriptId)) {
        const script = document.createElement('script');
        script.id = swaggerScriptId;
        script.src = 'https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js';
        script.onload = (e: Event) => {
          this.bundle = SwaggerUIBundle;
          resolve(SwaggerUIBundle);
        };
        script.onabort = (e: Event) => {
          reject(null);
        };
        script.onerror = (e: Event) => {
          reject(null);
        };
        document.body.appendChild(script);
      }
    });
  }

}
