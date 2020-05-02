#!/bin/sh

LS=""
while [ 1 ]; do
  LS2=$( ls -l )
  if [ "$LS2" != "$LS" ]; then
    echo 'run'
    node solution.js <input.txt >output.txt 2>&1;
    LS=$( ls -l )
  fi;
  sleep 1s;
done;
