@echo off
rem ===========================================================================
rem  Startet den lokalen Entwicklungsserver der Website und oeffnet das Studio.
rem  Einfach doppelklicken. Das Fenster muss offen bleiben, solange du arbeitest.
rem ===========================================================================

rem Das Skript ruft sich selbst mit diesem Parameter im Hintergrund auf,
rem um den Browser erst dann zu oeffnen, wenn der Server wirklich antwortet.
if "%~1"=="oeffne-browser" goto :browser

title Website Martin Rettschlag - Entwicklungsserver

rem Node.js liegt nicht immer im Suchpfad, deshalb hier ergaenzen.
set "PATH=C:\Program Files\nodejs;%PATH%"

rem In den Ordner wechseln, in dem diese Datei liegt.
cd /d "%~dp0"

if not exist "package.json" (
  echo.
  echo  FEHLER: Im Ordner %~dp0 liegt kein Projekt.
  echo  Diese Datei muss im Projektordner der Website liegen.
  echo.
  pause
  exit /b 1
)

echo.
echo  ===========================================================
echo.
echo    Website wird gestartet ...
echo.
echo    Der Browser oeffnet sich von selbst, sobald alles bereit ist.
echo    Falls nicht: http://localhost:3000/studio
echo.
echo    DIESES FENSTER BITTE OFFEN LASSEN.
echo    Zum Beenden das Fenster schliessen oder Strg + C.
echo.
echo  ===========================================================
echo.

rem Wartet im Hintergrund auf den Server und oeffnet dann den Browser.
start "" /b "%~f0" oeffne-browser

call npm.cmd run dev

echo.
echo  Der Server wurde beendet.
echo.
pause
exit /b


rem ---------------------------------------------------------------------------
rem  Hintergrundteil: wartet, bis der Server antwortet, und oeffnet das Studio.
rem ---------------------------------------------------------------------------
:browser
set /a versuche=0

:warteschleife
curl -s -o nul --max-time 2 http://localhost:3000/
if not errorlevel 1 goto :oeffnen
set /a versuche+=1
rem Nach etwa 90 Sekunden nicht endlos weiterwarten.
if %versuche% geq 90 goto :aufgeben
timeout /t 1 /nobreak >nul
goto :warteschleife

:oeffnen
start "" "http://localhost:3000/studio"
exit /b

:aufgeben
rem Server kam nicht hoch. Fehlermeldung steht im Hauptfenster.
exit /b
