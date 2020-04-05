#!/bin/sh

python interactive_runner.py python local_testing_tool.py 0 -- node solution.js
python interactive_runner.py python local_testing_tool.py 1 -- node solution.js
python interactive_runner.py python local_testing_tool.py 2 -- node solution.js