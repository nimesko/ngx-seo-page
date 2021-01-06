import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { Page, SchemaData } from './page.model';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private metatags: HTMLMetaElement[];

  private readonly schemaBaseObject: Record<string, unknown>;
  private readonly schemaElement: HTMLScriptElement;
  private readonly canonicalLinkElement: HTMLLinkElement;

  constructor(@Inject(DOCUMENT) private document: any, private title: Title, private meta: Meta) {
    this.schemaElement = this.document.createElement('script');
    this.canonicalLinkElement = this.document.createElement('link');
    this.canonicalLinkElement.setAttribute('rel', 'canonical');
    this.schemaElement.type = 'application/ld+json';
    this.schemaBaseObject = {
      '@context': 'http://schema.org',
    };
    this.metatags = [];
  }

  updatePage(page: Page): void {
    this.setTitle(page.title);
    this.updateMetatags(page.metatags);
    this.updateCanonicalLink(page.canonical);
    this.updateSchema(page.schema);
  }

  setTitle(title?: string): void {
    if (title) {
      this.title.setTitle(title);
    }
  }

  setMetatags(metatags: MetaDefinition[]): void {
    this.metatags.push(...metatags.map((metatag) => this.meta.addTag(metatag)));
  }

  removeMetatags(): void {
    this.metatags.map((metatag) => this.meta.removeTagElement(metatag));
  }

  updateMetatags(metatags: MetaDefinition[] = []): void {
    this.removeMetatags();
    if (metatags) {
      this.setMetatags(metatags);
    }
  }

  setSchema(schema: SchemaData): void {
    this.schemaElement.text = JSON.stringify({
      ...this.schemaBaseObject,
      ...schema,
    });
    if (!this.document.contains(this.schemaElement)) {
      this.document.body.appendChild(this.schemaElement);
    }
  }

  removeSchema(): void {
    if (this.document.contains(this.schemaElement)) {
      this.schemaElement.remove();
    }
  }

  updateSchema(schema?: SchemaData): void {
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
