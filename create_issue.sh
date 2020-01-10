#!/bin/bash
USER=jenkins
TOKEN=0WxvQ3E4T5
ISSUE_PREFIX=pull_request
ISSUE_TYPE=Bug
PULL_REQUEST_URL=$(cat pull_request_url.txt)
ISSUE_DESCRIPTION="Must be approved and merged into master by an admin. Pull Request URL: ${PULL_REQUEST_URL}"
UNIX_TIME=$(date +%s)
curl -d "{\"fields\": {\"project\":{\"key\":\"WEB\"},\"summary\":\"${ISSUE_PREFIX}_${UNIX_TIME}\",\"description\":\"${ISSUE_DESCRIPTION}\",\"issuetype\":{\"name\":\"${ISSUE_TYPE}\"}}}" -H "Content-Type: application/json" --user ${USER}:${TOKEN} -X POST http://u1910-jira:8080/rest/api/2/issue
