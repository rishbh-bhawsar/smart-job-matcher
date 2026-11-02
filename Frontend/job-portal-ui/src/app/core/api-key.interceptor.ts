import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) =>
    next(req.clone({ setHeaders: { 'x-api-key': environment.apiKey } }));