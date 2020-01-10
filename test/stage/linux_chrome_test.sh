#!/bin/bash
GRID_ENV='STAGE' GRID_BROWSER='chrome' GRID_PLATFORM='linux' python3 test/grid_test.py > test/output/linux_chrome_output.txt 2>&1
printf '   [Linux/Chrome] '; grep 'tests passed' test/output/linux_chrome_output.txt