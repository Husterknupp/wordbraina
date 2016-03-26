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
            var totalCharacters = 0;
            vm.puzzle.split("\n").forEach(function(line) {
                if (line.length > 0) {
                    var characters = separateCharacters(line);
                    totalCharacters += characters.length;
                    lines.push(characters);
                }
            });
            if (totalCharacters < vm.wordLength) {
                alert("Puzzle characters (" + totalCharacters + ") " +
                    "must be more than or equal word length (" + vm.wordLength + ")");
                return;
            }

            var puzzleId;
            var payload = {lines: lines};
            vm.requestLoading = true;
            $http.post("/puzzles", payload).then(function(response1) {
                return $http.get("/puzzles/" + response1.data + "/words?length=" + vm.wordLength);
            }, function(reject1) {
                vm.requestLoading = false;
                alert(":-/  POST didnt work. Here's what I got: " + reject1.data);
                return "errorrrrrr";
            }).then(function(response2) {
                vm.requestLoading = false;
                vm.words = response2.data;
                if (vm.words.length <= 0) {
                    vm.noWordsFound = true;
                    $timeout(function() {
                        vm.noWordsFound = false;
                    }, 3500);
                }
            }, function(reject2) {
                vm.requestLoading = false;
                alert(":-/  GET didnt work. Here's what I got: " + reject2.data);
            });
        };
    }]);
