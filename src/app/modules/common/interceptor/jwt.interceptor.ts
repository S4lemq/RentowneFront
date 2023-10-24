import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtService } from "../service/jwt.service";
import { Observable } from "rxjs";


@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    
    constructor(private jwtService: JwtService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.jwtService.getAccessToken();
        if(token) {
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
        }
        return next.handle(req);
    }

}