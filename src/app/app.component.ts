import { Component } from '@angular/core';
// import { PermissionsAndroid } from '@ionic-native/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    // this.requestPermissions()
  }

  // async requestPermissions() {
  // const granted = await PermissionsAndroid.requestMultiple([
  //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  // ]);
  //   console.log('Permissions:', granted);
  // }
}
