@echo off
set /p wordlength= Wie viele Buchstaben hat das Wort, das du suchst?: 
"%JAVA_HOME%\bin\java.exe" -jar target\wordbraina-1.0-SNAPSHOT.jar %wordlength%
PAUSE