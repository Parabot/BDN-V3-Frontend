(function () {
    'use strict';

    angular.module('app.servers')
        .factory('Server', function () {
            function Server(ID, name, status, version) {
                this.ID = ID;
                this.name = name;
                this.status = status;
                this.version = version;
            }

            Server.prototype.getName = function () {
                return this.name;
            };

            Server.prototype.getStatus = function () {
                return this.status;
            };

            Server.prototype.getVersion = function () {
                return this.version;
            };

            Server.prototype.getID = function () {
                return this.id;
            };

            Server.build = function (dataSet) {
                return new Server(dataSet['id'], dataSet['name'], 'active', dataSet['version']);
            };

            return Server;
        });

})(); 