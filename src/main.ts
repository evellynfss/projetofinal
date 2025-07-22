import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';         // <<<<< importante
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environment/environment';
// main.ts

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),            // <<<<< aqui registra o provider de Auth
    provideFirestore(() => getFirestore()),
  ],
}).catch(err => console.error(err));

