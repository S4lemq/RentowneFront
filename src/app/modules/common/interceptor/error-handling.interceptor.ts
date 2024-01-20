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
        console.log(error);
        // Sprawdź, czy błąd jest specyficznym błędem autoryzacji Google.
        if (error.error && ((error.error.message === 'WRONG_GOOGLE_AUTH_CODE') || (error.error.message === 'BAD_CREDENTIALS'))) {
          // Ignoruj ten błąd i przekaż go dalej bez wyświetlania komunikatu.
          return throwError(() => error);
        }
        if(error.status === 504) {
          this.translate.get("snackbar.server-error").subscribe((translatedMessage: string) => {
            this.snackBar.open(translatedMessage, '', {
              duration: 13000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbarError']
            });
          });
          return throwError(() => error);
        }

        // Reszta logiki obsługi błędów...
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
          // Jeśli błąd nie ma kodu, wyświetl domyślny komunikat.
          const defaultMessage = 'Wystąpił nieoczekiwany błąd, skonsultuj się z Administratorem.';
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
