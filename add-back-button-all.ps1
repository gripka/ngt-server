$fractalsPath = "c:\Users\ga_gr\OneDrive\Documents\NGT site\fractals"
$files = Get-ChildItem -Path $fractalsPath -Filter "*.html"

$oldPattern = '    <!-- Rodapé carregado dinamicamente via JavaScript -->'
$newPattern = @'
    <!-- Botão Voltar fixo no canto inferior esquerdo -->
    <a href="../fractals.html" class="back-button-fixed" data-translate="back-button">← Voltar</a>
    
    <!-- Rodapé carregado dinamicamente via JavaScript -->
'@

$count = 0
foreach ($file in $files) {
    # Pular arquivos já editados
    if ($file.Name -eq "chaos.html" -or $file.Name -eq "aquatic-ruins.html") {
        Write-Host "Pulando $($file.Name) - já editado" -ForegroundColor Yellow
        continue
    }
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Verificar se já tem o botão fixo
    if ($content -match 'back-button-fixed') {
        Write-Host "Pulando $($file.Name) - já tem botão fixo" -ForegroundColor Yellow
        continue
    }
    
    # Substituir o padrão
    if ($content -match [regex]::Escape($oldPattern)) {
        $newContent = $content -replace [regex]::Escape($oldPattern), $newPattern
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "Atualizado: $($file.Name)" -ForegroundColor Green
        $count++
    } else {
        Write-Host "Padrão não encontrado em: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nTotal atualizado: $count arquivos" -ForegroundColor Cyan
