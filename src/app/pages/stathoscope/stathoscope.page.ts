import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { PatientService } from 'src/app/services/patient.service';
import { WsBleService } from 'src/app/services/ws-ble.service';

PouchDB.plugin(PouchFind);
const db = new PouchDB('patient_stethoscope');

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@Component({
  selector: 'app-stathoscope',
  templateUrl: './stathoscope.page.html',
  styleUrls: ['./stathoscope.page.scss'],
  standalone:false
})
export class StathoscopePage implements OnInit {
  
 @ViewChild('stethoChartCanvas') stethoChartCanvas!: ElementRef;

  patients: any[] = [];
  patient_id: string = '';
  readingHistory: StethoReading[] = [];
  private stethoChart!: Chart;

  constructor(
    private patientService: PatientService,
    private wsService: WsBleService
  ) {}

  async ngOnInit() {
  try {
    const allPatients = await this.patientService.getAllPatient?.();
    this.patients = allPatients || [];

    if (this.patients.length > 0) {
      this.patient_id = this.patients[0]._id;
      await this.getStethoscopeReadings(this.patient_id);
    }
  } catch (err) {
    console.error('Error loading patients:', err);
  }

  this.wsService.connect({
    onOpen: () => this.wsService.send('BleAppletInit'),
    onMessage: (msg) => this.handleStethoscopeMessage(msg),
  });
}


  ngAfterViewInit() {
    setTimeout(() => this.setupChart(), 100);
  }

  setupChart() {
    const ctx = this.stethoChartCanvas.nativeElement.getContext('2d');
    this.stethoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Amplitude',
          data: [],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1,
          pointRadius: 0,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            type: 'linear',
            title: { display: true, text: 'Amplitude' },
          },
        },
      },
    });
  }

  updateChart(data: number[]) {
    const labels = data.map((_, i) => i.toString());
    this.stethoChart.data.labels = labels;
    this.stethoChart.data.datasets[0].data = [...data];
    this.stethoChart.update();
  }

  startStethoscope() {
    this.wsService.send('startScanFromHtml~20');
  }

  async handleStethoscopeMessage(message: string) {
    if (message.startsWith('plotStethoGraph')) {
      try {
        const values = JSON.parse(message.split('~')[1]);
        const waveform = values.map((v: any) => v || 0);
        this.updateChart(waveform);
        await this.saveStethoReading(this.patient_id, waveform);
      } catch (err) {
        console.error('Error parsing stetho graph:', err);
      }
    }
  }

  async saveStethoReading(patientId: string, waveform: number[]) {
    const reading: StethoReading = {
      _id: `stetho_${patientId}_${Date.now()}`,
      type: 'stetho_reading',
      patientId,
      waveform,
      timestamp: new Date().toISOString(),
    };

    await db.put(reading);
    await this.getStethoscopeReadings(this.patient_id);
  }

  async getStethoscopeReadings(patientId: string) {
  try {
    await db.createIndex({
      index: { fields: ['type', 'patientId', 'timestamp'], name: 'stetho_index' },
    });

    const result = await db.find({
      selector: { type: 'stetho_reading', patientId },
      sort: [{ type: 'asc' }, { patientId: 'asc' }, { timestamp: 'asc' }],
    });

    const filtered: StethoReading[] = result.docs
      .map(doc => (this.isStethoReading(doc) ? (doc as StethoReading) : null))
      .filter((r): r is StethoReading => r !== null);

    this.readingHistory = [...filtered].reverse();
  } catch (err) {
    console.error('Error loading stethoscope readings:', err);
  }
}
 onPatientChange(event: any) {
  const selectedId = event.detail?.value || event.target?.value;
  if (selectedId) {
    this.patient_id = selectedId;
    this.getStethoscopeReadings(this.patient_id);
  }
}

  loadReadingToChart(reading: StethoReading) {
    this.updateChart(reading.waveform);
  }

  isStethoReading(doc: any): doc is StethoReading {
    return (
      doc &&
      doc.type === 'stetho_reading' &&
      typeof doc.patientId === 'string' &&
      Array.isArray(doc.waveform) &&
      typeof doc.timestamp === 'string'
    );
  }
}

interface StethoReading {
  _id: string;
  type: 'stetho_reading';
  patientId: string;
  waveform: number[];
  timestamp: string;
}