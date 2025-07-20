import { Routes } from '@angular/router';
import { CompaniesListComponent } from '../core/companies/companies-list/companies-list.component';
import { CompaniesEditComponent } from '../core/companies/companies-edit/companies-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompaniesListComponent },
  { path: 'companies/edit/:id', component: CompaniesEditComponent },
  { path: 'companies/new', component: CompaniesEditComponent },
  { path: '**', redirectTo: '/companies' }
];
