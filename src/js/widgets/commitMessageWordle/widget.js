(function () {
    'use strict';

    var widgetName = "commitMessageWordle";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Wordle',
                    description: 'Displas a worldcloud based on commit messages.',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (commitMessageWordleDataService, config) {
                            if (config.location) {
                                return commitMessageWordleDataService.get(config.location);
                            }
                        }
                    }
                });
        })
        .service([widgetName, 'DataService'].join(''), ['$q', '$http', function ($q, $http) {
            return {
                get: function (serviceDataUrl) {
                    var deferred = $q.defer();
                    $http.get(serviceDataUrl)
                        .success(function (data) {
                            if (data) {
                                deferred.resolve(data);
                            } else {
                                deferred.reject();
                            }
                        })
                        .error(function () {
                            deferred.reject();
                        });
                    return deferred.promise;
                }
            };
        }])
        .controller([widgetName, 'Ctrl'].join(''), ['$scope', 'data', function ($scope, data) {
            var list = [],

            data = data.filter(function (data) {
                if (data.word.length <= 2) {
                    return false;
                }
                return true;
            });

            data = data.splice(0,200);

            console.log(data);
            data.forEach(function (data) {
                list.push([data.word, data.count]);
            });


            WordCloud(document.getElementById('commitMessageWordleChart'), {
                list: list,
                rotateRatio: 0,
                maxRotation: 0
            });
        }]);
})();