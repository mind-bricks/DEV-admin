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
        script.src = '/assets/swagger/swagger-ui-bundle.js';
        script.onload = (e: Event) => {
          this.bundle = SwaggerUIBundle;
          resolve(SwaggerUIBundle);
        };
        script.onabort = (e: Event) => {
          resolve(null);
        };
        script.onerror = (e: Event) => {
          resolve(null);
        };

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/swagger/theme-muted.css';

        document.body.appendChild(script);
        document.head.appendChild(link);
      }
    });
  }

}
