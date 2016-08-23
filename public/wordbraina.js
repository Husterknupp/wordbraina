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
            vm.webSocket = new WebSocket("wss://" + window.location.host + "/puzzles-ws");
            vm.webSocket.onerror = function(event) {
                console.log("webSocket error. Try to connect without ssl");
                vm.webSocket = new WebSocket("ws://" + window.location.host + "/puzzles-ws");
                vm.webSocket.onopen = function() {
                    console.log("Established webSocket connection. Though, ya webSocket aint gonna be secure, bro.");
                };
                vm.webSocket.onmessage = function(evt) { setTimeout(function() {vm.onMessageHandler(evt);}, 0); };
                vm.webSocket.onerror = function(event) {
                    alert("Could not establish websocket connection even without ssl. Wordbraina will not work. So sorry")
                };
            };

            vm.webSocket.onmessage = function(evt) { setTimeout(function() {vm.onMessageHandler(evt);}, 0); };
        }

        vm.onMessageHandler = function(msg) {
            var data = JSON.parse(msg.data);
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
        };

        var separateCharacters = function(line) {
            var result = [];
            for (var i = 0; i < line.length; i++) {
                result.push(line[i]);
            }
            return result;
        };

        vm.findWords = function() {
            if (vm.webSocket.readyState != 1) { // 1 means isOpen
                alert("wordbraina doesn't work. WebSocket connection not established. So sorry.");
                return;
            }

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
                // nothing
            }, function(reject2) {
                vm.requestLoading = false;
                alert(":-/  GET didnt work. Here's what I got: " + reject2.data);
            });
        };
    }]);
