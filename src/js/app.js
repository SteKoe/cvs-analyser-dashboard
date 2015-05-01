var csvAnalyser = angular.module('de.joste.csvanalyser', [
    'adf',
    'adf.structures.base',

    'de.joste.adf.widget.commitsperhour',
    'de.joste.adf.widget.commitsperdayofweek',
    'de.joste.adf.widget.commitspercommitter',
    'de.joste.adf.widget.changedfilespercommit',
    'de.joste.adf.widget.committerperfile'
]);