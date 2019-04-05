import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { PageService } from 'projects/ngx-seo-page/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private pageService: PageService
  ) { }

  ngOnInit(): void {
    this.pageService.updatePage({
      title: 'Changing the title of NGX Page'
    });
  }

}
