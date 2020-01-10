#!/bin/bash
echo 'Testing Node.js Application'
echo 'Platforms: [Linux, Windows]'
printf 'Browsers: [Chrome, Firefox]\n\n'
# Platform: Linux
./test/prod/linux_chrome_test.sh & PID_LINUX_CHROME=$!
./test/prod/linux_firefox_test.sh & PID_LINUX_FIREFOX=$!
# Platform: Windows
./test/prod/windows_chrome_test.sh & PID_WINDOWS_CHROME=$!
./test/prod/windows_firefox_test.sh & PID_WINDOWS_FIREFOX=$!
# Wait for test results
FAILED_TO_EXECUTE=0
wait $PID_LINUX_CHROME || FAILED_TO_EXECUTE=$((FAILED_TO_EXECUTE+1))
wait $PID_LINUX_FIREFOX || FAILED_TO_EXECUTE=$((FAILED_TO_EXECUTE+1))
wait $PID_WINDOWS_CHROME || FAILED_TO_EXECUTE=$((FAILED_TO_EXECUTE+1))
wait $PID_WINDOWS_FIREFOX || FAILED_TO_EXECUTE=$((FAILED_TO_EXECUTE+1))
if [ "$FAILED_TO_EXECUTE" -eq "0" ]
then
   exit 0
else
    printf "\n$FAILED_TO_EXECUTE Tests Failed to Execute\n"
    exit 1
fi