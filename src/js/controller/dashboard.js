angular.module('de.joste.csvanalyser')
    .controller('DashboardController', ['$scope', function ($scope) {
        $scope.model = {
            title: "CVS Statistics Dashboard",
            structure: "4-6",
            rows: [{
                columns: [{
                    styleClass: "col-md-4",
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
                            type: 'commitMessageWordle',
                            collapsed: true,
                            config: {
                                location: 'http://localhost:8080/commitMessageWordCloud'
                            }
                        }
                    ]
                }, {
                    styleClass: "col-md-8",
                    rows: [{
                        columns: [{
                            styleClass: 'col-md-12',
                            widgets: [
                                {
                                    type: 'commitsPerCommitter',
                                    config: {
                                        location: 'http://localhost:8080/commitsPerCommitter'
                                    }
                                }
                            ]
                        }]
                    }, {
                        columns: [{
                            styleClass: 'col-md-6',
                            widgets: [
                                {
                                    type: 'committerPerFile',
                                    config: {
                                        location: 'http://localhost:8080/committerPerFile?limit=15'
                                    }
                                }
                            ]
                        }, {
                            styleClass: 'col-md-6',
                            widgets: [
                                {
                                    title: '# Changed Files Last 20 Commits',
                                    type: 'changedFilesPerCommit',
                                    config: {
                                        location: 'http://localhost:8080/changedFilesPerCommit?limit=20'
                                    }
                                }
                            ]
                        }]
                    }]
                }
                ]
            }]
        };
    }]);