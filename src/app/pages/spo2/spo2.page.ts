import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js';
import { PatientService } from 'src/app/services/patient.service';
import { WsBleService } from 'src/app/services/ws-ble.service';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';

PouchDB.plugin(PouchFind);
const db = new PouchDB('patient_spo2');

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@Component({
  selector: 'app-spo2',
  templateUrl: './spo2.page.html',
  styleUrls: ['./spo2.page.scss'],
  standalone:false
})
export class Spo2Page implements AfterViewInit, OnInit {
  @ViewChild('spo2ChartCanvas') spo2ChartCanvas!: ElementRef;

  pulseRate: number | null = null;
  spo2: number | null = null;
  private spo2Chart!: Chart;
  private dongleConnected = false;

  patients: any[] = [];
  patient_id: string = '';
  readingHistory: Spo2Reading[] = [];

  constructor(
    private wsService: WsBleService,
    public patientService: PatientService
  ) {}

  async ngOnInit() {
    try {
      const allPatients = await this.patientService.getAllPatient?.();
      this.patients = allPatients || [];

      if (this.patients.length > 0) {
        this.patient_id = this.patients[0]._id;
        await this.getSpo2Readings(this.patient_id);
      }
    } catch (err) {
      console.error('Error loading patients:', err);
    }

    this.wsService.connect({
      onOpen: () => {
        this.wsService.send('BleAppletInit');
        this.wsService.send('startScanFromHtml~50');
      },
      onMessage: (msg) => this.handleBleMessage(msg),
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.spo2ChartCanvas?.nativeElement) {
        this.setupChart();
        this.updateChartFromHistory();
      }
    }, 100);
  }

  setupChart() {
    const ctx = this.spo2ChartCanvas.nativeElement.getContext('2d');
    if (this.spo2Chart) this.spo2Chart.destroy();

    this.spo2Chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'SPO2 (%)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 2,
            fill: false,
            tension: 0.3,
            yAxisID: 'y',
          },
          {
            label: 'BPM',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointRadius: 2,
            fill: false,
            tension: 0.3,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            suggestedMin: 80,
            suggestedMax: 100,
            title: { display: true, text: 'SPO2 (%)' },
          },
          y1: {
            type: 'linear',
            position: 'right',
            suggestedMin: 50,
            suggestedMax: 150,
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'BPM' },
          },
        },
      },
    });
  }

  updateSpo2Chart(spo2Data: number[], pulseData: number[], labels: string[]) {
    if (!this.spo2Chart) return;

    this.spo2Chart.data.labels = labels;
    this.spo2Chart.data.datasets[0].data = spo2Data;
    this.spo2Chart.data.datasets[1].data = pulseData;

    this.spo2Chart.update();
  }

  updateChartFromHistory() {
    const spo2Data = this.readingHistory.map(r => r.spo2);
    const pulseData = this.readingHistory.map(r => r.pulseRate);
    const labels = this.readingHistory.map(r =>
      new Date(r.timestamp).toLocaleTimeString()
    );

    this.updateSpo2Chart(spo2Data, pulseData, labels);
  }

  async getSpo2Readings(patientId: string): Promise<void> {
  try {
    // ✅ Ensure composite index exists
    await db.createIndex({
      index: {
        fields: ['type', 'patientId', 'timestamp'],
        name: 'spo2_index'
      }
    });

    // ✅ Query using selector + sort on indexed fields
    const result = await db.find({
      selector: {
        type: 'spo2_reading',
        patientId: patientId,
      },
      sort: [
        { type: 'asc' },
        { patientId: 'asc' },
        { timestamp: 'asc' }
      ],
    });

    const filtered: Spo2Reading[] = result.docs
      .map(doc => (this.isSpo2Reading(doc) ? (doc as Spo2Reading) : null))
      .filter((r): r is Spo2Reading => r !== null);

    this.readingHistory = [...filtered].reverse();
    this.updateChartFromHistory();

    if (this.readingHistory.length > 0) {
      this.pulseRate = this.readingHistory[0].pulseRate;
      this.spo2 = this.readingHistory[0].spo2;
    }
  } catch (err) {
    console.error('Error fetching SPO2 readings:', err);
  }
}


  startScan() {
    this.wsService.send('startScanFromHtml~50');
  }

  async saveSpo2Reading(patientId: string, spo2: number, pulse: number) {
    const timestamp = new Date().toISOString();
    const reading: Spo2Reading = {
      _id: `spo2_${patientId}_${Date.now()}`,
      type: 'spo2_reading',
      patientId,
      spo2,
      pulseRate: pulse,
      timestamp,
    };

    try {
      await db.put(reading);
      await this.getSpo2Readings(patientId);
    } catch (err) {
      console.error('Error saving SPO2 reading:', err);
    }
  }

  async handleBleMessage(message: string) {
    if (message.startsWith('pulseRateForSpo2')) {
      const data = JSON.parse(message.split('~')[1]);
      this.pulseRate = data[1];

      if (this.pulseRate && this.spo2) {
        await this.saveSpo2Reading(this.patient_id, this.spo2, this.pulseRate);
      }
    } else if (message.startsWith('setCurrentSpo2')) {
      const spo2Val = Number(message.split('~')[1]);
      this.spo2 = spo2Val <= 100 ? spo2Val : null;

      if (this.spo2 && this.pulseRate) {
        await this.saveSpo2Reading(this.patient_id, this.spo2, this.pulseRate);
      }
    } else if (message.startsWith('plotSpo2Graph')) {
      try {
        const values = JSON.parse(message.split('~')[1]);
        const spo2Values = values.map((v: any) => v.spo2 || 0);
        const pulseValues = values.map((v: any) => v.pulseRate || 0);
        const now = Date.now();
        const labels = values.map((_: any, i: number) =>
          new Date(now + i * 1000).toLocaleTimeString()
        );

        this.updateSpo2Chart(spo2Values, pulseValues, labels);
      } catch (e) {
        console.error('Error parsing plotSpo2Graph message:', e);
      }
    }
  }

  isSpo2Reading(doc: any): doc is Spo2Reading {
    return (
      doc &&
      doc.type === 'spo2_reading' &&
      typeof doc.patientId === 'string' &&
      typeof doc.spo2 === 'number' &&
      typeof doc.pulseRate === 'number' &&
      typeof doc.timestamp === 'string'
    );
  }

  loadReadingToChart(_reading: Spo2Reading) {
    this.updateChartFromHistory();
  }
}

interface Spo2Reading {
  _id: string;
  type: 'spo2_reading';
  patientId: string;
  spo2: number;
  pulseRate: number;
  timestamp: string;
}
