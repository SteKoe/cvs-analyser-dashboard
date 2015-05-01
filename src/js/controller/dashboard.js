angular.module('de.joste.csvanalyser')
    .controller('DashboardController', ['$scope', function ($scope) {
        $scope.model = {
            title: "CVS Statistics Dashboard",
            structure: "6-6",
            rows: [{
                columns: [{
                    styleClass: "col-md-6",
                    widgets: [
                        {
                            type: 'commitsPerHour',
                            config: {
                                location: 'http://localhost:8080/commitsPerHour'
                            }
                        },
                        {
                            type: 'commitsPerDayOfWeek',
                            config: {
                                location: 'http://localhost:8080/commitsPerDayOfWeek'
                            }
                        },
                        {
                            title: '# Changed Files Last 20 Commits',
                            type: 'changedFilesPerCommit',
                            config: {
                                location: 'http://localhost:8080/changedFilesPerCommit?limit=20'
                            }
                        }
                    ]
                }, {
                    styleClass: "col-md-6",
                    widgets: [
                        {
                            type: 'commitsPerCommitter',
                            config: {
                                location: 'http://localhost:8080/commitsPerCommitter'
                            }
                        },
                        {
                            type: 'committerPerFile',
                            config: {
                                location: 'http://localhost:8080/committerPerFile'
                            }
                        },
                        {
                            type: 'commitMessageWordle',
                            config: {
                                location: 'http://localhost:8080/commitMessageWordCloud'
                            }
                        }
                    ]
                }]
            }]
        };
    }]);