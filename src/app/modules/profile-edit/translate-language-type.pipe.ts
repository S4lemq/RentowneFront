import { Pipe, PipeTransform } from '@angular/core';
import { PreferedLanguage } from '../login/model/prefered-language';


@Pipe({
    name: 'translateLanguageType'
  })
  export class TranslateLanguageType implements PipeTransform {
  
    transform(value: PreferedLanguage | undefined): string {
      switch (value) {
        case PreferedLanguage.POLISH:
          return 'Polski';
        case PreferedLanguage.ENGLISH:
          return 'English';
        case PreferedLanguage.UKRAINIAN:
          return 'Yкраїнська';
        default:
          return 'nieznany';
      }
    }
  }