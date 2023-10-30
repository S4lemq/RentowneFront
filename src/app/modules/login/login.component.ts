import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { JwtService } from '../common/service/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if(this.formGroup.valid) {
      this.loginService.login(this.formGroup.value)
        .subscribe({
          next: (response) => {
            this.loginError = false;
            if (response.landlordAccess) {
              this.jwtService.setAccessToken(response.accessToken);
              this.jwtService.setRefreshToken(response.refreshToken);  
              this.jwtService.setLandlordAccess(true);
            } else {
              this.loginError = true;//bo nie jest userem tylko adminem
            }
            this.router.navigate([""]);//przekierowanie do głównego panelu, jak chcesz to możesz do np (["/apartments"])
          },
          error: () => this.loginError = true
        })
    }
  }


}
