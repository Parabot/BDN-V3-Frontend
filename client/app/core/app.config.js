(function () {
    'use strict';

    angular.module('app.core')
        .factory('appConfig', [appConfig])
        .config(['$mdThemingProvider', mdConfig]);

    function appConfig() {
        var env = {};

        if (window) {
            Object.assign(env, window.__env);
        }

        var pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];
        var date = new Date();
        var year = date.getFullYear();
        var main = {
            brand: 'BDN V3',
            year: year,
            layout: 'wide',                                 // String: 'boxed', 'wide'
            menu: 'vertical',                               // String: 'horizontal', 'vertical'
            isMenuCollapsed: false,                         // Boolean: true, false
            fixedHeader: true,                              // Boolean: true, false
            fixedSidebar: true,                             // Boolean: true, false
            pageTransition: pageTransitionOpts[0],          // Object: 0, 1, 2, 3 and build your own
            skin: '21'                                      // String: 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };
        var color = {
            primary: '#009688',
            success: '#8BC34A',
            info: '#00BCD4',
            infoAlt: '#7E57C2',
            warning: '#FFCA28',
            danger: '#F44336',
            text: '#3D4051',
            gray: '#EDF0F1'
        };

        var base = env.baseURL;
        var endpoint = base + 'api/';
        var endpoints = {
            login: endpoint + 'users/connect/forums',
            isLoggedIn: endpoint + 'users/is/loggedin',
            validOAuth: endpoint + 'users/oauth/v2/valid',
            userGet: endpoint + 'users/get/',
            usersList: endpoint + 'users/list/',
            usersSearch: endpoint + 'users/search/',

            retrieveToken: base + 'internal/route/oauth/v2/token',

            serversList: endpoint + 'servers/list',
            serverGet: endpoint + 'servers/get/',
            serverUpdate: endpoint + 'servers/update',
            hooksDetailed: endpoint + 'servers/hooks/',

            myScriptsList: endpoint + 'scripts/list/my',
            buildTypesList: endpoint + 'city/build_types/list',
            buildsList: endpoint + 'city/builds/list/',
            build: endpoint + 'city/builds/get/',
            createBuild: endpoint + 'city/build_types/create/'
        };

        var routeUrls = {
            user: '/users/get/'
        };

        var urls = {
            servers: '/#/servers/list',
            server: '/#/servers/get/',

            scripts: '/#/scripts/list',
            script: '/#/scripts/get/',
            builds: '/#/scripts/builds',
            build: '/#/scripts/build/',

            users: '/#/users/list',
            user: '/#' + routeUrls.user,
            login: '/#/users/login',
            register: 'https://www.parabot.org/community/register',
            oauth: base + 'oauth/v2/auth',
            log_in: endpoint + 'users/log_in'
        };

        return {
            urls: urls,
            routeUrls: routeUrls,
            pageTransitionOpts: pageTransitionOpts,
            main: main,
            color: color,
            endpoint: endpoint,
            endpoints: endpoints,
            environment: env
        }
    }

    function mdConfig($mdThemingProvider) {
        var cyanAlt = $mdThemingProvider.extendPalette('cyan', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        });
        var lightGreenAlt = $mdThemingProvider.extendPalette('light-green', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        });

        $mdThemingProvider
            .definePalette('cyanAlt', cyanAlt)
            .definePalette('lightGreenAlt', lightGreenAlt);


        $mdThemingProvider.theme('default')
            .primaryPalette('teal', {
                'default': '500'
            })
            .accentPalette('cyanAlt', {
                'default': '500'
            })
            .warnPalette('red', {
                'default': '500'
            })
            .backgroundPalette('grey');
    }

})();