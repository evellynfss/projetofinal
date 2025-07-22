  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
  import { Router } from '@angular/router';

  import { AuthService } from '../../services/auth.service';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    form: FormGroup;
    loading = false;
    errorMsg = '';

    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router
    ) {
      this.form = this.fb.nonNullable.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        remember: false
      });
    }

    get username(): FormControl {
      return this.form.get('username') as FormControl;
    }

    get password(): FormControl {
      return this.form.get('password') as FormControl;
    }

 onSubmit(): void {
  this.errorMsg = '';
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { username, password, remember } = this.form.getRawValue();

  // Validação simples só para admin/123456
  if (username.toLowerCase() === 'admin' && password === '123456') {
    if (remember) {
      localStorage.setItem('frotaUser', username);
    } else {
      localStorage.removeItem('frotaUser');
    }
    this.router.navigate(['/dashboard']);
  } else {
    this.errorMsg = 'Usuário ou senha inválidos.';
  }
}
  }