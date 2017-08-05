@echo off

call npm install
SETLOCAL
SET PATH=node_modules\.bin;node_modules\hubot\node_modules\.bin;%PATH%
SET HUBOT_QQ_ID=1905046101
SET HUBOT_QQ_PASS=inazumasaikou225
SET /A "HUBOT_QQ_GROUP="
SET /A "HUBOT_QQ_IMGPORT=3100"
SET /A "HUBOT_QQ_DEBUG=True"

node_modules\.bin\hubot.cmd --name "Inazuma" %* 
