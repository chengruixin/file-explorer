set-ExecutionPolicy RemoteSigned
Import-Module ps2exe
cd C:\MyCode\file-explorer\cmds
ps2exe .\start_rax.ps1 Rax.exe
ps2exe .\refresh_db.ps1 Refresh.exe