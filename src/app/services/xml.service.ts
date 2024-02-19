import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileData } from '../interfaces/file-data';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SaveResponse } from '../interfaces/save-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class XmlService {
  constructor(private http: HttpClient) {}

  getXmlList(): Observable<FileData[]> {
    return this.http.get<FileData[]>(
      environment.backendBaseUrl + '/reader/all'
    );
  }

  saveXmlFiles(xmlFiles: File[]): Observable<SaveResponse> {
    const formData: FormData = new FormData();
    for (let i = 0; i < xmlFiles.length; i++) {
      formData.append('files', xmlFiles[i], xmlFiles[i].name);
    }
    return this.http.post<SaveResponse>(
      environment.backendBaseUrl + '/reader/save',
      formData
    );
  }

  downloadXmlFile(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(
      environment.backendBaseUrl + `/reader/download/${id}`,
      { responseType: 'blob', observe: 'response' }
    );
  }
}
