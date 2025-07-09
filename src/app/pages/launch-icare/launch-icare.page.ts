import { Component, OnInit } from '@angular/core';
import { NovaIcareLauncher } from 'src/app/plugins/nova-icare-launcher';
import { NovaIcareService } from 'src/app/services/nova-icare.service';
// declare let cordova: any;

declare global {
  interface Window {
    cordova: any;
  }
}

@Component({
  selector: 'app-launch-icare',
  templateUrl: './launch-icare.page.html',
  styleUrls: ['./launch-icare.page.scss'],
  standalone: false
})


export class LaunchIcarePage implements OnInit {


  ngOnInit(): void {
    //   console.log('window.cordova:', window?.cordova);
    // console.log('window.cordova.plugins:', window?.cordova?.plugins);
    // console.log('window.cordova.plugins.intent:', window?.cordova?.plugins?.intent);
    // this.launchNovaICareWithExtras();
  }

  launchNovaICareWithExtras() {
    const extras = {
      class_name: 'com.logixspire.remedi.MainActivity',
      package_name: 'com.logixspire.remedi',
      language: 'en',
      patient_id: '12345',
      real_id: ''
    };

    if (window?.cordova?.plugins?.intent) {
      window.cordova.plugins.intent.startActivity(
        {
          action: "android.intent.action.VIEW",
          package: "com.neurosynaptic.nova_icare",
          class: "com.neurosynaptic.usb.StethoSensor",
          extras
        },
        () => console.log('Intent launched'),
        (err: any) => console.error('Intent failed', err)
      );
    } else {
      alert("Cordova Intent plugin not available — make sure you're running on Android and built properly.");
    }
  }

  async launchStethoscope() {

    NovaIcareLauncher.launchStethoWithResult({
      // class_name: 'com.neurosynaptic.ble.sensors.CE_Certification_Luncher_Activity',
      // package_name: 'com.neurosynaptic.nova_icare',
      class_name: 'com.logixspire.remedi.MainActivity',
      package_name: 'com.logixspire.remedi',
      language: 'en',
      patient_id: '12345',
      real_id: ''
    }).then(result => {
      console.log('🎯 Result received from StethoSensor:', result);
    }).catch(err => {
      console.error('❌ Failed or cancelled:', err);
    });
  }
}
