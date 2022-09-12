import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MetaDefinition } from '@angular/platform-browser';
import { WithContext, WebSite } from 'schema-dts';

import { PageService } from './page.service';

const queryCanonicalLink = 'link[rel="canonical"]';
const queryScriptApplicationJsonLd = 'script[type="application/ld+json"]';
const queryMetaTag = 'meta';
const generateTitle = () => `Random Title Generated - ${Math.random() * 1000}`;
const generateSchema = (): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Github',
  url: 'https://github.com',
});

const generateMetatags = () => [
  {
    name: 'test',
    content: 'another test',
  },
  {
    property: 'abc',
    content: 'xpto',
  },
  {
    charset: '1',
    content: '2',
    httpEquiv: '3',
    id: '4',
    itemprop: '5',
    name: '6',
    property: '7',
    scheme: '8',
    url: '9',
  },
];
const convertMetaElementToMetaDefinition = (
  meta: NodeListOf<HTMLMetaElement>
) =>
  Array.from(meta)
    .map((m) =>
      Object.values(m.attributes)
        .map((a) => {
          const obj: any = {};
          obj[a.name] = a.value;
          return obj;
        })
        .reduce((a, b) => ({ ...a, ...b }))
    )
    .reduce((a, b) => ({ ...a, ...b }), {}) as MetaDefinition[];

describe('PageService', () => {

  let pageService: PageService;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
    pageService = TestBed.inject(PageService);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should has a valid instance with default state', () => {
    expect(pageService).toBeDefined();
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
  });

  it('should not update the title', () => {
    const previousTitle = doc.title;
    pageService.updatePage({});
    expect(doc.title).toBe(previousTitle);
  });

  it('should update just the title', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const currentTitle = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title: currentTitle,
    });
    expect(doc.title).toEqual(currentTitle);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(previousMetatags.length).toEqual(
      doc.querySelectorAll(queryMetaTag).length
    );
    expect(previousMetatags).toEqual(doc.querySelectorAll(queryMetaTag));
    pageService.updateMetatags();
    pageService.updateSchema();
    pageService.updateCanonicalLink();
  });

  it('should update the title and metaTags', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const metaTags = generateMetatags() as MetaDefinition[];
    const title = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title,
      metaTags,
    });
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    expect(metaTags).not.toEqual(
      convertMetaElementToMetaDefinition(previousMetatags)
    );
    metaTags.forEach((meta) => {
      const properties = Object.entries(meta)
        .map((e) => e.reduce((a, b) => `[${a}='${b}']`))
        .join('');
      expect(doc.querySelector(`meta${properties}`)).toBeDefined();
    });
    pageService.updateMetatags();
    pageService.updateSchema();
    pageService.updateCanonicalLink();
  });

  it('should update the title and schema', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const previousMetaDefinition =
      convertMetaElementToMetaDefinition(previousMetatags);
    const schema = generateSchema();
    const title = generateTitle();
    expect(doc.title).toEqual(previousTitle);
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(0);
    pageService.updatePage({
      title,
      schema,
    });
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      1
    );
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(
      convertMetaElementToMetaDefinition(doc.querySelectorAll(queryMetaTag))
    ).toEqual(previousMetaDefinition);
    pageService.updateMetatags();
    pageService.updateSchema();
    pageService.updateCanonicalLink();
  });

  it('should update the title and canonical link', () => {
    const previousTitle = doc.title;
    const previousMetatags = doc.querySelectorAll(queryMetaTag);
    const previousMetaDefinition =
      convertMetaElementToMetaDefinition(previousMetatags);
    const title = generateTitle();
    pageService.updatePage({
      title,
      canonical: 'https://www.github.com/',
    });
    expect(doc.querySelectorAll(queryScriptApplicationJsonLd).length).toEqual(
      0
    );
    expect(doc.title).toEqual(title);
    expect(doc.title).not.toEqual(previousTitle);
    expect(doc.querySelectorAll(queryCanonicalLink).length).toEqual(1);
    expect(
      convertMetaElementToMetaDefinition(doc.querySelectorAll(queryMetaTag))
    ).toEqual(previousMetaDefinition);
    pageService.updateMetatags();
    pageService.updateSchema();
    pageService.updateCanonicalLink();
  });
});
