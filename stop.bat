@echo off
echo Stopping HoMM3 HotA Overlay...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do taskkill /f /pid %%a 2>nul
echo Done. If the overlay is running on a different port, close the terminal manually.
pause
