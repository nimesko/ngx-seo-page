import { MetaDefinition } from '@angular/platform-browser';
import { WithContext, Thing } from 'schema-dts';

export interface Page<T extends Thing> {
  title?: string;
  metaTags?: MetaDefinition[];
  schema?: WithContext<T>;
  canonical?: string;
}
