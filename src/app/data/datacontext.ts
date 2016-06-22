
// import breeze = require('breeze');
// import localforage = require('localforage');

// import { servicesModule } from 'app/services/services.module';
// import { SwimmerEntityType } from 'app/data/swimmer.entitytype';
// import { CategoryEntityType } from 'app/data/category.entitytype';

// export interface IDatacontext {
//     entityManager: breeze.EntityManager;
// }

// export class Datacontext implements IDatacontext {
//     static $inject: string[] = [
//         '$q',
//         '$rootScope'
//     ];

//     constructor(
//         private $q,
//         private $rootScope
//         ) {
//         // breeze.NamingConvention.camelCase.setAsDefault();

//         let host = '';

//         var dataService = new breeze.DataService({
//             serviceName: host + '/api/',
//             hasServerMetadata: false
//         });

//         this.entityManager = new breeze.EntityManager({ dataService: dataService });

//         SwimmerEntityType.register(this.entityManager.metadataStore);
//         CategoryEntityType.register(this.entityManager.metadataStore);

//         this.entityManager.entityChanged.subscribe((changeArgs) => {
//             var exportData = this.entityManager.exportEntities(this.entityManager.getChanges(), false);
//             localforage.setItem('swimming', exportData).then((value) => {
//             }, (error) => {
//                 console.error(error);
//             });
//         });

//         localforage.getItem('swimming').then((value) => {
//             this.$rootScope.$apply(() => {
//                 this.entityManager.importEntities(value);
//             });
//         }, (error) => {
//             console.error(error);
//         });

//         // this.entityManager.hasChangesChanged.subscribe(function(args) {
//         //     console.log(args);
//         // });
//     }

//     entityManager: breeze.EntityManager;
// }

// servicesModule.service('datacontext', Datacontext);