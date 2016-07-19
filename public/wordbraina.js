angular.module('wordbraina', [])
    .controller('puzzleController', ['$http', '$timeout', '$scope', function($http, $timeout, $scope) {
        var vm = this;
        vm.puzzle = "";
        vm.puzzleSplit = [];
        vm.words = [];
        vm.wordLength = 4;
        vm.requestLoading = false;
        vm.noWordsFound = false;
        vm.puzzleId = null;

        activate();

        function activate() {
            alert("v2\nhost: " + window.location.host);
            var webSocket = new WebSocket("ws://" + window.location.host + "/puzzles-ws");
            webSocket.onopen = function(msg) {
                alert('onopen');
            };
            webSocket.onmessage = function(msg) {
                var data = JSON.parse(msg.data);
                alert("received ws message\n" + data.type + "\n" + data.id);
                if (data.type !== "solution" || data.id != vm.puzzleId) {
                    return;
                }

                $scope.$apply(function() {
                    // http://stackoverflow.com/questions/27568151/angularjs-using-apply-without-scope
                    vm.requestLoading = false;
                    vm.words = data.solution;
                    if (vm.words.length <= 0) {
                        vm.noWordsFound = true;
                        $timeout(function() {
                            vm.noWordsFound = false;
                        }, 3500);
                    }
                });
            }
        }

        var separateCharacters = function(line) {
            var result = [];
            for (var i = 0; i < line.length; i++) {
                result.push(line[i]);
            }
            return result;
        };

        vm.findWords = function() {
            alert("findWords");
            vm.lines = [];
            var totalCharacters = 0;
            vm.puzzle.split("\n").forEach(function(line) {
                if (line.length > 0) {
                    var characters = separateCharacters(line);
                    totalCharacters += characters.length;
                    vm.lines.push(characters);
                }
            });
            if (totalCharacters < vm.wordLength) {
                alert("Puzzle characters (" + totalCharacters + ") " +
                    "must be more than or equal word length (" + vm.wordLength + ")");
                return;
            }

            var payload = {lines: vm.lines, length: vm.wordLength};
            vm.requestLoading = true;
            $http.post("/puzzles", payload).then(function(response1) {
                vm.puzzleId = response1.data;
                return $http.post("/puzzles/" + response1.data + "/findWords?length=" + vm.wordLength, {});
            }, function(reject1) {
                vm.requestLoading = false;
                alert(":-/  POST didnt work. Here's what I got: " + reject1.data);
                return "errorrrrrr";
            }).then(function(response2) {
                alert("POST succeeded. webSocket should fire soon");
                console.log('POST succeeded. Lets wait for the webSocket to fire');
            }, function(reject2) {
                vm.requestLoading = false;
                alert(":-/  GET didnt work. Here's what I got: " + reject2.data);
            });
        };
    }]);
