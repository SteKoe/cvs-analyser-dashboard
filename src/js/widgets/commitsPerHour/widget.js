(function () {
    'use strict';

    var widgetName = "commitsPerHour";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Commits Per Hour',
                    description: 'Displays amount of commits per hour',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (commitsPerHourDataService, config) {
                            if (config.location) {
                                return commitsPerHourDataService.get(config.location);
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
                var hour = data.hour;
                if (data.hour < 10) {
                    data.hour = ["0", data.hour, ":00"].join('');
                } else {
                    data.hour = [data.hour, ":00"].join('');
                }
            });

            AmCharts.makeChart([widgetName, "Chart"].join(''), {
                "type": "serial",
                "dataProvider": data,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "dashLength": 0,
                    "logarithmic": true
                }],
                "gridAboveGraphs": true,
                "startDuration": 0,
                "graphs": [{
                    "balloonText": "[[category]]<br><b>[[value]]</b> commits",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "title": "Amount of commits",
                    "valueField": "commits",
                    "type": "smoothedLine"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "hour",
                "categoryAxis": {
                    "gridAlpha": 0,
                    "tickLength": 20
                }
            });
        }]);
})();