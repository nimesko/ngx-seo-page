import { MetaDefinition } from '@angular/platform-browser';

export interface Page {
  title: string;
  metatags?: MetaDefinition[];
  microdata?: object;
  canonical?: string;
}
