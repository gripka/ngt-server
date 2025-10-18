# Script para simplificar o botao de Reset em todas as paginas HTML
$rootPath = "c:\Users\ga_gr\OneDrive\Documents\NGT site"

# Lista de arquivos HTML principais
$mainPages = @(
    "fractals.html",
    "raids.html",
    "strikes.html",
    "meta-events.html"
)

# Encontrar todas as paginas de detalhes em subpastas
$detailPages = Get-ChildItem -Path $rootPath -Recurse -Include "*.html" -File | 
    Where-Object { 
        $_.FullName -notmatch "\\old tabelas\\" -and
        $_.Name -ne "index.html" -and
        $_.Name -ne "clear-cache.html" -and
        $_.Name -ne "test-hwb.html" -and
        $_.Name -ne "teste.html" -and
        $_.Name -notin $mainPages
    }

# Combinar todas as paginas
$allPages = @()
foreach ($page in $mainPages) {
    $fullPath = Join-Path $rootPath $page
    if (Test-Path $fullPath) {
        $allPages += $fullPath
    }
}
$allPages += $detailPages.FullName

Write-Host "Processando $($allPages.Count) paginas..." -ForegroundColor Cyan

$processedCount = 0
$skippedCount = 0

foreach ($filePath in $allPages) {
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Verificar se tem o card de reset (versao simplificada da busca)
        if ($content -notmatch 'reset-settings') {
            Write-Host "  Pulando $($filePath | Split-Path -Leaf) (nao possui botao de reset)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Verificar se ja esta simplificado
        if ($content -match '<div class="settings-action-buttons">') {
            Write-Host "  Pulando $($filePath | Split-Path -Leaf) (ja simplificado)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Encontrar a posicao do card de reset e substituir
        # Padrao mais flexivel
        $pattern1 = '(\s*)<div class="settings-option">\s*<h3>\s*<svg[^>]*>[^<]*<polyline[^>]*>[^<]*</polyline>\s*<polyline[^>]*>[^<]*</polyline>\s*<path[^>]*>[^<]*</path>\s*</svg>\s*<span data-translate="reset-settings">[^<]*</span>\s*</h3>\s*<p data-translate="reset-settings-desc">[^<]*</p>\s*<button onclick="openResetConfirmModal\(\)" data-translate="reset-settings">[^<]*</button>\s*</div>'
        
        $newButtonHTML = '$1<div class="settings-action-buttons">' + "`n" + '$1    <button class="reset-settings-btn" onclick="openResetConfirmModal()" data-translate="reset-settings">Resetar Configuracoes</button>' + "`n" + '$1</div>'
        
        if ($content -match $pattern1) {
            $content = $content -replace $pattern1, $newButtonHTML
            
            # Salvar o arquivo
            $content | Set-Content $filePath -Encoding UTF8 -NoNewline
            Write-Host "  OK $($filePath | Split-Path -Leaf)" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "  Aviso: Padrao nao encontrado em $($filePath | Split-Path -Leaf)" -ForegroundColor Yellow
            $skippedCount++
        }
    }
    catch {
        Write-Host "  Erro ao processar $($filePath | Split-Path -Leaf): $_" -ForegroundColor Red
        $skippedCount++
    }
}

Write-Host ""
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "  Processados: $processedCount" -ForegroundColor Green
Write-Host "  Pulados: $skippedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Concluido!" -ForegroundColor Green
