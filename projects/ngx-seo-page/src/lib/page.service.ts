import { Inject, Injectable } from '@angular/core';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import { Page } from './page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private readonly microdataBaseObject: object;
  private readonly metatags: HTMLMetaElement[];
  private readonly microdataElement: HTMLScriptElement;
  private readonly canonicalLinkElement: HTMLLinkElement;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private title: Title,
    private meta: Meta
  ) {
    this.microdataElement = this.document.createElement('script');
    this.canonicalLinkElement = this.document.createElement('link');
    this.canonicalLinkElement.setAttribute('rel', 'canonical');
    this.microdataElement.type = 'application/ld+json';
    this.microdataBaseObject = {
      '@context': 'http://schema.org'
    };
    this.metatags = [];
  }

  updatePage(page: Page): void {
    this.title.setTitle(page.title);
    this.updateMetatags(page.metatags);
    this.updateCanonicalLink(page.canonical);
    this.updateMicrodata(page.microdata);
  }

  updateMetatags(metatags: MetaDefinition[] = []): void {
    this.metatags.forEach(metatag => this.meta.removeTagElement(metatag));
    if (metatags) {
      metatags.forEach(metatag => this.metatags.push(this.meta.addTag(metatag)));
    }
  }

  updateMicrodata(microdata?: object): void {
    if (microdata) {
      this.microdataElement.text = JSON.stringify({ ...this.microdataBaseObject, ...microdata });
      if (!this.document.contains(this.microdataElement)) {
        this.document.body.appendChild(this.microdataElement);
      }
    } else {
      if (this.document.contains(this.microdataElement)) {
        this.microdataElement.remove();
      }
    }
  }

  updateCanonicalLink(link?: string): void {
    if (link) {
      this.canonicalLinkElement.href = link;
      if (!this.document.contains(this.canonicalLinkElement)) {
        this.document.head.appendChild(this.canonicalLinkElement);
      }
    } else {
      if (this.document.contains(this.canonicalLinkElement)) {
        this.canonicalLinkElement.remove();
      }
    }
  }

}
