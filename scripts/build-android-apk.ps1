# Rebuilds the game, syncs it into the Android project, and produces a fresh debug APK.
# Usage: powershell -File scripts\build-android-apk.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Output "1/4 Rebuilding KangarooMathsQuest.html + www/index.html..."
node "$root\scripts\rebuild.cjs"

Write-Output "2/4 Syncing web assets into the Android project..."
Set-Location $root
npx cap copy android

Write-Output "3/4 Building debug APK (this can take a minute)..."
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
Set-Location "$root\android"
.\gradlew.bat assembleDebug

Write-Output "4/4 Copying APK to project root..."
Copy-Item "$root\android\app\build\outputs\apk\debug\app-debug.apk" "$root\KangarooMathsQuest.apk" -Force
Set-Location $root
Write-Output "Done: $root\KangarooMathsQuest.apk"
