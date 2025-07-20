import { Component, OnInit, PipeTransform } from '@angular/core';
import { NgbHighlight, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Company } from "../../../shared/classes/company";
import { CompaniesService } from "../../../shared/services/companies.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [
    NgbHighlight,
    NgbPagination,
    RouterModule,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.css'
})
export class CompaniesListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  page = 1;
  pageSize = 4;
  collectionSize = 0;


  constructor(private companiesService: CompaniesService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;
    
    this.companiesService.list().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.filteredCompanies = companies;
        this.loading = false;
        this.collectionSize = this.companies.length;
      },
      error: (error) => {
        this.error = 'Error loading companies: ' + error.message;
        this.loading = false;
        console.error('Error loading companies:', error);
      }
    });
  }

  update(company: Company): void {
    // Validate required fields
    if (!company.name || !company.name.trim()) {
      this.error = 'Company name is required';
      return;
    }
    
    if (!company.address || !company.address.trim()) {
      this.error = 'Company address is required';
      return;
    }
    
    if (!company.phone || !company.phone.trim()) {
      this.error = 'Company phone is required';
      return;
    }
    
    if (!company.email || !company.email.trim()) {
      this.error = 'Company email is required';
      return;
    }

    // Clear any previous errors
    this.error = null;
    this.loading = true;
    
    this.companiesService.edit(company).subscribe({
      next: (updatedCompany) => {
        // Update the company in the list with the response from server
        const index = this.companies.findIndex(c => c.id === updatedCompany.id);
        if (index !== -1) {
          this.companies[index] = updatedCompany;
        }
        this.loading = false;
        console.log('Company updated successfully:', updatedCompany);
      },
      error: (error) => {
        this.error = 'Error updating company: ' + error.message;
        this.loading = false;
        console.error('Error updating company:', error);
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCompanies = this.companies;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCompanies = this.companies.filter((company) => {
        return (
          company.name.toLowerCase().includes(term) ||
          company.address.toLowerCase().includes(term) ||
          company.phone.toLowerCase().includes(term) ||
          company.email.toLowerCase().includes(term)
        );
      });
    }
  }
}
