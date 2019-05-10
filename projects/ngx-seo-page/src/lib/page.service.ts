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

  /**
   * Refreshes the page using the input parameters.
   * @param page parameter that defines what will refresh on the page
   */
  updatePage(page: Page): void {
    this.title.setTitle(page.title);
    this.updateMetatags(page.metatags);
    this.updateCanonicalLink(page.canonical);
    this.updateMicrodata(page.microdata);
  }

  /**
   * Method that updates metatags, its first action is to remove previously registered metatags to put the new ones.
   * If no metatags was passed, just remove the previous.
   * @param metatags metatags that will be applied
   */
  updateMetatags(metatags: MetaDefinition[] = []): void {
    this.metatags.map(metatag => this.meta.removeTagElement(metatag));
    if (metatags) {
      this.metatags = metatags.map(metatag => this.meta.addTag(metatag));
    }
  }

  /**
   * Method that adds or updates the microdata in the DOM or, if it has no parameters, removes it from the DOM.
   * @param microdata microdata that will be used to apply to a JSON + LD script or, in case of absence of the parameter, its removal
   */
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

  /**
   * Method that will add in the DOM the element that indicates the canonical link or, if no link is passed,
   * will remove the element from the DOM, but will keep in memory.
   * @param link canonical link that will be applied or, if nothing is passed, remove the previously applied link
   */
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
