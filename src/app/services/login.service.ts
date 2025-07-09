import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  pmUser: mUser = new mUser()
 public isAuthenticated = false;

  constructor(private http: HttpClient) { }

  login(){
    return this.http.post(environment.apiBaseUrl + 'auth/login', this.pmUser)
  }

  findUser(id:string){
    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
    return this.http.get(environment.apiBaseUrl + 'users/'+id, { headers })
  }

  
  isLoggedIn(): boolean {
     var token = localStorage.getItem('auth_token')
    if ( token != undefined) {
      return true
    }
    else {
      return false  
    }
    // return this.isAuthenticated;
  }
}


export class mUser{
  username: string = ''
  password: string = ''
}

export interface userDetails {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
  status: string
  phoneNumber: any
  department: any
  specialization: any
  bio: any
  isAvailable: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}