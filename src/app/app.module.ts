import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './components/app.component';
import { LoginComponent } from './components/login/login.component';
import { FilesComponent } from './components/files/files.component';
import { FileUploadFormComponent } from './components/file-upload-form/file-upload-form.component';
import { AppRoutingModule } from './app-routing.module';
import { FolderCreationFormComponent } from './components/folder-creation-form/folder-creation-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RenameFormComponent } from './components/rename-form/rename-form.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './my-rx-stomp.config';
import { ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';
import { FileShareFormComponent } from './components/file-share-form/file-share-form.component';
import { DeleteConfirmFormComponent } from './components/delete-confirm-form/delete-confirm-form.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ExcludeUserPipe } from './pipes/exclude-user.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FilesComponent,
    FileUploadFormComponent,
    FolderCreationFormComponent,
    RenameFormComponent,
    FileSizePipe,
    UserRegistrationComponent,
    FileShareFormComponent,
    DeleteConfirmFormComponent,
    AppHeaderComponent,
    ExcludeUserPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule
  ],
  providers: [CookieService, {
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig
  },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
