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
   * Get all companies
   * @returns Observable<Company[]>
   */
  list(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl, { headers: this.headers });
  }

  /**
   * Save a new company
   * @param company Company data to save
   * @returns Observable<Company>
   */
  save(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company, { headers: this.headers });
  }

  /**
   * Edit/Update an existing company
   * @param company Company data to update (must include id)
   * @returns Observable<Company>
   */
  edit(company: Company): Observable<Company> {
    if (!company.id) {
      throw new Error('Company ID is required for editing');
    }
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company, { headers: this.headers });
  }

  /**
   * Get a single company by ID
   * @param id Company ID
   * @returns Observable<Company>
   */
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  /**
   * Delete a company
   * @param id Company ID
   * @returns Observable<void>
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
