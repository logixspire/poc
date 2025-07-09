import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  constructor(public objLoginService: LoginService, private router: Router) { }

  ngOnInit() {
    if (this.objLoginService.isLoggedIn()) {
      console.log('logged in, redirecting');
      var userrole = localStorage.getItem('user-role')
      if(userrole == 'doctor'){
        this.router.navigate(['/home']);  
      }
      else {
        this.router.navigate(['/nurse-dashboard']);
      }

      // this.router.navigate(['/home']); 
    }
  }

  auth() {
    this.objLoginService.login().subscribe(
      (res: any) => {
        console.log(res.user.id)
        localStorage.setItem('auth_token', res.accessToken)
        this.objLoginService.findUser(res.user.id).subscribe(
          (res:any)=>{
            console.log(res.role)
            localStorage.setItem('user-role', res.role)
            if(res.role == 'doctor'){
            this.router.navigate(['/home']);  
            }
            else{
              this.router.navigate(['/nurse-dashboard']);
            }
          }
        )
        this.objLoginService.isAuthenticated = true
      },
      err => {
        this.objLoginService.isAuthenticated = false
        alert('Login failed !')
      }
    )
  }
}

