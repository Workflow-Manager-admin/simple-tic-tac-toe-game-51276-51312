#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-tic-tac-toe-game-51276-51312/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

