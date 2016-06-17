import * as angular from 'angular';
import 'angular-mocks';
import 'app/main';

import { HistoryService } from 'app/services/historyService';

describe('history service fixture', () => {
    'use strict';

    var $location: any = {};
    var $rootScope;
    var historyService: HistoryService;

    beforeEach(angular.mock.module('swimming'));

    beforeEach(inject((_$location_, _$rootScope_) => {
        $location = _$location_;
        $rootScope = _$rootScope_;
        historyService = new HistoryService($location, $rootScope);
    }));

    it('the history should be empty and the index -1 when go was never called', () => {
        expect(historyService.paths.length).toBe(0);
        expect(historyService.currentIndex).toBe(-1);
    });

    it('should call the location service with the path when calling go', () => {
        spyOn($location, 'path');

        historyService.go('app/something');

        expect($location.path).toHaveBeenCalledWith('app/something');
    });

    it('should add the path to the history and move the index when calling go', () => {
        historyService.go('app/something');

        expect(historyService.paths.length).toBe(1);
        expect(historyService.currentIndex).toBe(0);
        expect(historyService.paths[0]).toBe('app/something');
    });

    it('should go back in history when asking to go back', () => {
        spyOn($location, 'path');

        historyService.go('app/something');
        historyService.go('app/else');

        expect(historyService.paths.length).toBe(2);
        expect(historyService.currentIndex).toBe(1);
        expect(historyService.paths[0]).toBe('app/something');
        expect(historyService.paths[1]).toBe('app/else');

        let back = historyService.back();

        expect($location.path).toHaveBeenCalledWith('app/something');

        expect(historyService.paths.length).toBe(2);
        expect(historyService.currentIndex).toBe(0);
        expect(historyService.paths[0]).toBe('app/something');
        expect(historyService.paths[1]).toBe('app/else');
        expect(back).toBe('app/something');
    });

    it('should go foward in history when asking to go foward', () => {
        spyOn($location, 'path');

        historyService.go('app/something');
        historyService.go('app/else');

        historyService.back();

        let foward = historyService.foward();

        expect(foward).toBe('app/else');

        expect($location.path).toHaveBeenCalledWith('app/else');
        expect(historyService.paths.length).toBe(2);
        expect(historyService.currentIndex).toBe(1);
        expect(historyService.paths[0]).toBe('app/something');
        expect(historyService.paths[1]).toBe('app/else');
    });

    it('when going back and then go again it should override the history', () => {
        historyService.go('app/1');
        historyService.go('app/2');
        historyService.go('app/3');
        historyService.go('app/4');

        historyService.back();
        historyService.back();

        historyService.go('app/5');

        expect(historyService.paths.length).toBe(3);
        expect(historyService.currentIndex).toBe(2);
        expect(historyService.paths[0]).toBe('app/1');
        expect(historyService.paths[1]).toBe('app/2');
        expect(historyService.paths[2]).toBe('app/5');
    });
});