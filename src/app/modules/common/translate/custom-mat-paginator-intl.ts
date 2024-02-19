import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe(() => {
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

    // Oto zmiana
    this.getRangeLabel = this.getRangeLabelTranslated;
  }

  getRangeLabelTranslated(page: number, pageSize: number, length: number): string {
    if (length == 0 || pageSize == 0) { 
      return `0 ${this.translate.instant('matPaginator.rangeLabel')} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${this.translate.instant('matPaginator.rangeLabel')} ${length}`;
  }
}

