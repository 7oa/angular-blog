import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl('tst@tst.ru', [Validators.required, Validators.email]),
    password: new FormControl('123123', [Validators.required, Validators.minLength(6)])
  });

  loading = false;
  message: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {}

  get f(){
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Login please'
      } else if (params['authFailed']) {
        this.message = 'Login session is over. Login again.'
      }
    })
  }

  submit(){
    if (this.form.invalid) {
      return
    }

    this.loading = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

}
