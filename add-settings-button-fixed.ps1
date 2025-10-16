# Script PowerShell para adicionar botão de configurações em todas as páginas de mecânicas
# Com encoding UTF-8 correto

$folders = @("fractals", "strikes", "raids", "meta-events")

# Botão de configurações com PNG
$settingsButton = @"
    <!-- Botão de Configurações -->
    <button class="settings-button" onclick="openSettingsModal()" title="Configurações">
        <img src="../icon/settings.png" alt="Settings" width="24" height="24">
    </button>
    
"@

# Modal completo
$settingsModal = @"

    <!-- Modal de Configurações -->
    <div class="settings-modal" id="settingsModal" onclick="if(event.target === this) closeSettingsModal()">
        <div class="settings-modal-content">
            <div class="settings-modal-header">
                <h2 data-translate="settings-title">Configurações</h2>
                <button class="close-modal-btn" onclick="closeSettingsModal()">&times;</button>
            </div>
            <div class="settings-options">
                <div class="settings-option">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span data-translate="export-mechanics">Exportar Mecânicas</span>
                    </h3>
                    <p data-translate="export-mechanics-desc">Salva suas mecânicas customizadas desta página em um arquivo JSON</p>
                    <button onclick="exportMechanics()" data-translate="export-mechanics">Exportar Mecânicas</button>
                </div>
                
                <div class="settings-option">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span data-translate="import-mechanics">Importar Mecânicas</span>
                    </h3>
                    <p data-translate="import-mechanics-desc">Carrega mecânicas customizadas de um arquivo JSON para esta página</p>
                    <button onclick="importMechanics()" data-translate="import-mechanics">Importar Mecânicas</button>
                </div>
            </div>
        </div>
    </div>
"@

$totalFiles = 0
$updatedFiles = 0
$skippedFiles = 0

foreach ($folder in $folders) {
    $folderPath = Join-Path $PSScriptRoot $folder
    
    if (Test-Path $folderPath) {
        Write-Host "`nProcessando pasta: $folder" -ForegroundColor Cyan
        
        $htmlFiles = Get-ChildItem -Path $folderPath -Filter "*.html"
        
        foreach ($file in $htmlFiles) {
            $totalFiles++
            
            # Lê com encoding UTF-8
            $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
            
            # Verifica se já tem o botão de configurações
            if ($content -match 'class="settings-button"') {
                Write-Host "  ✓ $($file.Name) - Já possui configurações" -ForegroundColor Yellow
                $skippedFiles++
                continue
            }
            
            # Verifica se tem language-selector
            if ($content -match '<div class="language-selector">') {
                # Adiciona botão antes do language-selector
                $content = $content -replace '(<div class="language-selector">)', "$settingsButton`$1"
                
                # Adiciona modal antes do script language.js
                if ($content -match '<script src="../language.js"></script>') {
                    $content = $content -replace '(<script src="../language.js"></script>)', "$settingsModal`$1"
                } elseif ($content -match '</body>') {
                    $content = $content -replace '(</body>)', "$settingsModal`$1"
                }
                
                # Salva o arquivo com encoding UTF-8
                [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
                Write-Host "  ✓ $($file.Name) - Atualizado com sucesso" -ForegroundColor Green
                $updatedFiles++
            } else {
                Write-Host "  ✗ $($file.Name) - Formato não reconhecido" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "`nPasta não encontrada: $folder" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Resumo da atualização:" -ForegroundColor Cyan
Write-Host "  Total de arquivos: $totalFiles" -ForegroundColor White
Write-Host "  Atualizados: $updatedFiles" -ForegroundColor Green
Write-Host "  Já possuíam: $skippedFiles" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
