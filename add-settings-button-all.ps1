# Script para adicionar botão de configurações em TODAS as páginas
$ErrorActionPreference = "Stop"

$folders = @("fractals", "strikes", "raids", "meta-events")

$count = 0
$updated = 0
$skipped = 0

foreach ($folder in $folders) {
    Write-Host "`nProcessando: $folder" -ForegroundColor Cyan
    
    $files = Get-ChildItem -Path ".\$folder\*.html"
    
    foreach ($file in $files) {
        $count++
        
        try {
            $content = [IO.File]::ReadAllText($file.FullName)
            
            # Pula se já tem o botão
            if ($content -like '*class="settings-button"*') {
                Write-Host "  SKIP: $($file.Name)" -ForegroundColor Yellow
                $skipped++
                continue
            }
            
            # Adiciona botão ANTES do language-selector
            $buttonHTML = @'
    <!-- Botão de Configurações -->
    <button class="settings-button" onclick="openSettingsModal()" title="Configurações">
        <img src="../icon/settings.png" alt="Settings" width="24" height="24">
    </button>
    
    
'@
            
            $content = $content.Replace('    <div class="language-selector">', $buttonHTML + '    <div class="language-selector">')
            
            # Adiciona modal ANTES do script
            $modalHTML = @'

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
    
'@
            
            $content = $content.Replace('    <script src="../language.js"></script>', $modalHTML + '    <script src="../language.js"></script>')
            
            [IO.File]::WriteAllText($file.FullName, $content)
            Write-Host "  OK: $($file.Name)" -ForegroundColor Green
            $updated++
        }
        catch {
            Write-Host "  ERRO: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Total: $count | Atualizados: $updated | Pulados: $skipped" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
