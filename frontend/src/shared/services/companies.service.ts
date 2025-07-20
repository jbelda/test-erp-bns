import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Company } from '../classes/company';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private apiUrl = environment.apiUrl + '/companies';
  private headers = new HttpHeaders().set('X-Dev-Admin', 'true');

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las empresas
   * @returns Observable<Company[]>
   */
  list(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl, { headers: this.headers });
  }

  /**
   * Guardar una nueva empresa
   * @param company Datos de la empresa a guardar
   * @returns Observable<Company>
   */
  save(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company, { headers: this.headers });
  }

  /**
   * Editar/Actualizar una empresa existente
   * @param company Datos de la empresa a actualizar (debe incluir id)
   * @returns Observable<Company>
   */
  edit(company: Company): Observable<Company> {
    if (!company.id) {
      throw new Error('Se requiere ID de empresa para editar');
    }
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company, { headers: this.headers });
  }

  /**
   * Obtener una empresa por ID
   * @param id ID de la empresa
   * @returns Observable<Company>
   */
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  /**
   * Eliminar una empresa
   * @param id ID de la empresa
   * @returns Observable<void>
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
