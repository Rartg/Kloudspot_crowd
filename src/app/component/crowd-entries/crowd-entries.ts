import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../layouts/sidebar/sidebar';
import { Vars } from '../../services/vars';
import { Crowdservices } from '../../services/crowdservices';

@Component({
  selector: 'app-crowd-entries',
  imports: [Sidebar, CommonModule],
  templateUrl: './crowd-entries.html',
  styleUrl: './crowd-entries.scss',
})
export class CrowdEntries {

  /* ===========================
     HTML-bound state (DO NOT RENAME)
     =========================== */

  crowdData = signal<any[]>([]);

  currentPage = 1;
  rowsPerPage = 10;

  /* ===========================
     Injected services (renamed)
     =========================== */

  private sharedVars = inject(Vars);
  private crowdApi = inject(Crowdservices);

  /* ===========================
     Lifecycle
     =========================== */

  ngOnInit(): void {
    this.loadcrowddata();
  }

  /* ===========================
     Data loading (HTML SAFE)
     =========================== */

  loadcrowddata() {
    this.fetchCrowdRecords();
  }

  private fetchCrowdRecords(): void {
    this.crowdApi
      .getcrowddata(
        this.sharedVars.siteId,
        this.sharedVars.fromUtc,
        this.sharedVars.toUtc
      )
      .subscribe({
        next: (response) => {
          this.crowdData.set(response.records);
        },
        error: (error) => {
          console.error('Crowd data load failed:', error);
        }
      });
  }

  /* ===========================
     Pagination (HTML SAFE)
     =========================== */

  get totalPages(): number {
    return Math.ceil(this.crowdData().length / this.rowsPerPage);
  }

  get paginatedData() {
    const dataset = this.crowdData();
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return dataset.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
