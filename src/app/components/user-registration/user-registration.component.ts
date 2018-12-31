import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../validators/must-match';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  confirmPassword: string;
  registerForm: FormGroup;
  submitted = false;
  successMessage: string;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register(): void {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    let username = this.registerForm.controls.username.value;
    let password = this.registerForm.controls.password.value;

    this.userService.register(username, password).subscribe(() => {
      
      // reset the form
      this.submitted = false;
      this.registerForm.reset();
      
      this.notifierService.notify('success', 'User registered successfully!');

    }, (err) => {
      this.notifierService.notify('error', 'An error occured while user registration!');
    });
  }

}
