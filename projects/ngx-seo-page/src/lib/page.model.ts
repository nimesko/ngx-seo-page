import { MetaDefinition } from '@angular/platform-browser';

export interface Page {
  title?: string;
  metatags?: MetaDefinition[];
  schema?: SchemaData;
  canonical?: string;
}

export interface SchemaData {
  '@type': string;
  [propname: string]: string | number | boolean | SchemaData;
}
