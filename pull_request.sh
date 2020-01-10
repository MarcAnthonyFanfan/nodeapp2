#!/bin/bash
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
if [[ $COMMIT_MESSAGE == *"[pr]"* ]]
then
    echo "[pr] found - auto creating pull request"
    BRANCH_NAME=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
    hub pull-request --no-edit --base=master --head=${BRANCH_NAME} > pull_request_url.txt
    chmod +x ./create_issue.sh && ./create_issue.sh
else
    echo "[pr] not found - skipping auto pull request creation"
fi