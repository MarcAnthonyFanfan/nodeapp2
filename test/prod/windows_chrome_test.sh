#!/bin/bash
GRID_ENV='PROD' GRID_BROWSER='chrome' GRID_PLATFORM='windows' python3 test/grid_test.py > test/output/windows_chrome_output.txt 2>&1
printf ' [Windows/Chrome] '; grep 'tests passed' test/output/windows_chrome_output.txt