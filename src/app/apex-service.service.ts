import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApexServiceService {
  private ROOT_URL = `${environment.url}/api/apex`;

  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get(this.ROOT_URL);
  }

  getFile(): Observable<any> {
    return this.http.get(`${this.ROOT_URL}/file`, {responseType: 'blob'});
  }

  uplodad(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.ROOT_URL}/upload`, formData);
  }
}
