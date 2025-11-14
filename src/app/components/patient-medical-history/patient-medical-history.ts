import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-patient-medical-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-medical-history.html',
  styleUrl: './patient-medical-history.scss',
})
export class PatientMedicalHistory {
  upperTeeth = Array.from({ length: 16 });
  lowerTeeth = Array.from({ length: 16 });

  model: any = {
    nombre: 'Juan Pérez',
    domicilio: 'Av. Siempre Viva 123',
    celular: '11-4444-5555',
    email: 'juan@example.com',
    dni: '40.222.444',
    fn: '',
    edad: '',
    cobertura: 'OSDE',
    afiliado: '123456',
    plan: '210',
    recomendado: '',
    medico: '',
    ocupacion: '',
    motivo: 'Dolor de muela constante hace 3 días.',
    diabetes: false,
    cardio: false,
    hepa: false,
    renal: false,
    cigarrillos: null,
    embarazada: false,
    medicoAutoriza: '',
  };

  async downloadPdf() {

    const odontogramaImg = await this.obtenerOdontogramaBase64();

const odontogramaSection = odontogramaImg
  ? { image: odontogramaImg, width: 350, margin: [0, 10] }
  : { text: 'Odontograma no disponible', italics: true };

    
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    const pdfFonts = await import('pdfmake/build/vfs_fonts.js');

    const pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFonts.default.vfs || pdfFonts.vfs;

    const m = this.model; // para escribir más corto

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],

      content: [
        // TÍTULO
        { text: 'HISTORIA CLÍNICA ODONTOLÓGICA', style: 'title', margin: [0, 0, 0, 10] },

        {
          columns: [
            // COLUMN 1 — DATOS + MOTIVO + ANTECEDENTES
            {
              width: '50%',
              stack: [
                { text: 'Datos del paciente', style: 'sectionTitle' },

                { text: `Apellido y Nombre:  ${m.nombre}`, margin: [0, 2] },
                { text: `Domicilio:  ${m.domicilio}`, margin: [0, 2] },
                { text: `Celular:  ${m.celular}`, margin: [0, 2] },
                { text: `Email:  ${m.email}`, margin: [0, 2] },
                { text: `N° Documento:  ${m.dni}`, margin: [0, 2] },
                { text: `Fecha de nacimiento:  ${m.fn}`, margin: [0, 2] },
                { text: `Edad:  ${m.edad}`, margin: [0, 10] },

                // MOTIVO
                { text: 'Motivo de consulta:', style: 'subTitle' },
                {
                  text:
                    m.motivo ||
                    '.....................................................................................',
                  margin: [0, 5],
                },

                // ANTECEDENTES
                { text: 'Antecedentes médicos', style: 'subTitle', margin: [0, 10, 0, 4] },

                { text: `Diabetes: ${m.diabetes ? '☑ Sí' : '☐ No'}`, margin: [0, 2] },
                { text: `Enfermedades cardíacas: ${m.cardio ? '☑ Sí' : '☐ No'}`, margin: [0, 2] },
                { text: `Enfermedades hepáticas: ${m.hepa ? '☑ Sí' : '☐ No'}`, margin: [0, 2] },
                { text: `Enfermedades renales: ${m.renal ? '☑ Sí' : '☐ No'}`, margin: [0, 2] },

                { text: `Fuma — cigarrillos por día: ${m.cigarrillos ?? 'No'}`, margin: [0, 6] },
              ],
            },

            // COLUMN 2 — COBERTURA + INFO ADICIONAL
            {
              width: '50%',
              stack: [
                { text: 'Cobertura médica', style: 'sectionTitle' },

                { text: `Cobertura: ${m.cobertura}`, margin: [0, 2] },
                { text: `N° Afiliado: ${m.afiliado}`, margin: [0, 2] },
                { text: `Plan: ${m.plan}`, margin: [0, 2] },
                { text: `Recomendado por: ${m.recomendado}`, margin: [0, 2] },
                { text: `Médico de cabecera: ${m.medico}`, margin: [0, 2] },
                { text: `Ocupación: ${m.ocupacion}`, margin: [0, 2] },

                { text: 'Información adicional', style: 'subTitle', margin: [0, 10, 0, 4] },

                { text: `¿Está embarazada?: ${m.embarazada ? '☑ Sí' : '☐ No'}`, margin: [0, 4] },
                { text: `Médico autoriza: ${m.medicoAutoriza || '---'}`, margin: [0, 4] },

                { text: 'Comentarios útiles:', margin: [0, 8] },
                {
                  text: '.....................................................................................',
                  margin: [0, 2],
                },
                {
                  text: '.....................................................................................',
                  margin: [0, 10],
                },
              ],
            },
          ],
        },

        // ODONTOGRAMA
        { text: 'Odontograma', style: 'sectionTitle', margin: [0, 20, 0, 8] },

       odontogramaSection,


        // AUTORIZACIÓN
        {
          text: `Por la presente autorizo a la Dra. Fanny Pardo a realizar los tratamientos que considere necesarios
para la adecuada atención de mi salud bucal. Declaro haber sido informad@ de los procedimientos,
sus riesgos y alternativas.`,
          margin: [0, 20],
          fontSize: 9,
        },

        // FIRMA
        {
          alignment: 'center',
          margin: [0, 30],
          stack: [
            { text: '_____________________________', margin: [0, 5] },
            { text: 'Firma del paciente', fontSize: 10 },
          ],
        },
      ],

      styles: {
        title: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
        },
        subTitle: {
          fontSize: 11,
          bold: true,
        },
      },

      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).download('historia-clinica.pdf');
  }

async obtenerOdontogramaBase64(): Promise<string> {
  const element = document.getElementById('odontogramaCanvas');
  if (!element) {
    console.error("✖ No se encontró el elemento del odontograma");
    return '';
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error("✖ Error generando imagen del odontograma", e);
    return '';
  }
}


}
