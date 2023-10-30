import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../login/login.service';
import { JwtService } from '../../common/service/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-login',
  templateUrl: './tenant-login.component.html',
  styleUrls: ['./tenant-login.component.scss']
})
export class TenantLoginComponent implements OnInit {

  private readonly REDIRECT_ROUTE = "tenant/profile";
  formGroup!: FormGroup;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jwtService.isLoggedIn()) {
      this.router.navigate([this.REDIRECT_ROUTE]);
    }

    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if(this.formGroup.valid) {
      this.loginService.login(this.formGroup.value)
      .subscribe({
        next: response => {
          this.jwtService.setAccessToken(response.accessToken);
          this.jwtService.setRefreshToken(response.refreshToken);  
          this.router.navigate([this.REDIRECT_ROUTE]);
          this.loginError = false
        },
        error: () => this.loginError = true
      });
    }
  }

}
