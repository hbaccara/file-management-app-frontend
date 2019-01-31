import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RxStompService } from '@stomp/ng2-stompjs';
import { rxStompConfig } from 'src/app/rx-stomp.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService,
    private formBuilder: FormBuilder,
    private rxStompService: RxStompService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login(): void {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    let username = this.loginForm.controls.username.value;
    let password = this.loginForm.controls.password.value;

    this.authService.login(username, password)
      .subscribe((data) => {

        if (!data) {
          this.notifierService.notify('error', 'Your username and/or password are incorrect!');
          return;
        }

        const userId = data.id;
        const authToken = data.token;

        this.activateRxStompService(authToken);

        this.authService.setLoggedIn(userId, authToken);

        const url = this.authService.redirectUrl ? this.authService.redirectUrl : 'home';
        this.router.navigate([url]); 

      }, (err) => {
        this.notifierService.notify('error', 'Couldn\'t login: An error occured!');
      });
  }

  activateRxStompService(authToken: string) {
    rxStompConfig.brokerURL = rxStompConfig.brokerURL + '?t=' + authToken;
    //rxStompConfig.connectHeaders = rxStompConfig.connectHeaders || {};
    //rxStompConfig.connectHeaders['Authorization'] = 'Bearer ' + authToken;
    this.rxStompService.configure(rxStompConfig);
    this.rxStompService.activate();
  }

}
