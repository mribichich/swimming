import 'angular-i18n/angular-locale_es-ar';
import 'angular-material';
import 'angular-messages';
import 'angular-animate';
import 'angular-aria';
import 'ngcomponentrouter';
import 'angular-indexedDB';
import 'app/templates';
export declare class App {
    private $rootRouter;
    private $mdSidenav;
    constructor($rootRouter: any, $mdSidenav: any);
    toggleMenu(): void;
    navigateTo(to: any): void;
}
