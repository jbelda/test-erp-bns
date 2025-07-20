import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Company } from '../../../shared/classes/company';
import { CompaniesService } from '../../../shared/services/companies.service';

@Component({
  selector: 'app-companies-edit',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './companies-edit.component.html',
  styleUrl: './companies-edit.component.css'
})
export class CompaniesEditComponent implements OnInit {
  company: Company = {
    name: '',
    address: '',
    phone: '',
    email: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  loading = false;
  error: string | null = null;
  isNewCompany = false;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.loadCompany(id);
    } else {
      this.isNewCompany = true;
    }
  }

  loadCompany(id: string): void {
    this.loading = true;
    this.companiesService.getById(Number(id)).subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading company: ' + error.message;
        this.loading = false;
        console.error('Error loading company:', error);
      }
    });
  }

  save(): void {
    this.loading = true;
    this.error = null;

    if (this.isNewCompany) {
      this.companiesService.save(this.company).subscribe({
        next: (savedCompany) => {
          console.log('Company saved successfully:', savedCompany);
          this.router.navigate(['/companies']);
        },
        error: (error) => {
          this.error = 'Error saving company: ' + error.message;
          this.loading = false;
          console.error('Error saving company:', error);
        }
      });
    } else {
      this.companiesService.edit(this.company).subscribe({
        next: (updatedCompany) => {
          console.log('Company updated successfully:', updatedCompany);
          this.router.navigate(['/companies']);
        },
        error: (error) => {
          this.error = 'Error updating company: ' + error.message;
          this.loading = false;
          console.error('Error updating company:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/companies']);
  }
}
