(function () {
    'use strict';

    var widgetName = "committerPerFile";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Committer Per File',
                    description: 'Displays amount commiter on a single file.',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (committerPerFileDataService, config) {
                            if (config.location) {
                                return committerPerFileDataService.get(config.location);
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
            data.forEach(function (data) {
                data.file = data.file.split('/').pop();
            });

            AmCharts.makeChart([widgetName, "Chart"].join(''), {
                "type": "serial",
                "theme": "light",
                "rotate": true,
                "dataProvider": data,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "dashLength": 0
                }],
                "gridAboveGraphs": true,
                "startDuration": 0,
                "graphs": [{
                    "balloonText": "[[category]]<br><b>[[value]]</b> committer",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "title": "Amount of commits",
                    "valueField": "committer"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "file",
                "categoryAxis": {
                    "gridAlpha": 0,
                    "tickLength": 20
                }
            });
        }]);
})();