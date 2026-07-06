@echo off
cd /d "%~dp0"
echo Installing dependencies (if needed)...
call npm install --no-audit --no-fund --loglevel=error
echo Starting HoMM3 HotA Overlay...
node server.js
pause
