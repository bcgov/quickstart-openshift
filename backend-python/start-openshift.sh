#!/bin/bash
DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S.%3N')
cd app || exit
echo "Starting uvicorn at $DATE_TIME"
uvicorn src.main:app --host 0.0.0.0 --port 3000 --workers 1 --server-header --date-header --limit-concurrency 1000 --log-config /opt/logger.conf
