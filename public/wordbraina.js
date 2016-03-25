angular.module('wordbraina', [])
    .controller('puzzleController', ['$http', '$timeout', function($http, $timeout) {
        var vm = this;
        vm.puzzle = "";
        vm.puzzleSplit = [];
        vm.words = [];
        vm.wordLength = 4;
        vm.requestLoading = false;
        vm.noWordsFound = false;

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
            vm.requestLoading = true;
            $http.post("/puzzles", payload).then(function(response) {
                puzzleId = response.data;
                $http.get("/puzzles/" + puzzleId + "/words?length=" + vm.wordLength).then(function(response) {
                    vm.requestLoading = false;
                    vm.words = response.data;
                    if (vm.words.length <= 0) {
                        vm.noWordsFound = true;
                        $timeout(function() {
                            vm.noWordsFound = false;
                        }, 3500);
                    }
                }, function(response) {
                    vm.requestLoading = false;
                    alert(":-/  GET didnt work. Here's what I got: " + response.data);
                })
            }, function(response) {
                vm.requestLoading = false;
                alert(":-/  POST didnt work. Here's what I got: " + response.data);
            });
        };
    }]);
