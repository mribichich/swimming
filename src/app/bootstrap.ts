import 'bootstrap/css/bootstrap.css!';
import 'angular-material/angular-material.css!';
import 'app/styles/material-design-custom.css!';
import 'app/styles/styles.css!';

import 'zone.js';
import 'reflect-metadata';
// import {
//   Component,
//   View,
//   bootstrap
// } from 'angular2/angular2';

import 'jquery';
import 'bootstrap';
import * as angular from 'angular';
import 'app/components/app/app';
// import automapper from 'app/libs/jsAutomapper';

// import {upgradeAdapter} from './upgrade_adapter';

// upgradeAdapter.bootstrap(document.body, ['swimming']); //, {strictDi: true});

angular.bootstrap(document, ['swimming']);
// upgradeAdapter.bootstrap(document, ['swimming']); //, {strictDi: true});