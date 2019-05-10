<h1 align="center">Ngx SEO Page</h1>
<p align="center">
  Library that facilitates the management of canonical links, metatags, structured data and the title of web pages.
</p>
<div align="center">
  <img alt="Build" src="https://img.shields.io/travis/nimesko/ngx-seo-page.svg">
  <img alt="Code coverage" src="https://img.shields.io/codacy/coverage/add8d2b1eb2c4fff98f55c0392e88d1f.svg">
  <img alt="Dependencies" src="https://img.shields.io/david/nimesko/ngx-seo-page.svg">
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/nimesko/ngx-seo-page.svg">
  <img alt="Stats" src="https://img.shields.io/npm/dw/ngx-seo-page.svg">
  <img alt="Collaborators" src="https://img.shields.io/npm/collaborators/ngx-seo-page.svg">
</div>
<div align="center">
  <a href="https://nodei.co/npm/ngx-seo-page/" target="_blank">
    <img src="https://nodei.co/npm/ngx-seo-page.png?downloads=true&downloadRank=true&stars=true">
  </a>
</div>

## Description

Building an angular application is pretty easy, but leaving it with a good score on the crawlers already starts to complicate. With the advent of new techniques for SEO and how the web pages are built, questions arise that begin to get more complex in your project.

Two of them are: [canonical links](https://en.wikipedia.org/wiki/Canonical_link_element) and [structured data](https://schema.org/)

It is of utmost importance to use these two artifacts to succeed in SEO. And as this process begins on the server, this library has been developed with a single goal: **to provide SEO resolution and optimization ways to render the application on the server**.

## Installation

Use the node package manager to install: `npm i ngx-seo-page` or yarn  `yarn add ngx-seo-page` and its done!

There is no more configuration to install.

## Usage

It is very simple to use this library but, first of all, I advise its use in two points:

* If you are using a [Resolve](https://angular.io/api/router/Resolve), use [tap](https://www.learnrxjs.io/operators/utility/do.html) to use the library

```typescript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PageService } from 'ngx-seo-page';

import { ApiService } from '@application/core/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DMCAResolverService implements Resolve<any> {

  constructor(
    private apiService: ApiService,
    private pageService: PageService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.apiService.fetchSomeRandomData().pipe(
      tap(() => {
        this.pageService.updatePage({
          title: 'Some Random Title',
          microdata: {
            '@type': 'WebSite',
            name: 'Github',
            url: 'https://github.com'
          },
          metatags: [
            { name: 'description', content: 'Description XPTO' },
            { property: 'og:url', content: 'https://github.com/' },
            { property: 'og:title', content: 'Github' }
          ],
          canonical: 'https://www.github.com/'
        });
      })
    );
  }

}
```

* But you you are not using a Resolve and just a simple component, it is preferable that you place inside on [OnInit](https://angular.io/api/core/OnInit)

```typescript

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageService } from 'ngx-seo-page';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomComponent implements OnInit {

  constructor(
    private pageService: PageService
  ) {}

  ngOnInit() {
    this.pageService.updatePage({
      title: 'Some Random Title',
      microdata: {
        '@type': 'WebSite',
        name: 'Github',
        url: 'https://github.com'
      },
      metatags: [
        { name: 'description', content: 'Description XPTO' },
        { property: 'og:url', content: 'https://github.com/' },
        { property: 'og:title', content: 'Github' }
      ],
      canonical: 'https://www.github.com/'
    });
  }

}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Good to Know

This library works with SSR (Server Side Rendering, aka Universal Application).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nimesko/ngx-seo-page/LICENSE) file for details
