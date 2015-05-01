(function () {
    'use strict';

    var widgetName = "commitsPerCommitter";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Commits Per Committer',
                    description: 'Displays amount of commits per committer',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (commitsPerCommitterDataService, config) {
                            if (config.location) {
                                return commitsPerCommitterDataService.get(config.location);
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
                "type": "pie",
                "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
                "titleField": "committer",
                "valueField": "commits",
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "align": "center",
                    "markerType": "circle"
                },
                "titles": [],
                "dataProvider": data
            });
        }]);
})();