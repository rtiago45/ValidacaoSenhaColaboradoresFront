import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createColaborador(colaboradorData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/colaborador`, colaboradorData);
  }

  getAllColaboradores(): Observable<any> {
    return this.http.get(`${this.baseUrl}/colaboradores`);
  }
}
