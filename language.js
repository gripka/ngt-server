// ============================================
// SISTEMA DE TRADUÇÃO MULTILÍNGUE
// ============================================
// Carrega traduções de arquivos JSON externos para melhor organização

let translations = {};

// Função para carregar traduções do arquivo JSON
async function loadTranslations(lang) {
    try {
        // Detecta se está em subpasta ou não
        const basePath = window.location.pathname.includes('/fractals/') || 
                         window.location.pathname.includes('/strikes/') || 
                         window.location.pathname.includes('/raids/') || 
                         window.location.pathname.includes('/meta-events/') 
                         ? '../languages/' 
                         : 'languages/';
        
        const response = await fetch(`${basePath}${lang}.json`);
        if (!response.ok) {
            console.error(`Erro ao carregar idioma ${lang}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao carregar traduções: ${error}`);
        return null;
    }
}

// Inicializa as traduções carregando todos os idiomas disponíveis
async function initTranslations() {
    const languages = ['pt', 'en', 'es'];
    const promises = languages.map(async (lang) => {
        const data = await loadTranslations(lang);
        if (data) {
            translations[lang] = data;
        }
    });
    
    await Promise.all(promises);
}

// Função para trocar o idioma
function changeLanguage(lang) {
    // Salva o idioma no localStorage para persistir entre páginas
    localStorage.setItem('selectedLanguage', lang);
    
    // Atualiza todos os elementos com data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Atualiza todos os elementos com data-i18n (para compatibilidade)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Atualiza placeholders de inputs
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Atualiza o valor do select
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = lang;
    }
}

// ============================================
// FUNÇÕES DE CÓPIA DE TEXTO
// ============================================

// Função para copiar texto individual de um flashcard
function copyCardText(button) {
    const card = button.closest('.flashcard');
    const title = card.querySelector('.flashcard-title').textContent;
    const description = card.querySelector('.flashcard-description').textContent;
    
    const formattedText = `${title}\n${description}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formattedText).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            copyToClipboardFallback(formattedText, button);
        });
    } else {
        copyToClipboardFallback(formattedText, button);
    }
}

// Função para copiar todo o conteúdo da página
function copyAllText() {
    const flashcards = document.querySelectorAll('.flashcard');
    
    if (flashcards.length === 0) {
        alert('Nenhum flashcard encontrado!');
        return;
    }
    
    const pageTitle = document.querySelector('.detail-header h1');
    const pageTitleText = pageTitle ? pageTitle.textContent.trim() : '';
    
    let allText = '';
    if (pageTitleText) {
        allText += `═══════════════════════════════════════════════════\n`;
        allText += `${pageTitleText}\n`;
        allText += `═══════════════════════════════════════════════════\n\n`;
    }
    
    flashcards.forEach((card, index) => {
        const titleElement = card.querySelector('.flashcard-title');
        const descriptionElement = card.querySelector('.flashcard-description');
        
        if (titleElement && descriptionElement) {
            const title = titleElement.textContent.trim();
            const description = descriptionElement.textContent.trim();
            
            allText += `${index + 1}. ${title}\n`;
            allText += `${description}\n`;
            allText += `${'─'.repeat(50)}\n\n`;
        }
    });
    
    if (allText.trim() === '') {
        alert('Nenhum conteúdo para copiar!');
        return;
    }
    
    const button = document.querySelector('.copy-all-btn');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(allText.trim()).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            copyToClipboardFallback(allText.trim(), button);
        });
    } else {
        copyToClipboardFallback(allText.trim(), button);
    }
}

// Função auxiliar para mostrar feedback visual
function showCopyFeedback(button) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    button.textContent = translations[localStorage.getItem('selectedLanguage') || 'pt']['copied'];
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg;
    }, 2000);
}

// Função fallback para copiar (método antigo)
function copyToClipboardFallback(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback(button);
        } else {
            alert('Não foi possível copiar. Por favor, copie manualmente.');
        }
    } catch (err) {
        alert('Erro ao copiar: ' + err);
    }
    
    document.body.removeChild(textArea);
}

// ============================================
// SISTEMA DE MODO CM/NORMAL
// ============================================

// Função para alternar entre visualização Normal e CM
function toggleCMView() {
    const currentMode = localStorage.getItem('viewMode') || 'normal';
    const newMode = currentMode === 'normal' ? 'cm' : 'normal';
    
    localStorage.setItem('viewMode', newMode);
    
    loadFlashcardsForMode(newMode);
    updateViewModeUI(newMode);
}

// Função para atualizar a UI do modo de visualização
function updateViewModeUI(mode) {
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    const button = document.getElementById('toggleCMBtn');
    const indicator = document.getElementById('viewModeIndicator');
    
    // Botões de adicionar mecânicas
    const addNormalBtn = document.querySelector('button[onclick="addNewMechanic(\'normal\')"]');
    const addCMBtn = document.querySelector('button[onclick="addNewMechanic(\'cm\')"]');
    
    if (button) {
        if (mode === 'cm') {
            button.textContent = translations[lang]['toggle-normal'];
            button.classList.add('active-cm');
            document.body.classList.add('cm-mode-active');
            
            // Quando CM estiver ativo: esconder botão normal, mostrar botão CM
            if (addNormalBtn) addNormalBtn.style.display = 'none';
            if (addCMBtn) addCMBtn.style.display = 'inline-block';
        } else {
            button.textContent = translations[lang]['toggle-cm'];
            button.classList.remove('active-cm');
            document.body.classList.remove('cm-mode-active');
            
            // Quando Normal estiver ativo: mostrar botão normal, esconder botão CM
            if (addNormalBtn) addNormalBtn.style.display = 'inline-block';
            if (addCMBtn) addCMBtn.style.display = 'none';
        }
    }
    
    if (indicator) {
        indicator.textContent = translations[lang][mode === 'cm' ? 'viewing-cm' : 'viewing-normal'];
        indicator.className = mode === 'cm' ? 'view-mode-indicator cm-mode' : 'view-mode-indicator normal-mode';
    }
}

// Função para carregar flashcards baseado no modo
function loadFlashcardsForMode(mode) {
    const container = document.getElementById('flashcardsContainer');
    if (!container) return;
    
    const pageId = document.body.getAttribute('data-page-id');
    
    container.querySelectorAll('.flashcard.editable').forEach(card => card.remove());
    
    // Mostrar/esconder flashcards baseado no data-mode
    container.querySelectorAll('.flashcard:not(.editable)').forEach(card => {
        const cardMode = card.getAttribute('data-mode');
        
        if (cardMode) {
            // Se o card tem data-mode, mostrar apenas se corresponder ao modo atual
            if (cardMode === mode) {
                card.style.display = 'block';
                // Adicionar classe visual para modo CM se for card CM
                if (mode === 'cm') {
                    card.classList.add('cm-mode-card');
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('cm-mode-card');
            }
        } else {
            // Cards sem data-mode aparecem sempre
            card.style.display = 'block';
            if (mode === 'cm') {
                card.classList.add('cm-mode-card');
            } else {
                card.classList.remove('cm-mode-card');
            }
        }
    });
    
    const saved = localStorage.getItem(`flashcards-${pageId}-${mode}`);
    
    if (saved) {
        const flashcards = JSON.parse(saved);
        const lang = localStorage.getItem('selectedLanguage') || 'pt';
        
        flashcards.forEach(card => {
            const cmClass = mode === 'cm' ? 'cm-mode-card' : '';
            const flashcardHTML = `
                <div class="flashcard editable ${cmClass}" data-id="${card.id}">
                    <div class="flashcard-header">
                        <h3 class="flashcard-title" contenteditable="true">${card.title}</h3>
                        <div class="flashcard-actions">
                            <button class="btn-copy" onclick="copyCardText(this)" data-translate="copy-text">
                                ${translations[lang]['copy-text']}
                            </button>
                            <button class="btn-remove" onclick="removeCard(this)" data-translate="remove">
                                ${translations[lang]['remove']}
                            </button>
                        </div>
                    </div>
                    <p class="flashcard-description" contenteditable="true">${card.description}</p>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', flashcardHTML);
        });
    }
}

// ============================================
// GERENCIAMENTO DE FLASHCARDS
// ============================================

// Função para adicionar nova mecânica
function addNewMechanic(type) {
    const container = document.getElementById('flashcardsContainer');
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    const mode = localStorage.getItem('viewMode') || 'normal';
    const newId = Date.now();
    
    const prefix = type === 'cm' ? 'CM - ' : '';
    const cmClass = mode === 'cm' ? 'cm-mode-card' : '';
    
    const flashcardHTML = `
        <div class="flashcard editable ${cmClass}" data-id="${newId}">
            <div class="flashcard-header">
                <h3 class="flashcard-title" contenteditable="true">${prefix}${translations[lang]['new-mechanic-title']}</h3>
                <div class="flashcard-actions">
                    <button class="btn-copy" onclick="copyCardText(this)" data-translate="copy-text">
                        ${translations[lang]['copy-text']}
                    </button>
                    <button class="btn-remove" onclick="removeCard(this)" data-translate="remove">
                        ${translations[lang]['remove']}
                    </button>
                </div>
            </div>
            <p class="flashcard-description" contenteditable="true">${translations[lang]['new-mechanic-desc']}</p>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', flashcardHTML);
    saveFlashcards();
}

// Função para remover um card
function removeCard(button) {
    const card = button.closest('.flashcard');
    card.remove();
    saveFlashcards();
}

// Função para salvar flashcards no localStorage
function saveFlashcards() {
    const container = document.getElementById('flashcardsContainer');
    if (!container) return;
    
    const pageId = document.body.getAttribute('data-page-id');
    const mode = localStorage.getItem('viewMode') || 'normal';
    const flashcards = [];
    
    container.querySelectorAll('.flashcard.editable').forEach(card => {
        const title = card.querySelector('.flashcard-title').textContent;
        const description = card.querySelector('.flashcard-description').textContent;
        const id = card.getAttribute('data-id');
        
        flashcards.push({ id, title, description });
    });
    
    localStorage.setItem(`flashcards-${pageId}-${mode}`, JSON.stringify(flashcards));
}

// Função para carregar flashcards salvos
function loadFlashcards() {
    const mode = localStorage.getItem('viewMode') || 'normal';
    loadFlashcardsForMode(mode);
    updateViewModeUI(mode);
}

// Salvar alterações quando o usuário edita
document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('contenteditable')) {
        saveFlashcards();
    }
});

// ============================================
// SISTEMA DE FILTRO DE FRACTALS
// ============================================

function filterFractals(filterType) {
    const fractalsList = document.getElementById('fractalsList');
    if (!fractalsList) return;
    
    const cards = fractalsList.querySelectorAll('.fractal-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allBadges = document.querySelectorAll('.tier-badge');
    
    // Atualiza botões ativos
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Remove todas as classes active dos badges
    allBadges.forEach(badge => badge.classList.remove('active'));
    
    // Filtra cards e ativa badges
    cards.forEach(card => {
        if (filterType === 'all') {
            card.classList.remove('hidden');
        } else if (filterType === 'az') {
            // Ordem alfabética - mostra todos e ordena
            card.classList.remove('hidden');
            const cardsArray = Array.from(cards);
            cardsArray.sort((a, b) => {
                const nameA = a.getAttribute('data-fractal-name').toLowerCase();
                const nameB = b.getAttribute('data-fractal-name').toLowerCase();
                return nameA.localeCompare(nameB);
            });
            cardsArray.forEach(sortedCard => {
                fractalsList.appendChild(sortedCard);
            });
        } else if (filterType === 'cm') {
            // Filtra fractals que tem CM
            const hasCMBadge = card.querySelector('.tier-badge[data-tier="cm"]');
            if (hasCMBadge) {
                card.classList.remove('hidden');
                hasCMBadge.classList.add('active');
                // Também ativa o badge T4 para ordenação
                const t4Badge = card.querySelector('.tier-badge[data-tier="t4"]');
                if (t4Badge) {
                    t4Badge.classList.add('active');
                }
            } else {
                card.classList.add('hidden');
            }
        } else {
            // Filtra por tier (t1, t2, t3, t4)
            const tiers = JSON.parse(card.getAttribute('data-tiers'));
            if (tiers.includes(filterType)) {
                card.classList.remove('hidden');
                const tierBadge = card.querySelector(`.tier-badge[data-tier="${filterType}"]`);
                if (tierBadge) {
                    tierBadge.classList.add('active');
                }
            } else {
                card.classList.add('hidden');
            }
        }
    });
    
    // Ordena por número do tier se não for 'all' ou 'az'
    if (filterType !== 'all' && filterType !== 'az') {
        const visibleCards = Array.from(cards).filter(card => !card.classList.contains('hidden'));
        
        // Para CM, ordena pelo número T4
        const tierToSort = filterType === 'cm' ? 't4' : filterType;
        
        visibleCards.sort((a, b) => {
            const badgeA = a.querySelector(`.tier-badge[data-tier="${tierToSort}"]`);
            const badgeB = b.querySelector(`.tier-badge[data-tier="${tierToSort}"]`);
            
            if (badgeA && badgeB) {
                const textA = badgeA.textContent.trim();
                const textB = badgeB.textContent.trim();
                // Pega o primeiro número depois do hífen
                const numberA = parseInt(textA.split('-')[1].trim().split(',')[0]);
                const numberB = parseInt(textB.split('-')[1].trim().split(',')[0]);
                
                return numberA - numberB;
            }
            return 0;
        });
        
        visibleCards.forEach(card => {
            fractalsList.appendChild(card);
        });
    }
}

// ============================================
// CARREGAMENTO DO RODAPÉ
// ============================================

function loadFooter() {
    // Detecta se está em subpasta para ajustar os caminhos
    const isInSubfolder = window.location.pathname.includes('/fractals/') || 
                          window.location.pathname.includes('/strikes/') || 
                          window.location.pathname.includes('/raids/') || 
                          window.location.pathname.includes('/meta-events/');
    const footerPath = isInSubfolder ? '../footer.html' : 'footer.html';
    const imagePrefix = isInSubfolder ? '../' : '';
    
    // Cache separado para root e subpastas
    const cacheKey = isInSubfolder ? 'footerHTML-subfolder' : 'footerHTML-root';
    const cachedFooter = sessionStorage.getItem(cacheKey);
    
    if (cachedFooter) {
        // Usa o footer do cache já com caminhos ajustados
        document.body.insertAdjacentHTML('beforeend', cachedFooter);
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
        changeLanguage(savedLanguage);
    } else {
        // Carrega o footer pela primeira vez
        fetch(footerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Ajusta caminhos das imagens antes de cachear
                const adjustedData = data.replace(/src="([^"]+\.png)"/g, `src="${imagePrefix}$1"`);
                
                // Salva no cache com os caminhos já ajustados
                sessionStorage.setItem(cacheKey, adjustedData);
                
                // Insere no documento
                document.body.insertAdjacentHTML('beforeend', adjustedData);
                
                // Aplica traduções no footer após inserir
                const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
                changeLanguage(savedLanguage);
            })
            .catch(error => {
                console.error('Erro ao carregar rodapé:', error);
                console.error('Caminho tentado:', footerPath);
            });
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Aplica configurações ANTES do DOMContentLoaded
(function() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
    const currentMode = localStorage.getItem('viewMode') || 'normal';
    
    // Aplica a classe do modo CM imediatamente
    if (currentMode === 'cm') {
        document.documentElement.classList.add('cm-mode-active');
    }
    
    // Define o atributo de idioma no HTML
    document.documentElement.setAttribute('lang', savedLanguage === 'pt' ? 'pt-BR' : savedLanguage);
})();

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Pega o idioma salvo ou usa português como padrão
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
        
        // Carrega traduções em paralelo (rápido)
        await initTranslations();
        
        // Aplica traduções IMEDIATAMENTE se não for português
        // Como HTML já está em português, não precisa aplicar se for 'pt'
        if (savedLanguage !== 'pt') {
            changeLanguage(savedLanguage);
        }
        
        // Configura o seletor de idioma
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
            languageSelect.addEventListener('change', function() {
                changeLanguage(this.value);
            });
        }
        
        // Verifica se a página tem flashcards CM
        const hasCMCards = document.querySelector('.flashcard[data-mode="cm"]') !== null;
        
        // Se a página não tem cards CM, esconde botão CM e indicador
        const toggleCMBtn = document.getElementById('toggleCMBtn');
        const viewModeIndicator = document.getElementById('viewModeIndicator');
        
        if (!hasCMCards) {
            if (toggleCMBtn) toggleCMBtn.style.display = 'none';
            if (viewModeIndicator) viewModeIndicator.style.display = 'none';
        } else {
            if (toggleCMBtn) toggleCMBtn.style.display = 'inline-block';
            if (viewModeIndicator) viewModeIndicator.style.display = 'inline-block';
        }
        
        // Aplica modo CM apenas se a página tiver cards CM
        let currentMode = localStorage.getItem('viewMode') || 'normal';
        
        // Se não tem cards CM, força modo normal
        if (!hasCMCards && currentMode === 'cm') {
            currentMode = 'normal';
            localStorage.setItem('viewMode', 'normal');
        }
        
        if (currentMode === 'cm') {
            document.body.classList.add('cm-mode-active');
        }
        
        // Carrega flashcards para o modo correto
        loadFlashcardsForMode(currentMode);
        updateViewModeUI(currentMode);
        
        // Carrega rodapé
        loadFooter();
        
    } finally {
        // Mostra o conteúdo após tudo pronto
        document.body.classList.add('translations-ready');
    }
});

// ============================================
// ACCORDION PARA LEGENDA DE ÍCONES
// ============================================

function toggleAccordion(trigger) {
    const content = trigger.nextElementSibling; // pega o conteúdo logo abaixo do botão
    
    if (!trigger || !content) return;
    
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    // Alterna o estado
    trigger.setAttribute('aria-expanded', !isExpanded);
    
    if (!isExpanded) {
        content.classList.add('expanded');
    } else {
        content.classList.remove('expanded');
    }
}
