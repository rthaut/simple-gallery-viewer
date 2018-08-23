export default class PopupController {

    constructor($scope, $location) {
        this.scope = $scope;
        this.location = $location;

        this.scope.$on('ChangePanel', (event, args) => {
            console.log('Changing Panel', args);

            this.scope.direction = args.direction;
            this.location.path(args.path);
        });
    }
}

PopupController.$inject = ['$scope', '$location'];
