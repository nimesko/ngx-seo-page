<h1 align="center">Ngx SEO Page</h1>
<p align="center">
  Library that facilitates the management of canonical links, structured data, metatags and the title of web pages built in Angular.
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
  <a href="https://nodei.co/npm/ngx-image/" target="_blank">
    <img src="https://nodei.co/npm/ngx-seo-page.png?downloads=true&downloadRank=true&stars=true">
  </a>
</div>

## Description

This library provides a easy way to manage the structured data, canonical link and metatag in any place of your code in any context (**server context or browser context**).

A common place that you can use is inside the *resolve* method of *Resolve* interface, because after the fetch of data, you can customize the title, add custom microdata and metatags to improve the SEO or usability of your application

## Installation

Use the node package manager to install

```bash
npm i ngx-seo-page
```

or yarn

```bash
yarn add ngx-seo-page
```

## Usage

```typescript
import { PageService } from 'ngx-seo-page';

...

constructor(
  private pageService: PageService
) {}

ngOnInit(): void {
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

...
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nimesko/ngx-seo-page/LICENSE) file for details
