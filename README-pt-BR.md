# guide-angular-pwa
Get Started / Tutorial / Guide - Angular + Progressive Web App (PWA)

# 1. Docker
## 1.1 Iniciar container do docker para subir o ambiente com o servidor.
    docker run -it -v /var/www:/var/www -p 4200:4200 --name node-front ryubr/node-alpine
    
Leia a descrição da imagem do docker para saber mais sobre esta imagem [ryubr/node-alpine](https://hub.docker.com/r/ryubr/node-alpine)
## 1.2 Entre na pasta compartilhada entre a sua maquina e o container. 
    cd /var/www    
# 2. Angular-CLI
## 2.1 Criando um projeto angular usando o Angular-CLI e entrando na pasta do projeto.
    ng new guide-angular-pwa /
    cd guide-angular-pwa
Learn more about [Angular-CLI](https://cli.angular.io/)
## 2.2 Incluindo o framework de template Angular Material 2.
    npm install --save @angular/material@2.0.0-beta.2
Saiba mais sobre [Material Angular](https://material.angular.io/)
## 2.3 Add MaterialModule as an import in app.module.ts
    import { MaterialModule } from '@angular/material';
    
    @NgModule({
      ...
      imports: [
        ...
        MaterialModule
      ]
## 2.4 Adicionando os icones do Material Design e o tema no arquivo styles.css (Esse arquivo é onde fica os estilus globais deste app)
    @import '~https://fonts.googleapis.com/icon?family=Material+Icons';
    @import '~@angular/material/core/theming/prebuilt/deeppurple-amber.css';
    
    body {
      margin: 0;
      font-family: Roboto, sans-serif;
    }
## 2.5 Edite e substitua o conteudo do arquivo: src/app/app.component.html (This file is like an app template)
    <md-toolbar color="primary">
      <span>{{title}}</span>
    </md-toolbar>
## 2.6 Ligar o servidor com o webkit no angular-cli
    ng server --host 0.0.0.0
Voila, é bom dar uma olhada em como está ficando.

Nota: --host 0.0.0.0 por que está rodando dentro de um container de docker.

# 3. Angular Component - Vamos criar um componente com a lista de usuarios.
## 3.1 Create component with angular-cli
    ng g c user/user-list
Nota: g = generate and c = compoment.
## 3.1 Edit end replace the contents of the file src/app/user/user-list/user-list.component.html
    <h2>User List</h2>
    <md-list>
      <md-list-item *ngFor="let user of users">
        <h3 md-line>
          {{user.name}}
        </h3>
      </md-list-item>
    </md-list>
## 3.2 Edit the file src/app/user/user-list.component.ts
    import ...
    @Component({
      ...
    })
    export class UserListComponent implements OnInit {
      ...
      users = [
        {name: 'Ryu', img: {url: 'https://img00.deviantart.net/b6bd/i/2016/066/5/1/sfv__ryu_by_anubisdhl-d9ub64x.jpg'}},
        {name: 'Ken', img: {url: 'https://vignette.wikia.nocookie.net/streetfighter/images/b/b4/Kenrender.png/revision/latest/scale-to-width-down/350?cb=20170728171332'}},
        {name: 'Akuma', img: {url: 'https://criticalhits.com.br/wp-content/uploads/2016/09/akuma-tekken-7.jpg'}},
        {name: 'Chun-Li', img: {url: 'https://i.kinja-img.com/gawker-media/image/upload/s--b_HbiJxa--/c_scale,fl_progressive,q_80,w_800/eec1fnvluhc0b5lugorm.jpg'}},
      ];
    }
## 3.3 Run server
    ng server --host 0.0.0.0
Voila, it's good to look at how you're doing.

# 4. Service Worker - Let's make the app work offline
## 4.1 Make sure the app does not go offline by chrome too developper
In Chrome: Press F12 and go to network tab, check Offline and press F5
Will show the screen without connection
## 4.2 Create a file src/service-worker.js
    touch src/service-worker.js
## 4.3 Edit a file src/service-worker.js
    let log = console.log.bind(console);
    let err = console.error.bind(console);
    
    let version = '1';
    let cacheName = 'pwa-client-v' + version;
    let dataCacheName = 'pwa-client-data-v' + version;
    let appShellFilesToCache = [
      './',
      './index.html',
      './inline.bundle.js',
      './styles.bundle.js',
      './vendor.bundle.js',
      './main.bundle.js'
    ];
    
    self.addEventListener('install', (e) => {
      e.waitUntil(self.skipWaiting());
      log('Service Worker: Installed');
    
      e.waitUntil(
        caches.open(cacheName).then((cache) => {
          log('Service Worker: Caching App Shell');
          return cache.addAll(appShellFilesToCache);
        })
      );
    });
    
    self.addEventListener('activate', (e) => {
      e.waitUntil(self.clients.claim());
      log('Service Worker: Active');
    
      e.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
    
            if (key !== cacheName) {
              log('Service Worker: Removing old cache', key);
              return caches.delete(key);
            }
    
          }));
        })
      );
    });
    
    self.addEventListener('fetch', (e) => {
      log('Service Worker: Fetch URL ', e.request.url);
    
      // Match requests for data and handle them separately
      e.respondWith(
        caches.match(e.request.clone()).then((response) => {
          return response || fetch(e.request.clone()).then((r2) => {
              return caches.open(dataCacheName).then((cache) => {
                console.log('Service Worker: Fetched & Cached URL ', e.request.url);
                cache.put(e.request.url, r2.clone());
                return r2.clone();
              });
            });
        })
      );
    });
## 4.4 Edit a file index.html and put this in the end of file before of the </body tag to register this service worker
    <script>
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register('service-worker.js').then(() => {
          console.log('Service worker installed')
        }, err => {
          console.error('Service worker error:', err);
        });
      }
    </script>
TIP: If you have issues with pasting the JavaScript above into IntelliJ, you may need to set the default JavaScript language version to ECMAScript 6. You can do this under Preferences > Languages & Frameworks > JavaScript.
## 4.5 Edit a file: .angular-cli.json and enter the angular-cli on the new file: src / service-worker.js
    {
      ...
      "apps": [
        {
          ...
          "assets": [
            ...
            "service-worker.js"
          ],
          ...
        }
      ],
      ...
## 4.6 Run server
    ng server --host 0.0.0.0
## 4.7 Make sure the app does go offline by chrome too developper
In Chrome: Press F12 and go to network tab, check Offline and press F5.
Voila, it's good to look at how you're doing.
# 5. App Shell
## 5.1 Install App Shell for angular.
    npm install @angular/app-shell --save
NOTE: Angular App Shell is a project that provides shellRender and shellNoRender directives. Using these directives, you can specify which parts of your app are included in an app shell. Start by installing app-shell into your project.
## 5.2 Edit a file src/app/app.module.ts and Import the AppShellModule specify it as an import.
    import { AppShellModule } from '@angular/app-shell';
    
    @NgModule({
      ...
      imports: [
        ...
        AppShellModule.runtime()
      ],
    ...
## 5.3 Edit a file src/app/app.component.html to use app-shell’s directives
    <md-toolbar color="primary">
      <span>{{title}}</span>
    </md-toolbar>
    
    <md-progress-bar mode="indeterminate" *shellRender></md-progress-bar>
    <div *shellNoRender>
      <app-user-list></app-user-list>
    </div>
## 5.4 Run server
    ng server --host 0.0.0.0
Voila, it's good to look at how you're doing.
# 6 Manifest - Make app is installable.
## 6.1 Create a Manifest file.
The final step to making your app a PWA is to add a manifest that describes the application. This also enables the ability for people to install your app in Chrome as well as on smart phones.

You can use Favicon Generator to generate graphic assets and a manifest.json file. For an app icon, I searched for “beer icons” and found this one, developed by Freepik. I generated a favicon, changed the generator options to use assets/favicons for the path, and downloaded the favicon package.

Copy the contents of favicons.zip to src/assets/icons and add the following HTML to the <head> of index.html.
## 6.2 Editar o arquivo: src/assets/favicons/manifest.json
    {
      "name": "Guide Angular PWA",
      "short_name": "Angular-PWA",
        "icons": [
            {
                "src": "/assets/favicons/favicon-16x16.png",
                "sizes": "16x16",
                "type": "image/png"
            },
            {
                "src": "/assets/favicons/favicon-32x32.png",
                "sizes": "32x32",
                "type": "image/png"
            },
            {
                "src": "/assets/favicons/mstile-150x150.png",
                "sizes": "150x150",
                "type": "image/png"
            },
            {
                "src": "/assets/favicons/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/assets/favicons/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "theme_color": "#ffffff",
        "background_color": "#ff0000",
        "display": "standalone",
        "start_url": "/index.html"
    }
## 6.3 Editar o arquivo: src/index.html
    ...
    <head>
      ...
      <link rel="apple-touch-icon" sizes="180x180" href="assets/favicons/apple-touch-icon.png">
      <link rel="icon" type="image/png" href="assets/favicons/favicon-32x32.png" sizes="32x32">
      <link rel="icon" type="image/png" href="assets/favicons/favicon-16x16.png" sizes="16x16">
      <link rel="manifest" href="assets/favicons/manifest.json">
      <link rel="shortcut icon" href="assets/favicons/favicon.ico">
      <meta name="msapplication-config" content="assets/favicons/browserconfig.xml">
      <meta name="theme-color" content="#ffffff">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
    </head>
    ...

    npm install @angular/common@latest @angular/compiler@latest @angular/compiler-cli@latest @angular/core@latest @angular/forms@latest @angular/http@latest @angular/platform-browser@latest @angular/platform-browser-dynamic@latest @angular/platform-server@latest @angular/router@latest @angular/animations@latest typescript@latest --save


