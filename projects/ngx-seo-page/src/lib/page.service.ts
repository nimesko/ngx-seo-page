import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { WithContext, Thing } from 'schema-dts';

import { Page } from './page.model';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private metaTags: HTMLMetaElement[];

  private readonly schemaElement: HTMLScriptElement;
  private readonly canonicalLinkElement: HTMLLinkElement;

  constructor(@Inject(DOCUMENT) private document: any, private title: Title, private meta: Meta) {
    this.schemaElement = this.document.createElement('script');
    this.canonicalLinkElement = this.document.createElement('link');
    this.canonicalLinkElement.setAttribute('rel', 'canonical');
    this.schemaElement.type = 'application/ld+json';
    this.metaTags = [];
  }

  updatePage<T extends Thing>(page: Page<T>): void {
    this.setTitle(page.title);
    this.updateMetatags(page.metaTags);
    this.updateCanonicalLink(page.canonical);
    this.updateSchema(page.schema);
  }

  setTitle(title?: string): void {
    if (title) {
      this.title.setTitle(title);
    }
  }

  setMetatags(metaTags: MetaDefinition[]): void {
    this.metaTags.push(...metaTags.map((metaTag) => this.meta.addTag(metaTag) as HTMLMetaElement));
  }

  removeMetatags(): void {
    this.metaTags.map((metaTag) => this.meta.removeTagElement(metaTag));
  }

  updateMetatags(metaTags: MetaDefinition[] = []): void {
    this.removeMetatags();
    if (metaTags) {
      this.setMetatags(metaTags);
    }
  }

  setSchema<T extends Thing>(schema: WithContext<T>): void {
    this.schemaElement.text = JSON.stringify(schema);
    if (!this.document.contains(this.schemaElement)) {
      this.document.body.appendChild(this.schemaElement);
    }
  }

  removeSchema(): void {
    if (this.document.contains(this.schemaElement)) {
      this.schemaElement.remove();
    }
  }

  updateSchema<T extends Thing>(schema?: WithContext<T>): void {
    if (schema) {
      this.setSchema(schema);
    } else {
      this.removeSchema();
    }
  }

  setCanonical(link: string): void {
    this.canonicalLinkElement.href = link;
    if (!this.document.contains(this.canonicalLinkElement)) {
      this.document.head.appendChild(this.canonicalLinkElement);
    }
  }

  removeCanonical(): void {
    if (this.document.contains(this.canonicalLinkElement)) {
      this.canonicalLinkElement.remove();
    }
  }

  updateCanonicalLink(link?: string): void {
    if (link) {
      this.setCanonical(link);
    } else {
      this.removeCanonical();
    }
  }
}
