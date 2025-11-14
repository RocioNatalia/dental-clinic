import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pacient } from './patient';
import { mockPacients } from './mock-patients';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pacients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pacients-list.html',
})
export class PacientsList {
  searchName: string = '';
  pacients: Pacient[] = mockPacients;

constructor(private router : Router){

}

  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredPacients.length / this.pageSize);
  }
  // Filtra los pacientes por nombre o apellido
  get filteredPacients(): Pacient[] {
    const term = this.searchName.toLowerCase();
    return this.pacients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        p.document.toLowerCase().includes(term)
    );
  }

  // Pacientes de la página actual
  get paginatedPacients(): Pacient[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPacients.slice(start, start + this.pageSize);
  }

  // Cambiar página
  changePage(delta: number) {
    const totalPages = Math.ceil(this.filteredPacients.length / this.pageSize);
    this.currentPage = Math.min(Math.max(this.currentPage + delta, 1), totalPages);
  }

  // Acción para ver historia clínica
  viewHistory(pacient: Pacient) {
   this.router.navigateByUrl('app/paciente/' + pacient.id  )
  }

  get responsivePaginatedPacients(): Pacient[] {
    const start = (this.currentPage - 1) * this.pageSize;
    let paginated = this.filteredPacients.slice(start, start + this.pageSize);

    // Detectar si es móvil (ancho < 768px)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      paginated = paginated.slice(0, 5); // solo 5 pacientes
    }

    return paginated;
  }

  addPacient() {}
}
