@echo off
REM Jalankan API + Web sekaligus (Windows)
start "PMS-API" cmd /k node "%~dp0apps\api\server.js"
timeout /t 2 >nul
start "PMS-WEB" cmd /k node "%~dp0apps\web\server.js"
echo Buka http://localhost:3000  (login: superadmin / pms-demo)
pause
