(function () {
    'use strict';

    var widgetName = "changedFilesPerCommit";

    angular.module(['de.joste.adf.widget', widgetName.toLowerCase()].join('.'), ['adf.provider'])
        .config(function (dashboardProvider) {
            dashboardProvider
                .widget(widgetName, {
                    title: 'Changed Files Per Commit',
                    description: 'Displays amount of changed files per commit.',
                    templateUrl: 'js/widgets/' + widgetName + '/view.html',
                    controller: [widgetName, 'Ctrl'].join(''),
                    controllerAs: widgetName,
                    resolve: {
                        data: function (changedFilesPerCommitDataService, config) {
                            if (config.location) {
                                return changedFilesPerCommitDataService.get(config.location);
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
            data.forEach(function(data) {
                data.revision = "Rev. " + data.revision;
            });

            AmCharts.makeChart([widgetName, "Chart"].join(''), {
                "type": "serial",
                "theme": "light",
                "rotate": true,
                "dataProvider": data,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "dashLength": 0,
                    "logarithmic": true
                }],
                "gridAboveGraphs": true,
                "startDuration": 1,
                "graphs": [{
                    "balloonFunction": function(a) {
                        return [
                            a.dataContext.date,
                            a.dataContext.revision + ": " + a.dataContext.changes,
                            "<em>" + a.dataContext.message + "</em>",
                        ].join('<br>');

                        return "a";
                    },
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "title": "Amount of commits",
                    "valueField": "changes"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "revision",
                "categoryAxis": {
                    "gridAlpha": 0,
                    "tickLength": 20
                }
            });
            ;
        }]);
})();