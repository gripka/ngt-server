$files = Get-ChildItem -Path "c:\Users\ga_gr\OneDrive\Documents\NGT site" -Recurse -Filter "*.html" | Where-Object { $_.FullName -notlike "*\node_modules\*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Remove back button with blank line after
    $content = $content -replace '        <a href="[^"]*" class="back-button" data-translate="back-button">← Voltar</a>\r?\n        \r?\n', '        '
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Atualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nConcluído!" -ForegroundColor Cyan
