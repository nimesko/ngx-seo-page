import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { Page } from './page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private metatags: HTMLMetaElement[];

  private readonly microdataBaseObject: object;
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
    this.metatags.map(metatag => this.meta.removeTagElement(metatag));
    if (metatags) {
      this.metatags = metatags.map(metatag => this.meta.addTag(metatag));
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
