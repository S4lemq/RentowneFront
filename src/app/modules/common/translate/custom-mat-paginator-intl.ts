import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = this.translate.instant('matPaginator.itemsPerPageLabel');
    this.nextPageLabel = this.translate.instant('matPaginator.nextPageLabel');
    this.previousPageLabel = this.translate.instant('matPaginator.previousPageLabel');
    this.firstPageLabel = this.translate.instant('matPaginator.firstPageLabel');
    this.lastPageLabel = this.translate.instant('matPaginator.lastPageLabel');
    // Dostosuj, jeśli potrzebujesz więcej tłumaczeń
  }
}
