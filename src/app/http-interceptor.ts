import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root'
  })
export class AddHeaderInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Clone the request to add the new header
        const clonedRequest = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.authService.authToken) });

        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest);
    }
}