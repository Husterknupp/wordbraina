#!/usr/bin/env bash
echo '***************************'
echo '**** integration tests ****'
echo '***************************'

if curl -s localhost:5000; then
    echo '\nSomethings already running on port 5000'
    echo 'exit 1'
    exit 1
fi

echo 'Node index.js and sleep 2s'
node index.js &
sleep 2

echo 'node integration-test.js'
if node integration-test.js; then
    echo 'pkill -9 node index.js'
    pkill -9 node index.js
    exit 0
else
    echo 'Tests not successful'
    echo 'pkill -9 node index.js'
    pkill -9 node index.js
    exit 1
fi
