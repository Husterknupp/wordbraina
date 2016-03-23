angular.module('wordbraina', [])
    .controller('puzzleController', function() {
        var vm = this;
        vm.puzzle = [];
        vm.puzzleSplit = [];
        vm.words = [];

        vm.findWords = function() {
            vm.puzzleSplit = vm.puzzle.split("\n");
            vm.words = vm.puzzleSplit;
        };
    });
