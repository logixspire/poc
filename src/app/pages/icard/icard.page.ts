import { Component, OnInit } from '@angular/core';
// import data from './icard.json'
import data from './icard copy.json'

@Component({
  selector: 'app-icard',
  templateUrl: './icard.page.html',
  styleUrls: ['./icard.page.scss'],
  standalone: false
})
export class IcardPage implements OnInit {


  arrmCard: mCard[] = []
  constructor() {
    this.arrmCard = data
  }

  ngOnInit() {
  }

}


export class mCard {
  id: string = ''
  name: string = ''
  nagar: string = ''
  vasti: string = ''
  mobile: string = ''
  business: string = ''
  // dob: string = ''
  bg: string = ''
  donation: string = ''
}
