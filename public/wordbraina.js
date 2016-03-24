angular.module('wordbraina', [])
    .controller('puzzleController', ['$http', function($http) {
        var vm = this;
        vm.puzzle = "";
        vm.puzzleSplit = [];
        vm.words = [];
        vm.wordLength = 4;

        var separateCharacters = function(line) {
            var result = [];
            for (var i = 0; i < line.length; i++) {
                result.push(line[i]);
            }
            return result;
        };

        vm.findWords = function() {
            var lines = [];
            vm.puzzle.split("\n").forEach(function(line) {
                lines.push(separateCharacters(line));
            });

            var puzzleId;
            var payload = {lines: lines};
            $http.post("/puzzles", payload).then(function(response) {
                puzzleId = response.data;
                $http.get("/puzzles/" + puzzleId + "/words?length=" + vm.wordLength).then(function(response) {
                    vm.words = response.data;
                }, function(response) {
                    alert(":-/  GET didnt work. Here's what I got: " + response.data);
                })
            }, function(response) {
                alert(":-/  POST didnt work. Here's what I got: " + response.data);
            });

        };
    }]);
