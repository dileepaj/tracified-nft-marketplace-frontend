import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import TestLogger from './test-logger';

if (environment.production) {
  enableProdMode();
} else {
  TestLogger();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
