import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Przepuść request dalej w łańcuchu.
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Sprawdź, czy error ma ciało z kodem.
        if (error.error && error.error.code) {
          // Użyj TranslateService, aby pobrać odpowiedni komunikat.
          const messageKey = `common.message.${error.error.code}`;
          let messageParams = {};

          // Jeżeli 'message' jest różny od 'code', użyj go jako parametru.
          if (error.error.message && error.error.message !== error.error.code) {
            messageParams = { email: error.error.message };
          }
          
          // Pobieranie przetłumaczonego komunikatu z ewentualnym parametrem.
          this.translate.get(messageKey, messageParams).subscribe((translatedMessage: string) => {
            // Wyświetl komunikat za pomocą MatSnackBar.
            this.snackBar.open(translatedMessage, '', {
              duration: 13000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbarError']
            });
          });
        } else {
          console.log("WCHODZI W ELSE")
          // Jeśli błąd nie ma kodu, wyświetl domyślny komunikat.
          const defaultMessage = 'An unexpected error occurred.';
          this.snackBar.open(defaultMessage, '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbarError']
          });
        }
        
        // Przekaż błąd dalej w łańcuchu.
        return throwError(() => error);
      })
    );
  }
}
