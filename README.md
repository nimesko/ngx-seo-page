# Ngx SEO Page

Library that facilitates the management of canonical links, structured data, metatags and the title of web pages built in Angular.

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
