@echo off
chcp 65001 >nul
echo ========================================
echo Git Hooks Setup for Multi-AI Collaboration
echo ========================================
echo.

REM Check if in Git repository
if not exist ".git" (
  echo [ERROR] Current directory is not a Git repository
  exit /b 1
)

REM Create .husky directory
echo [1/3] Creating .husky directory...
if not exist ".husky" mkdir .husky
if not exist ".husky\_" mkdir .husky\_

REM Configure Git hooks path
echo [2/3] Configuring Git hooks path...
git config core.hooksPath .husky

REM Create .husky/_/husky.sh compatibility file
echo [3/3] Creating husky.sh...
(
echo #!/usr/bin/env sh
echo if [ -z "$husky_skip_init" ]; then
echo   debug ^(^) {
echo     if [ "$HUSKY_DEBUG" = "1" ]; then
echo       echo "husky (debug) - $1"
echo     fi
echo   }
echo   readonly hook_name="$(basename -- "$0")"
echo   debug "starting $hook_name..."
echo   if [ "$HUSKY" = "0" ]; then
echo     debug "HUSKY env variable is set to 0, skipping hook"
echo     exit 0
echo   fi
echo   if [ -f ~/.huskyrc ]; then
echo     debug "sourcing ~/.huskyrc"
echo     . ~/.huskyrc
echo   fi
echo   readonly husky_skip_init=1
echo   export husky_skip_init
echo   sh -e "$0" "$@"
echo   exitCode="$?"
echo   if [ $exitCode != 0 ]; then
echo     echo "husky - $hook_name hook exited with code $exitCode (error)"
echo   fi
echo   if [ $exitCode = 127 ]; then
echo     echo "husky - command not found in PATH=$PATH"
echo   fi
echo   exit $exitCode
echo fi
) > .husky\_\husky.sh

echo.
echo ========================================
echo [SUCCESS] Git Hooks setup completed!
echo ========================================
echo.
echo Usage:
echo   All commits must include AI tool tag:
echo   - [claude-code]
echo   - [codex]
echo   - [antigravity]
echo   - [human]
echo.
echo Format: ^<type^>(^<scope^>): ^<subject^> [^<ai-tool^>]
echo Example: feat(backend): Add user API [claude-code]
echo.
echo Documentation:
echo   - Commit Convention: .github\COMMIT_CONVENTION.md
echo   - Collaboration Guide: .github\AI_COLLABORATION_GUIDE.md
echo.
echo To disable hooks: git config core.hooksPath .git/hooks
echo.
pause
