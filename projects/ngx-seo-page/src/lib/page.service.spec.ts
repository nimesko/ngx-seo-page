import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { MetaDefinition } from '@angular/platform-browser';

import { PageService } from './page.service';

describe('PageService', () => {

  const queryCanonicalLink = 'link[rel="canonical"]';
  const queryScriptApplicationJsonLd = 'script[type="application/ld+json"]';
  const queryMetaTag = 'meta';

  let pageService: PageService;
  let doc: Document;
  let spyOfUpdateMetatags: any;
  let spyOfUpdateMicrodata: any;
  let spyOfUpdateCanonicalLink: any;

  function generateTitle(): string {
    return `Random Title Generated - ${Math.random() * 1000}`;
  }

  function generateMetatags() {
    return [
      {
        name: 'test', content: 'another test'
      },
      {
        property: 'abc', content: 'xpto'
      },
      {
        charset: '1', content: '2', httpEquiv: '3', id: '4', itemprop: '5', name: '6', property: '7', scheme: '8', url: '9'
      }
    ];
  }

  function convertMetaElementToMetaDefinition(meta: NodeListOf<HTMLMetaElement>): MetaDefinition[] {
    return Array.from(meta)
      .map(m => Object.values(m.attributes)
        .map(a => {
          const obj = {};
          obj[a.name] = a.value;
          return obj;
        })
        .reduce((a, b) => ({ ...a, ...b }))
      )
      .reduce((a, b) => ({ ...a, ...b })) as MetaDefinition[];
  }

  function generateMicrodata(): object {
    return {
      '@type': 'WebSite',
      name: 'Github',
      url: 'https://github.com'
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
    pageService = TestBed.get(PageService);
    doc = TestBed.get(DOCUMENT);
    spyOfUpdateMetatags = spyOn(pageService, 'updateMetatags').and.callThrough();
    spyOfUpdateMicrodata = spyOn(pageService, 'updateMicrodata').and.callThrough();
    spyOfUpdateCanonicalLink = spyOn(pageService, 'updateCanonicalLink').and.callThrough();
  });

  it('should has a valid instance with default state', () => {
    expect(pageService).toBeDefined();
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
  });

  it('should update just the title', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const currentTitle = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title: currentTitle
    });
    expect(doc.title).toEqual(currentTitle);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(spyOfUpdateMetatags).toHaveBeenCalled();
    expect(spyOfUpdateMicrodata).toHaveBeenCalled();
    expect(spyOfUpdateCanonicalLink).toHaveBeenCalled();
    expect(previousMetatags.length).toEqual(doc.querySelectorAll(queryMetaTag).length);
    expect(previousMetatags).toEqual(doc.querySelectorAll(queryMetaTag));
    pageService.updateMetatags();
    pageService.updateMicrodata();
    pageService.updateCanonicalLink();
  });

  it('should update the title and metatags', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const metatags: MetaDefinition[] = generateMetatags();
    const title = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title, metatags
    });
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(spyOfUpdateMetatags).toHaveBeenCalled();
    expect(spyOfUpdateMicrodata).toHaveBeenCalled();
    expect(spyOfUpdateCanonicalLink).toHaveBeenCalled();
    expect(metatags).not.toEqual(convertMetaElementToMetaDefinition(previousMetatags));
    metatags.forEach(meta => {
      const properties = Object.entries(meta).map(e => e.reduce((a, b) => `[${a}="${b}"]`)).join('');
      expect(doc.querySelector(`meta${properties}`)).toBeDefined();
    });
    pageService.updateMetatags();
    pageService.updateMicrodata();
    pageService.updateCanonicalLink();
  });

  it('should update the title and microdata', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const previousMetaDefinition = convertMetaElementToMetaDefinition(previousMetatags);
    const microdata: object = generateMicrodata();
    const title = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title, microdata
    });
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(1);
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(spyOfUpdateMetatags).toHaveBeenCalled();
    expect(spyOfUpdateMicrodata).toHaveBeenCalled();
    expect(spyOfUpdateCanonicalLink).toHaveBeenCalled();
    expect(convertMetaElementToMetaDefinition(doc.querySelectorAll(queryMetaTag))).toEqual(previousMetaDefinition);
    pageService.updateMetatags();
    pageService.updateMicrodata();
    pageService.updateCanonicalLink();
  });

  it('should update the title and canonical link', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const previousMetaDefinition = convertMetaElementToMetaDefinition(previousMetatags);
    const title = generateTitle();
    pageService.updatePage({
      title, canonical: 'https://www.github.com/'
    });
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(0);
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(1);
    expect(spyOfUpdateMetatags).toHaveBeenCalled();
    expect(spyOfUpdateMicrodata).toHaveBeenCalled();
    expect(spyOfUpdateCanonicalLink).toHaveBeenCalled();
    expect(convertMetaElementToMetaDefinition(doc.querySelectorAll(queryMetaTag))).toEqual(previousMetaDefinition);
    pageService.updateMetatags();
    pageService.updateMicrodata();
    pageService.updateCanonicalLink();
  });

});
