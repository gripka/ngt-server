$fractalsPath = "c:\Users\ga_gr\OneDrive\Documents\NGT site\fractals"
$files = Get-ChildItem -Path $fractalsPath -Filter "*.html"

$backButtonCode = @"
    
    <!-- Botão Voltar fixo no canto inferior esquerdo -->
    <a href="../fractals.html" class="back-button-fixed" data-translate="back-button">← Voltar</a>
    
    <!-- Rodapé carregado dinamicamente via JavaScript -->
"@

foreach ($file in $files) {
    # Pular o chaos.html que já foi editado
    if ($file.Name -eq "chaos.html") {
        Write-Host "Pulando $($file.Name) - já editado" -ForegroundColor Yellow
        continue
    }
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Verificar se já tem o botão fixo
    if ($content -match 'back-button-fixed') {
        Write-Host "Pulando $($file.Name) - já tem botão fixo" -ForegroundColor Yellow
        continue
    }
    
    # Adicionar o botão antes do comentário do rodapé
    $pattern = '    <!-- Rodapé carregado dinamicamente via JavaScript -->'
    $replacement = '    <!-- Botão Voltar fixo no canto inferior esquerdo -->' + "`r`n" + '    <a href="../fractals.html" class="back-button-fixed" data-translate="back-button">← Voltar</a>' + "`r`n" + "`r`n" + '    <!-- Rodapé carregado dinamicamente via JavaScript -->'
    $newContent = $content -replace [regex]::Escape($pattern), $replacement
    
    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "Atualizado: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "Não foi possível atualizar: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nConcluído!" -ForegroundColor Cyan
