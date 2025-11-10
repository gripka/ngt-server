// ========================================
// SETTINGS MODAL - Sistema Centralizado
// ========================================

// Carrega o modal de configurações dinamicamente
async function loadSettingsModal() {
    try {
        // Detecta se está em uma subpasta (fractals, raids, etc) ou na raiz
        const scriptTag = document.querySelector('script[src*="settings.js"]');
        const isInSubfolder = scriptTag.getAttribute('src').startsWith('../');
        const modalPath = isInSubfolder ? '../settings-modal.html' : 'settings-modal.html';
        
        const response = await fetch(modalPath);
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error('Erro ao carregar modal de configurações:', error);
    }
}

// Inicializa o modal quando a página carrega
document.addEventListener('DOMContentLoaded', loadSettingsModal);

// ========================================
// FUNÇÕES DE CONTROLE DO MODAL
// ========================================

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openResetConfirmModal() {
    closeSettingsModal();
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeResetConfirmModal() {
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmResetAllSettings() {
    // Remove todas as mecânicas
    for (let key in localStorage) {
        if (key.startsWith('mechanics-')) {
            localStorage.removeItem(key);
        }
    }
    
    // Remove favoritos
    localStorage.removeItem('ngt-favorites');
    
    closeResetConfirmModal();
    alert('Todas as configurações foram resetadas!');
    location.reload();
}

// ========================================
// EXPORTAR TUDO (BACKUP COMPLETO)
// ========================================

function exportAll() {
    const pageId = document.body.getAttribute('data-page-id');
    
    // Coleta TODAS as mecânicas do localStorage
    const allMechanics = {};
    for (let key in localStorage) {
        if (key.startsWith('mechanics-')) {
            allMechanics[key] = localStorage.getItem(key);
        }
    }
    
    // Coleta favoritos
    const favorites = localStorage.getItem('ngt-favorites');
    
    const backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        mechanics: allMechanics,
        favorites: favorites
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ngt-backup-completo-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Backup completo exportado com sucesso!');
}

// ========================================
// IMPORTAR TUDO (BACKUP COMPLETO)
// ========================================

function importAll() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backupData = JSON.parse(event.target.result);
                
                // Restaura todas as mecânicas
                if (backupData.mechanics) {
                    for (let key in backupData.mechanics) {
                        localStorage.setItem(key, backupData.mechanics[key]);
                    }
                }
                
                // Restaura favoritos
                if (backupData.favorites) {
                    localStorage.setItem('ngt-favorites', backupData.favorites);
                }
                
                alert('Backup completo restaurado com sucesso!');
                location.reload();
            } catch (error) {
                alert('Erro ao importar backup: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ========================================
// EXPORTAR MECÂNICAS (PÁGINA ATUAL)
// ========================================

function exportMechanics() {
    const pageId = document.body.getAttribute('data-page-id');
    const storageKey = `mechanics-${pageId}`;
    const mechanicsData = localStorage.getItem(storageKey);
    
    if (!mechanicsData) {
        alert('Nenhuma mecânica customizada encontrada para exportar.');
        return;
    }
    
    const exportData = {
        pageId: pageId,
        exportDate: new Date().toISOString(),
        mechanics: JSON.parse(mechanicsData)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${pageId}-mechanics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// ========================================
// IMPORTAR MECÂNICAS (PÁGINA ATUAL)
// ========================================

function importMechanics() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importData = JSON.parse(event.target.result);
                const pageId = document.body.getAttribute('data-page-id');
                
                if (importData.pageId !== pageId) {
                    const confirmImport = confirm(
                        `Este arquivo é de "${importData.pageId}" mas você está em "${pageId}". Deseja importar mesmo assim?`
                    );
                    if (!confirmImport) return;
                }
                
                const storageKey = `mechanics-${pageId}`;
                localStorage.setItem(storageKey, JSON.stringify(importData.mechanics));
                
                alert('Mecânicas importadas com sucesso!');
                location.reload();
            } catch (error) {
                alert('Erro ao importar mecânicas: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ========================================
// EXPORTAR FAVORITOS
// ========================================

function exportFavorites() {
    const favoritesData = localStorage.getItem('ngt-favorites');
    
    if (!favoritesData) {
        alert('Nenhum favorito encontrado para exportar.');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        favorites: JSON.parse(favoritesData)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ngt-favorites-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// ========================================
// IMPORTAR FAVORITOS
// ========================================

function importFavorites() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importData = JSON.parse(event.target.result);
                
                if (importData.favorites) {
                    localStorage.setItem('ngt-favorites', JSON.stringify(importData.favorites));
                    alert('Favoritos importados com sucesso!');
                    location.reload();
                } else {
                    alert('Arquivo de favoritos inválido.');
                }
            } catch (error) {
                alert('Erro ao importar favoritos: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// ========================================
// RESETAR TODAS AS CONFIGURAÇÕES
// ========================================
// (Função movida para cima junto com as funções do modal)
