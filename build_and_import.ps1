Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "$PSScriptRoot\SORA_Solution.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, "$PSScriptRoot\SORA_Solution\src\Other\Solution.xml", "solution.xml") | Out-Null
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, "$PSScriptRoot\SORA_Solution\src\Other\Customizations.xml", "customizations.xml") | Out-Null

$entry = $zip.CreateEntry("[Content_Types].xml")
$stream = $entry.Open()
$writer = [System.IO.StreamWriter]::new($stream)
$writer.Write('<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="text/xml" /><Default Extension="json" ContentType="application/json" /></Types>')
$writer.Flush()
$writer.Dispose()

[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, "$PSScriptRoot\SORA_Solution\src\Workflows\SORA_Rebuild_Inflation_Index_Master-E4B3C2D1-0000-4000-8000-112233445566.json", "Workflows/SORA_Rebuild_Inflation_Index_Master-E4B3C2D1-0000-4000-8000-112233445566.json") | Out-Null

$zip.Dispose()

Write-Host "ZIP created successfully at $zipPath"
pac solution import --path "$zipPath" --async false
