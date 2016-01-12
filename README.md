# wordbraina
Helper for [WORDBRAIN](https://itunes.apple.com/de/app/wordbrain/id708600202?mt=8) word puzzle. Currently only for German vocabulary. You're lost and dont find the next word in the puzzle? wordbraina finds it for you.

_Deutsch_ Brauchst du Hilfe beim WORDBRAIN Spiel? wordbraina findet alle Wörter, die sich in einem Spiel versteckt haben, für dich und zeigt sie dir in einer Liste an.

[![Build Status](https://travis-ci.org/Husterknupp/wordbraina.svg)](https://travis-ci.org/Husterknupp/wordbraina)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/be69f532f91f44c1aaa935a20eb92061)](https://www.codacy.com/app/4-23/wordbraina)

## What?
![Wordbrain Screenshot](http://a1.mzstatic.com/us/r30/Purple4/v4/f0/ca/c7/f0cac717-a7a7-085d-4639-c850cd669077/screen568x568.jpeg)

## How?
 1. Make sure java 8 is installed
 2. download the zip file in the _releases_ section
 3. unzip it and
 4. ``java -jar worbraina.jar 4`` for 4-character-words (if you're under windows you can also use the .batch file)

## Wie?
 1. Zip Datei runterladen (findest du unter _releases_)
 2. heruntergeladene Zip Datei entpacken
 3. Windows: unter den entpackten Dateien die .batch Datei ausführen (Doppelklick)

## Beispiel
```
$ java -jar target/wordbraina-1.0.jar 4
Wieviel Zeilen?
2
Jetzt Zeile fuer Zeile. Mit [ENTER] kommst du in die naechste Zeile.
af
fe
[INFO] 4-Felder Matrix und 4-Buchstaben Wörter gesucht.. alles klar.
[affe]
```
