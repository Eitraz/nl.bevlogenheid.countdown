angular.module('CountDownApp', ['smart-table'])
  .controller('VariableSettingsController', function($scope) {
        var vm = this;
        vm.errorMessage = '';
        vm.showExportToggle = false;
        vm.showImportToggle = false;
        vm.importJson = '';
        vm.selected = {};
        vm.homey;
        vm.setHomey = function(homey, scope) {
            vm.homey = homey;
            vm.homey.get('variables', function(err, newvariables) {
                console.log(newvariables);
                if (!newvariables) {
                    // No variables found in settings
                    newvariables = [];
                }
                scope.$apply(function() {
                    vm.variables = newvariables;
                    vm.displayedvariables = newvariables;
                });
            });
            vm.homey.on('setting_changed', function(name) {
                vm.homey.get('variables', function(err, newvariables) {
                    console.log(newvariables);
                    if (!newvariables) {
                        newvariables = [];
                    }
                    $scope.$apply(function() {
                        vm.variables = newvariables;
                        vm.displayedvariables = newvariables;
                    });

                    console.log(vm.variables);
                });
            });
        }
        vm.addVariable = function() {
            if (vm.variables && vm.variables.filter(function(e) { return e.name == vm.newVariable.name; }).length > 0) {
                vm.errorMessage = "Variable does already exist in database.";
                return;
            }
            var variable = {
                name: vm.newVariable.name,
                type: "number",
                value: "-1",
                hasInsights: vm.newVariable.hasInsights,
                lastChanged: getShortDate(),
                remove:false
            };
            vm.variables.push(variable);
            storeVariable(angular.copy(vm.variables), variable);
            vm.errorMessage = '';
            vm.newVariable = {}
        };
        vm.deleteAll = function() {
            vm.homey.set('variables',[] );
            vm.variables = [];
            vm.displayedvariables = [];
        }
        vm.removeVariable = function (index) {
            var toDeleteVariable = vm.variables[index];
            vm.variables.splice(index, 1);
            toDeleteVariable.remove = true;
            storeVariable(angular.copy(vm.variables), toDeleteVariable);
        };

        vm.showExport = function() {
            vm.showExportToggle = !vm.showExportToggle;
        };
        vm.showImport = function () {
            vm.showImportToggle = !vm.showImportToggle;
        };

        vm.import = function () {
            var newVars = angular.fromJson(vm.importJson);
            vm.deleteAll();
            vm.homey.set('variables', newVars);
            vm.variables = newVars;
            vm.displayedVariables = newVars;
        };

        vm.editVariable = function(variable) {
            vm.selected = angular.copy(variable);
        };

    vm.saveVariable = function (idx) {
        // vm.selected.lastChanged = getShortDate();
        vm.variables[idx] = angular.copy(vm.selected);
        vm.displayedvariables = vm.variables;
        storeVariable(angular.copy(vm.variables), vm.selected);

        vm.reset();
        };
        vm.reset = function() {
            vm.selected = {};
        };

        vm.selectUpdate = function(type) {
            if (type === 'boolean') {
                vm.newVariable.value = false;
                return;
            }
            if (type === 'number') {
                vm.newVariable.value = 0;
                return;
            }
            vm.newVariable.value = '';
            return;
        }

        vm.getTemplate = function(variable) {
            if (variable.name === vm.selected.name && variable.type === vm.selected.type) return 'edit';
            else return 'display';
        };

        function storeVariable(variables, variable) {
            var changeObject = {
                variables: variables,
                variable: variable
            };

            vm.homey.set('changedvariables', changeObject);
        }
    });

function getShortDate() {
    return new Date().toISOString();
}
