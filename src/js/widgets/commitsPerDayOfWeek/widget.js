(function () {
    'use strict';

    var widgetName = "commitsPerDayOfWeek";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Commits Per Day Of Week',
                    description: 'Display amount of commits per day of week.',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (commitsPerDayOfWeekDataService, config) {
                            if (config.location) {
                                return commitsPerDayOfWeekDataService.get(config.location);
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

            var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

            data.forEach(function (data) {
                data.dayOfWeek = weekDays[data.dayOfWeek];
            });

            AmCharts.makeChart([widgetName, "Chart"].join(''), {
                "type": "serial",
                "theme": "light",
                "dataProvider": data,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "dashLength": 0
                }],
                "gridAboveGraphs": true,
                "startDuration": 0,
                "graphs": [{
                    "balloonText": "[[category]]<br><b>[[value]]</b> commits",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "title": "Amount Of Commits",
                    "valueField": "commits"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "dayOfWeek",
                "categoryAxis": {
                    "gridAlpha": 0,
                    "tickLength": 20
                }
            });
        }]);
})();