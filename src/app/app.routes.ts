import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Layout } from './layout/layout';
import { PacientsList } from './components/pacients-list/pacients-list';
import { AppointmentsList } from './components/appointments-list/appointments-list';
import { PatientMedicalHistory } from './components/patient-medical-history/patient-medical-history';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: 'app',
    component: Layout,
    children: [
      { path: 'agenda', component: AppointmentsList },
      { path: 'pacientes', component: PacientsList },
      { path: 'paciente/:id', component: PatientMedicalHistory  },
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
