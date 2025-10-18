# Script para adicionar botao de Reset em todas as paginas HTML
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

$resetButtonHTML = @"
                
                <div class="settings-option">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <polyline points="23 20 23 14 17 14"></polyline>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                        </svg>
                        <span data-translate="reset-settings">Resetar Configurações</span>
                    </h3>
                    <p data-translate="reset-settings-desc">Limpa todas as configurações e mecânicas customizadas do site</p>
                    <button onclick="openResetConfirmModal()" data-translate="reset-settings">Resetar Configurações</button>
                </div>
"@

$resetModalHTML = @"

    
    <!-- Modal de Confirmacao de Reset -->
    <div class="reset-confirm-modal" id="resetConfirmModal" onclick="if(event.target === this) closeResetConfirmModal()">
        <div class="reset-confirm-content">
            <h3 data-translate="reset-confirm-title">Confirmar Reset</h3>
            <p data-translate="reset-confirm-message">Isso ira apagar todas as suas configuracoes e mecanicas customizadas. Esta acao nao pode ser desfeita.</p>
            <div class="reset-confirm-buttons">
                <button class="confirm-btn" onclick="resetAllSettings()" data-translate="confirm">Confirmar</button>
                <button class="cancel-btn" onclick="closeResetConfirmModal()" data-translate="cancel">Cancelar</button>
            </div>
        </div>
    </div>
"@

$processedCount = 0
$skippedCount = 0

foreach ($filePath in $allPages) {
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Verificar se ja tem o botao de reset
        if ($content -match 'reset-settings') {
            Write-Host "  Pulando $($filePath | Split-Path -Leaf) (ja possui botao de reset)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Verificar se tem o modal de configuracoes
        if ($content -notmatch '<div class="settings-modal"') {
            Write-Host "  Pulando $($filePath | Split-Path -Leaf) (nao possui modal de configuracoes)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Adicionar botao de reset apos o botao de importar
        $importPattern = '(?s)(<div class="settings-option">.*?<span data-translate="import-mechanics">.*?</button>\s*</div>)'
        if ($content -match $importPattern) {
            $content = $content -replace $importPattern, "`$1$resetButtonHTML"
        } else {
            Write-Host "  Erro: Nao encontrado padrao de importar em $($filePath | Split-Path -Leaf)" -ForegroundColor Red
            $skippedCount++
            continue
        }
        
        # Adicionar modal de confirmacao antes do fechamento do settings-modal
        $modalPattern = '(</div>\s*</div>\s*</div>\s*<!-- .*?configurações.*?-->)'
        if ($content -match $modalPattern) {
            $content = $content -replace $modalPattern, "</div>`n        </div>`n    </div>$resetModalHTML"
        } else {
            # Tentar padrao alternativo
            $modalPattern2 = '(</div>\s*</div>\s*</div>\s*<div class="language-selector">)'
            if ($content -match $modalPattern2) {
                $content = $content -replace $modalPattern2, "</div>`n        </div>`n    </div>$resetModalHTML`n    `$1"
            } else {
                Write-Host "  Aviso: Padrao de modal nao encontrado em $($filePath | Split-Path -Leaf), tentando insercao generica" -ForegroundColor Yellow
                # Inserir antes do script de language.js
                $scriptPattern = '(\s*<script src="(?:\.\.\/)?language\.js"><\/script>)'
                if ($content -match $scriptPattern) {
                    $content = $content -replace $scriptPattern, "$resetModalHTML`n`$1"
                }
            }
        }
        
        # Salvar o arquivo
        $content | Set-Content $filePath -Encoding UTF8 -NoNewline
        Write-Host "  OK $($filePath | Split-Path -Leaf)" -ForegroundColor Green
        $processedCount++
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

