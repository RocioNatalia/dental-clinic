import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pacient } from '../pacients-list/patient';
import { mockPacients } from '../pacients-list/mock-patients';

interface Appointment {
  time: string;
  patient?: Pacient;
  attended: boolean;
}

@Component({
  selector: 'app-appointments-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.scss',
})
export class AppointmentsList implements OnInit {
  patients: Pacient[] = mockPacients;

  appointments: Appointment[] = [];
  todayLabel = '';

  allAppointments: Appointment[] = [];
  searchName = '';
  selectedDate = new Date().toISOString().split('T')[0];
  selectedRange = 'all';

  ngOnInit() {
    this.generateAppointments();
  }

  generateAppointments() {
    const start = 8;
    const end = 18;
    const intervals: string[] = [];

    for (let hour = start; hour < end; hour++) {
      intervals.push(`${this.pad(hour)}:00`);
      intervals.push(`${this.pad(hour)}:30`);
    }

    const randomTimes = [...intervals].sort(() => 0.5 - Math.random()).slice(0, 5);

    this.allAppointments = intervals.map((time) => {
      const patient = randomTimes.includes(time)
        ? this.patients[Math.floor(Math.random() * this.patients.length)]
        : undefined;

      return {
        time,
        patient,
        attended: !!patient && Math.random() > 0.5,
      };
    });
  }

  get filteredAppointments() {
    return this.allAppointments
      .filter((app) => {
        const hour = parseInt(app.time.split(':')[0]);
        const inRange =
          this.selectedRange === 'all' ||
          (this.selectedRange === 'morning' && hour >= 8 && hour < 12) ||
          (this.selectedRange === 'afternoon' && hour >= 12 && hour < 18);

        const nameMatch = app.patient
          ? `${app.patient.name} ${app.patient.lastName}`
              .toLowerCase()
              .includes(this.searchName.toLowerCase())
          : this.searchName === '';

        return inRange && nameMatch;
      })
      .sort((a, b) => this.compareTime(a.time, b.time));
  }

  get attendedCount() {
    return this.filteredAppointments.filter((a) => a.attended).length;
  }

  pad(num: number) {
    return num < 10 ? '0' + num : num;
  }

  compareTime(a: string, b: string): number {
    const [hA, mA] = a.split(':').map(Number);
    const [hB, mB] = b.split(':').map(Number);
    return hA * 60 + mA - (hB * 60 + mB);
  }

  formatSpanishDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  removeAppointmentPatient(appointment: Appointment) {
  appointment.patient = undefined;
  appointment.attended = false;
}

}
