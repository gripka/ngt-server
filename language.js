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
    
    // Atualizar botões de favoritos com novo idioma
    if (typeof updateTopFavoriteButton === 'function') {
        updateTopFavoriteButton();
    }
    if (typeof updateHeaderFavoriteButton === 'function') {
        updateHeaderFavoriteButton();
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
                <h3 class="flashcard-title" contenteditable="true" data-placeholder="${prefix}${translations[lang]['new-mechanic-title']}"></h3>
                <div class="flashcard-actions">
                    <button class="btn-copy" onclick="copyCardText(this)" data-translate="copy-text">
                        ${translations[lang]['copy-text']}
                    </button>
                    <button class="btn-remove" onclick="removeCard(this)" data-translate="remove">
                        ${translations[lang]['remove']}
                    </button>
                </div>
            </div>
            <p class="flashcard-description" contenteditable="true" data-placeholder="${translations[lang]['new-mechanic-desc']}"></p>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', flashcardHTML);
    
    // Adiciona event listeners para placeholder behavior
    const newCard = container.lastElementChild;
    const title = newCard.querySelector('.flashcard-title');
    const description = newCard.querySelector('.flashcard-description');
    
    setupPlaceholder(title);
    setupPlaceholder(description);
    
    // Foca no título para começar a digitar imediatamente
    title.focus();
    
    saveFlashcards();
}

// Função para configurar comportamento de placeholder em elementos contenteditable
function setupPlaceholder(element) {
    const placeholder = element.getAttribute('data-placeholder');
    
    // Mostra placeholder se estiver vazio
    const updatePlaceholder = () => {
        if (element.textContent.trim() === '') {
            element.classList.add('empty');
        } else {
            element.classList.remove('empty');
        }
    };
    
    // Evento de foco - limpa o placeholder visual
    element.addEventListener('focus', () => {
        if (element.textContent.trim() === '') {
            element.classList.remove('empty');
        }
    });
    
    // Evento de blur - restaura placeholder se vazio
    element.addEventListener('blur', () => {
        updatePlaceholder();
    });
    
    // Evento de input - atualiza estado
    element.addEventListener('input', () => {
        updatePlaceholder();
    });
    
    // Estado inicial
    updatePlaceholder();
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
    const filterButtons = document.querySelectorAll('.fractal-filters .tier-btn');
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
// FILTROS DE RAIDS POR WING
// ============================================

function filterRaidsByWing(wing, clickedButton) {
    const container = document.querySelector('.container.menu-container');
    if (!container) return;
    
    const sections = container.querySelectorAll('.raid-section');
    const filterButtons = container.querySelectorAll('.fractal-filters .tier-btn');
    
    // Atualiza botões ativos
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Filtra seções
    sections.forEach(section => {
        if (wing === 'all') {
            section.style.display = 'block';
        } else {
            const sectionWing = section.getAttribute('data-wing');
            section.style.display = (sectionWing === wing) ? 'block' : 'none';
        }
    });
}

// ============================================
// FILTROS DE STRIKES POR REGIÃO
// ============================================

function filterStrikesByRegion(region, clickedButton) {
    const container = document.querySelector('.container.menu-container');
    if (!container) return;
    
    const sections = container.querySelectorAll('.raid-section');
    const filterButtons = container.querySelectorAll('.fractal-filters .tier-btn');
    
    // Atualiza botões ativos
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Filtra seções
    sections.forEach(section => {
        if (region === 'all') {
            section.style.display = 'block';
        } else {
            const sectionRegion = section.getAttribute('data-region');
            section.style.display = (sectionRegion === region) ? 'block' : 'none';
        }
    });
}

// ============================================
// CARREGAMENTO DO RODAPÉ
// ============================================

// Função para inicializar os event listeners do footer
function initializeFooterEvents() {
    const changelogTrigger = document.getElementById('changelogTrigger');
    const changelogModal = document.getElementById('changelogModal');
    const closeBtn = document.getElementById('closeChangelogBtn');
    
    if (changelogTrigger && changelogModal) {
        // Remove listeners antigos (se existirem)
        changelogTrigger.replaceWith(changelogTrigger.cloneNode(true));
        const newTrigger = document.getElementById('changelogTrigger');
        
        // Abrir modal ao clicar no texto do footer
        newTrigger.addEventListener('click', function() {
            changelogModal.style.display = 'flex';
        });
        
        // Fechar modal ao clicar no X
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                changelogModal.style.display = 'none';
            });
        }
        
        // Fechar modal ao clicar fora do conteúdo
        changelogModal.addEventListener('click', function(event) {
            if (event.target === changelogModal) {
                changelogModal.style.display = 'none';
            }
        });
    }
}

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
        
        // FORÇA footer a ser fixo (correção crítica)
        setTimeout(() => {
            const footer = document.querySelector('.site-footer');
            if (footer) {
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
                footer.style.left = '0';
                footer.style.right = '0';
                footer.style.zIndex = '9999';
                footer.style.width = '100%';
            }
        }, 0);
        
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
        changeLanguage(savedLanguage);
        // Reinicializa os event listeners do footer
        initializeFooterEvents();
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
                
                // FORÇA footer a ser fixo (correção crítica)
                setTimeout(() => {
                    const footer = document.querySelector('.site-footer');
                    if (footer) {
                        footer.style.position = 'fixed';
                        footer.style.bottom = '0';
                        footer.style.left = '0';
                        footer.style.right = '0';
                        footer.style.zIndex = '9999';
                        footer.style.width = '100%';
                    }
                }, 0);
                
                // Aplica traduções no footer após inserir
                const savedLanguage = localStorage.getItem('selectedLanguage') || 'pt';
                changeLanguage(savedLanguage);
                
                // Reinicializa os event listeners do footer
                initializeFooterEvents();
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
        
        // FORÇA footer fixo múltiplas vezes para garantir
        const forceFooterFixed = () => {
            const footer = document.querySelector('.site-footer') || document.querySelector('footer');
            if (footer) {
                footer.style.cssText = 'position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; z-index: 9999 !important; width: 100% !important; display: flex !important;';
                console.log('✅ Footer forçado a ser fixo');
                return true;
            }
            return false;
        };
        
        // Executa múltiplas vezes para garantir
        setTimeout(forceFooterFixed, 50);
        setTimeout(forceFooterFixed, 200);
        setTimeout(forceFooterFixed, 500);
        setTimeout(forceFooterFixed, 1000);
        
        // Observer para detectar quando o footer é adicionado ao DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node.classList?.contains('site-footer') || node.tagName === 'FOOTER')) {
                        console.log('🔍 Footer detectado no DOM');
                        forceFooterFixed();
                        observer.disconnect();
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Desconecta o observer após 2 segundos
        setTimeout(() => observer.disconnect(), 2000);
        
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

// ============================================
// SISTEMA DE IMPORTAÇÃO E EXPORTAÇÃO DE MECÂNICAS
// ============================================

// Abre o modal de configurações
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Garantir que o modal apareça no topo da viewport
        window.scrollTo(0, 0);
        modal.scrollTop = 0;
    }
}

// Fecha o modal de configurações
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Exporta TODAS as mecânicas customizadas do site
function exportMechanics() {
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Coleta todas as chaves do localStorage que começam com 'flashcards-'
    const allMechanics = {};
    let totalCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Verifica se é uma chave de flashcards
        if (key && key.startsWith('flashcards-')) {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        allMechanics[key] = parsed;
                        totalCount += parsed.length;
                    }
                } catch (e) {
                    console.error(`Erro ao parsear ${key}:`, e);
                }
            }
        }
    }
    
    // Verifica se há mecânicas para exportar
    if (totalCount === 0) {
        const messages = {
            pt: 'Não há mecânicas customizadas para exportar em nenhuma página do site.',
            en: 'No custom mechanics to export from any page on the site.',
            es: 'No hay mecánicas personalizadas para exportar de ninguna página del sitio.'
        };
        alert(messages[lang]);
        return;
    }
    
    // Cria estrutura organizada por página
    const organizedData = {};
    for (const [key, mechanics] of Object.entries(allMechanics)) {
        // Extrai o pageId e mode da chave (formato: flashcards-{pageId}-{mode})
        const parts = key.replace('flashcards-', '').split('-');
        const mode = parts.pop(); // último elemento é o mode (normal ou cm)
        const pageId = parts.join('-'); // resto é o pageId
        
        if (!organizedData[pageId]) {
            organizedData[pageId] = {
                normal: [],
                cm: []
            };
        }
        
        organizedData[pageId][mode] = mechanics;
    }
    
    const exportData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        totalPages: Object.keys(organizedData).length,
        totalMechanics: totalCount,
        pages: organizedData
    };
    
    // Cria o arquivo JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Cria link de download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ngt-all-mechanics-${Date.now()}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    const messages = {
        pt: `Exportadas ${totalCount} mecânicas de ${Object.keys(organizedData).length} páginas com sucesso!`,
        en: `Successfully exported ${totalCount} mechanics from ${Object.keys(organizedData).length} pages!`,
        es: `¡${totalCount} mecánicas de ${Object.keys(organizedData).length} páginas exportadas con éxito!`
    };
    alert(messages[lang]);
}

// Importa mecânicas de um arquivo JSON (suporta formato completo e individual)
function importMechanics() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            
            // Detecta o formato do arquivo
            let isFullExport = false;
            let pagesToImport = {};
            
            // Formato completo (versão 2.0) - todas as páginas
            if (importData.version === '2.0' && importData.pages) {
                isFullExport = true;
                pagesToImport = importData.pages;
            }
            // Formato antigo (versão 1.0) - página única
            else if (importData.pageId && importData.mechanics) {
                pagesToImport[importData.pageId] = importData.mechanics;
            }
            // Formato inválido
            else {
                throw new Error('Formato de arquivo inválido');
            }
            
            // Conta quantas mecânicas serão importadas
            let totalMechanics = 0;
            let totalPages = Object.keys(pagesToImport).length;
            
            for (const [pageId, mechanics] of Object.entries(pagesToImport)) {
                if (mechanics.normal) totalMechanics += mechanics.normal.length;
                if (mechanics.cm) totalMechanics += mechanics.cm.length;
            }
            
            // Mensagem de confirmação
            const confirmMessages = {
                pt: isFullExport 
                    ? `Isso importará ${totalMechanics} mecânicas de ${totalPages} páginas e substituirá todas as mecânicas customizadas atuais do site. Deseja continuar?`
                    : `Isso importará mecânicas e substituirá as mecânicas customizadas atuais da página "${Object.keys(pagesToImport)[0]}". Deseja continuar?`,
                en: isFullExport
                    ? `This will import ${totalMechanics} mechanics from ${totalPages} pages and replace all current custom mechanics on the site. Do you want to continue?`
                    : `This will import mechanics and replace current custom mechanics on page "${Object.keys(pagesToImport)[0]}". Do you want to continue?`,
                es: isFullExport
                    ? `Esto importará ${totalMechanics} mecánicas de ${totalPages} páginas y reemplazará todas las mecánicas personalizadas actuales del sitio. ¿Deseas continuar?`
                    : `Esto importará mecánicas y reemplazará las mecánicas personalizadas actuales de la página "${Object.keys(pagesToImport)[0]}". ¿Deseas continuar?`
            };
            
            if (!confirm(confirmMessages[lang])) {
                return;
            }
            
            // Importa as mecânicas
            let importedCount = 0;
            for (const [pageId, mechanics] of Object.entries(pagesToImport)) {
                if (mechanics.normal && mechanics.normal.length > 0) {
                    localStorage.setItem(`flashcards-${pageId}-normal`, JSON.stringify(mechanics.normal));
                    importedCount += mechanics.normal.length;
                }
                
                if (mechanics.cm && mechanics.cm.cm.length > 0) {
                    localStorage.setItem(`flashcards-${pageId}-cm`, JSON.stringify(mechanics.cm));
                    importedCount += mechanics.cm.length;
                }
            }
            
            // Mensagem de sucesso
            const successMessages = {
                pt: isFullExport
                    ? `${importedCount} mecânicas de ${totalPages} páginas importadas com sucesso! A página será recarregada.`
                    : `Mecânicas importadas com sucesso! A página será recarregada.`,
                en: isFullExport
                    ? `${importedCount} mechanics from ${totalPages} pages imported successfully! The page will be reloaded.`
                    : `Mechanics imported successfully! The page will be reloaded.`,
                es: isFullExport
                    ? `¡${importedCount} mecánicas de ${totalPages} páginas importadas con éxito! La página se recargará.`
                    : `¡Mecánicas importadas con éxito! La página se recargará.`
            };
            alert(successMessages[lang]);
            
            location.reload();
            
        } catch (error) {
            console.error('Erro ao importar:', error);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            const errorMessages = {
                pt: 'Erro ao importar arquivo. Verifique se o formato está correto.',
                en: 'Error importing file. Check if the format is correct.',
                es: 'Error al importar el archivo. Verifica si el formato es correcto.'
            };
            alert(errorMessages[lang]);
        }
    };
    
    input.click();
}

// Abre o modal de confirmação de reset
function openResetConfirmModal() {
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Fecha o modal de confirmação de reset
function closeResetConfirmModal() {
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Reseta todas as configurações do site
function resetAllSettings() {
    // Pega o idioma ANTES de limpar (para mostrar mensagem no idioma correto)
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Conta quantos itens serão deletados (para debug)
    console.log('🗑️ Resetando configurações...');
    console.log(`📊 Total de itens no localStorage: ${localStorage.length}`);
    
    // Lista todos os itens antes de deletar
    const itemsToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            itemsToDelete.push(key);
            if (key.startsWith('flashcards-')) {
                console.log(`  - Flashcard encontrado: ${key}`);
            }
        }
    }
    
    // Mensagem de confirmação
    const messages = {
        pt: 'Todas as configurações foram resetadas. A página será recarregada.',
        en: 'All settings have been reset. The page will be reloaded.',
        es: 'Todas las configuraciones se han restablecido. La página se recargará.'
    };
    
    // Limpa COMPLETAMENTE o localStorage (favoritos, mecânicas customizadas, configurações, etc)
    localStorage.clear();
    console.log(`✅ localStorage limpo! ${itemsToDelete.length} itens removidos`);
    
    // Também limpa o sessionStorage (cache do footer, etc)
    sessionStorage.clear();
    console.log('✅ sessionStorage limpo!');
    
    // Fecha o modal de confirmação
    closeResetConfirmModal();
    
    // Fecha o modal de configurações se estiver aberto
    closeSettingsModal();
    
    // Mostra mensagem
    alert(messages[lang]);
    
    // Força limpeza completa do cache e recarrega
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
    
    // Recarrega a página SEM usar cache
    window.location.href = window.location.href.split('?')[0] + '?_=' + Date.now();
}

// ============================================
// SISTEMA DE FAVORITOS
// ============================================

// Estrutura de dados dos favoritos por categoria
const FAVORITES_CATEGORIES = {
    fractals: {
        key: 'fractals',
        name: { pt: 'Fractals', en: 'Fractals', es: 'Fractales' },
        path: 'fractals/'
    },
    raids: {
        key: 'raids',
        name: { pt: 'Raids', en: 'Raids', es: 'Raids' },
        path: 'raids/'
    },
    strikes: {
        key: 'strikes',
        name: { pt: 'Strikes', en: 'Strikes', es: 'Strikes' },
        path: 'strikes/'
    },
    metas: {
        key: 'metas',
        name: { pt: 'Meta Events', en: 'Meta Events', es: 'Meta Eventos' },
        path: 'meta-events/'
    }
};

// Obter todos os favoritos do localStorage
function getFavorites() {
    const favoritesData = localStorage.getItem('ngt-favorites');
    if (!favoritesData) {
        return { fractals: [], raids: [], strikes: [], metas: [] };
    }
    
    try {
        return JSON.parse(favoritesData);
    } catch (e) {
        console.error('Erro ao parsear favoritos:', e);
        return { fractals: [], raids: [], strikes: [], metas: [] };
    }
}

// Salvar favoritos no localStorage
function saveFavorites(favorites) {
    localStorage.setItem('ngt-favorites', JSON.stringify(favorites));
}

// Detectar categoria e ID da página atual
function getCurrentPageInfo() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    // Detectar categoria baseado no caminho
    if (path.includes('/fractals/')) {
        return { category: 'fractals', id: filename, path: path };
    } else if (path.includes('/raids/')) {
        return { category: 'raids', id: filename, path: path };
    } else if (path.includes('/strikes/')) {
        return { category: 'strikes', id: filename, path: path };
    } else if (path.includes('/meta-events/')) {
        return { category: 'metas', id: filename, path: path };
    }
    
    return null;
}

// Verificar se a página atual está favoritada
function isCurrentPageFavorited() {
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo) return false;
    
    const favorites = getFavorites();
    const categoryFavorites = favorites[pageInfo.category] || [];
    
    return categoryFavorites.some(fav => fav.id === pageInfo.id);
}

// Toggle favorito da página atual
function toggleFavorite() {
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo) {
        console.error('Não foi possível detectar a página atual');
        return;
    }
    
    const favorites = getFavorites();
    const categoryFavorites = favorites[pageInfo.category] || [];
    
    // Pegar o título da página
    const titleElement = document.querySelector('.header-title h1');
    const title = titleElement ? titleElement.textContent.trim() : pageInfo.id;
    
    const favoriteIndex = categoryFavorites.findIndex(fav => fav.id === pageInfo.id);
    
    let isNowFavorite;
    const headerBtn = document.getElementById('headerFavoriteBtn');
    
    if (favoriteIndex > -1) {
        // Remover dos favoritos
        categoryFavorites.splice(favoriteIndex, 1);
        isNowFavorite = false;
        
        // Adicionar animação de REMOÇÃO no botão circular
        if (headerBtn) {
            headerBtn.classList.add('removing-favorite');
            setTimeout(() => {
                headerBtn.classList.remove('removing-favorite');
            }, 600);
        }
    } else {
        // Adicionar aos favoritos
        categoryFavorites.push({
            id: pageInfo.id,
            title: title,
            path: pageInfo.path
        });
        isNowFavorite = true;
        
        // Adicionar animação de ADIÇÃO APENAS no botão circular (header button)
        if (headerBtn) {
            headerBtn.classList.add('adding-favorite');
            setTimeout(() => {
                headerBtn.classList.remove('adding-favorite');
            }, 800);
        }
        
        // NÃO animar o botão do topo (que abre o modal)
        // Ele deve permanecer sem animação
    }
    
    favorites[pageInfo.category] = categoryFavorites;
    saveFavorites(favorites);
    
    // Atualizar APENAS o botão circular (que adiciona/remove)
    updateHeaderFavoriteButton();
    
    // NÃO tocar no botão do topo - ele é completamente independente
    // e só deve ser atualizado ao carregar a página ou trocar idioma
    
    // Se a função do favorites.js existir, também chama ela para garantir
    if (typeof window.updateFavoriteIcon === 'function') {
        window.updateFavoriteIcon(isNowFavorite);
    }
}

// Atualizar APENAS o botão do topo (que abre o modal)
// Este botão NUNCA muda de título, sempre mostra "Ver Favoritos"
// E NUNCA muda visualmente quando clicamos no botão circular
function updateTopFavoriteButton() {
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    const modalText = {
        pt: 'Ver Favoritos',
        en: 'View Favorites',
        es: 'Ver Favoritos'
    };
    
    const topBtn = document.getElementById('favoriteBtn');
    if (topBtn) {
        topBtn.title = modalText[lang];
        topBtn.setAttribute('aria-label', modalText[lang]);
    }
}

// Atualizar APENAS o botão circular (que adiciona/remove)
// Este botão tem título dinâmico
function updateHeaderFavoriteButton() {
    const isFavorited = isCurrentPageFavorited();
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    const addText = {
        pt: 'Adicionar aos Favoritos',
        en: 'Add to Favorites',
        es: 'Agregar a Favoritos'
    };
    
    const removeText = {
        pt: 'Remover dos Favoritos',
        en: 'Remove from Favorites',
        es: 'Quitar de Favoritos'
    };
    
    const headerBtn = document.getElementById('headerFavoriteBtn');
    if (headerBtn) {
        if (isFavorited) {
            headerBtn.classList.add('active');
            headerBtn.setAttribute('aria-pressed', 'true');
            headerBtn.setAttribute('data-favorite', 'true');
            headerBtn.title = removeText[lang];
            headerBtn.setAttribute('aria-label', removeText[lang]);
        } else {
            headerBtn.classList.remove('active');
            headerBtn.setAttribute('aria-pressed', 'false');
            headerBtn.setAttribute('data-favorite', 'false');
            headerBtn.title = addText[lang];
            headerBtn.setAttribute('aria-label', addText[lang]);
        }
    }
}

// Função wrapper para manter compatibilidade (chama ambas)
function updateFavoriteButton() {
    updateTopFavoriteButton();
    updateHeaderFavoriteButton();
}

// Remover um favorito específico
function removeFavorite(category, id) {
    const favorites = getFavorites();
    const categoryFavorites = favorites[category] || [];
    
    const newCategoryFavorites = categoryFavorites.filter(fav => fav.id !== id);
    favorites[category] = newCategoryFavorites;
    
    saveFavorites(favorites);
    
    // Recarregar modal
    renderFavoritesModal();
    
    // Atualizar botão se estivermos na página removida
    const pageInfo = getCurrentPageInfo();
    if (pageInfo && pageInfo.category === category && pageInfo.id === id) {
        updateFavoriteButton();
    }
}

// Abrir modal de favoritos
function openFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        modal.scrollTop = 0;
        
        renderFavoritesModal();
    }
}

// Fechar modal de favoritos
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Renderizar conteúdo do modal de favoritos
function renderFavoritesModal() {
    const container = document.getElementById('favoritesContent');
    const emptyState = document.getElementById('favoritesEmpty');
    if (!container) return;
    
    const favorites = getFavorites();
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Verificar se há favoritos
    const totalFavorites = Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalFavorites === 0) {
        // Mostrar estado vazio
        if (emptyState) emptyState.style.display = 'block';
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
    }
    
    // Esconder estado vazio
    if (emptyState) emptyState.style.display = 'none';
    
    // Renderizar categorias com favoritos
    let html = '';
    
    for (const [categoryKey, categoryData] of Object.entries(FAVORITES_CATEGORIES)) {
        const categoryFavorites = favorites[categoryKey] || [];
        
        // Só mostrar categorias que têm favoritos
        if (categoryFavorites.length === 0) continue;
        
        const categoryName = categoryData.name[lang] || categoryData.name.pt;
        
        html += `
            <div class="favorites-category">
                <div class="favorites-category-title">
                    ${categoryName}
                    <span class="favorites-category-count">${categoryFavorites.length}</span>
                </div>
                <div class="favorites-list">
        `;
        
        categoryFavorites.forEach(favorite => {
            // Ajustar caminho relativo se necessário
            let favPath = favorite.path;
            if (!favPath.startsWith('/') && !favPath.startsWith('http')) {
                favPath = categoryData.path + favorite.id + '.html';
            }
            
            html += `
                <div class="favorite-item">
                    <a href="${favPath}" class="favorite-item-info">
                        <span class="favorite-item-name">${favorite.title}</span>
                    </a>
                    <div class="favorite-item-actions">
                        <button class="btn-remove-favorite" onclick="removeFavorite('${categoryKey}', '${favorite.id}')">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Inicializar favoritos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // O botão do topo NUNCA muda visualmente - não precisa de classes
    // Ele apenas abre o modal, sem indicar se a página está favoritada
    
    // Atualizar títulos dos botões
    updateTopFavoriteButton();
    updateHeaderFavoriteButton();
});

// Exportar favoritos para arquivo JSON
function exportFavorites() {
    const favorites = getFavorites();
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Conta total de favoritos
    const totalFavorites = Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalFavorites === 0) {
        const messages = {
            pt: 'Não há favoritos para exportar.',
            en: 'No favorites to export.',
            es: 'No hay favoritos para exportar.'
        };
        alert(messages[lang]);
        return;
    }
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalFavorites: totalFavorites,
        favorites: favorites
    };
    
    // Criar arquivo JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Criar link de download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ngt-favorites-${Date.now()}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    const messages = {
        pt: `${totalFavorites} favoritos exportados com sucesso!`,
        en: `${totalFavorites} favorites exported successfully!`,
        es: `¡${totalFavorites} favoritos exportados con éxito!`
    };
    alert(messages[lang]);
}

// Importar favoritos de arquivo JSON
function importFavorites() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            
            // Validar formato
            if (!importData.favorites || typeof importData.favorites !== 'object') {
                throw new Error('Formato de arquivo inválido');
            }
            
            const totalFavorites = importData.totalFavorites || 
                Object.values(importData.favorites).reduce((sum, arr) => sum + (arr?.length || 0), 0);
            
            // Mensagem de confirmação
            const confirmMessages = {
                pt: `Isso importará ${totalFavorites} favoritos e substituirá seus favoritos atuais. Deseja continuar?`,
                en: `This will import ${totalFavorites} favorites and replace your current favorites. Do you want to continue?`,
                es: `Esto importará ${totalFavorites} favoritos y reemplazará tus favoritos actuales. ¿Deseas continuar?`
            };
            
            if (!confirm(confirmMessages[lang])) {
                return;
            }
            
            // Importar favoritos
            saveFavorites(importData.favorites);
            
            // Mensagem de sucesso
            const successMessages = {
                pt: `${totalFavorites} favoritos importados com sucesso!`,
                en: `${totalFavorites} favorites imported successfully!`,
                es: `¡${totalFavorites} favoritos importados con éxito!`
            };
            alert(successMessages[lang]);
            
            // Atualizar UI se modal estiver aberto
            const modal = document.getElementById('favoritesModal');
            if (modal && modal.style.display === 'flex') {
                renderFavoritesModal();
            }
            
            // Atualizar botão se estivermos em uma página de detalhes
            updateFavoriteButton();
            
        } catch (error) {
            console.error('Erro ao importar:', error);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            const errorMessages = {
                pt: 'Erro ao importar arquivo. Verifique se o formato está correto.',
                en: 'Error importing file. Check if the format is correct.',
                es: 'Error al importar el archivo. Verifica si el formato es correcto.'
            };
            alert(errorMessages[lang]);
        }
    };
    
    input.click();
}


// Exportar tudo (mecÃ¢nicas + favoritos + configuraÃ§Ãµes)
function exportAll() {
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Coletar todos os dados
    const allData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        type: 'complete-backup',
        data: {
            // Favoritos
            favorites: getFavorites(),
            
            // MecÃ¢nicas (todas as pÃ¡ginas que tiverem)
            mechanics: {},
            
            // ConfiguraÃ§Ãµes gerais
            settings: {
                language: localStorage.getItem('selectedLanguage') || 'pt',
                theme: localStorage.getItem('theme') || 'light'
            }
        }
    };
    
    // Coletar mecânicas de todas as páginas possíveis
    const mechanicsKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('flashcards-') || key.startsWith('mechanics-') || key.startsWith('custom-mechanics-')
    );
    
    mechanicsKeys.forEach(key => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                allData.data.mechanics[key] = JSON.parse(value);
            }
        } catch (e) {
            console.warn(`Não foi possível incluir ${key} no backup`);
        }
    });
    
    // Contar total de itens
    const totalFavorites = Object.values(allData.data.favorites).reduce((sum, arr) => sum + arr.length, 0);
    const totalMechanics = Object.keys(allData.data.mechanics).length;
    
    // Criar arquivo JSON
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Criar link de download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ngt-backup-completo-${Date.now()}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    const messages = {
        pt: `Backup completo exportado!\n${totalFavorites} favoritos + ${totalMechanics} páginas com mecânicas customizadas.`,
        en: `Complete backup exported!\n${totalFavorites} favorites + ${totalMechanics} pages with custom mechanics.`,
        es: `¡Backup completo exportado!\n${totalFavorites} favoritos + ${totalMechanics} páginas con mecánicas personalizadas.`
    };
    alert(messages[lang]);
}

// Importar tudo (mecÃ¢nicas + favoritos + configuraÃ§Ãµes)
function importAll() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            
            // Validar formato
            if (!importData.data || typeof importData.data !== 'object') {
                throw new Error('Formato de arquivo invÃ¡lido');
            }
            
            // Contar itens
            const totalFavorites = importData.data.favorites ? 
                Object.values(importData.data.favorites).reduce((sum, arr) => sum + (arr?.length || 0), 0) : 0;
            const totalMechanics = importData.data.mechanics ? 
                Object.keys(importData.data.mechanics).length : 0;
            
            // Mensagem de confirmaÃ§Ã£o
            const confirmMessages = {
                pt: `Isso importarÃ¡ um backup completo:\nâ€¢ ${totalFavorites} favoritos\nâ€¢ ${totalMechanics} pÃ¡ginas com mecÃ¢nicas customizadas\n\nIsso substituirÃ¡ TODOS os seus dados atuais. Deseja continuar?`,
                en: `This will import a complete backup:\nâ€¢ ${totalFavorites} favorites\nâ€¢ ${totalMechanics} pages with custom mechanics\n\nThis will replace ALL your current data. Do you want to continue?`,
                es: `Esto importarÃ¡ un backup completo:\nâ€¢ ${totalFavorites} favoritos\nâ€¢ ${totalMechanics} pÃ¡ginas con mecÃ¡nicas personalizadas\n\nEsto reemplazarÃ¡ TODOS tus datos actuales. Â¿Deseas continuar?`
            };
            
            if (!confirm(confirmMessages[lang])) {
                return;
            }
            
            // Importar favoritos
            if (importData.data.favorites) {
                saveFavorites(importData.data.favorites);
            }
            
            // Importar mecÃ¢nicas
            if (importData.data.mechanics) {
                Object.entries(importData.data.mechanics).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });
            }
            
            // Importar configuraÃ§Ãµes
            if (importData.data.settings) {
                if (importData.data.settings.language) {
                    localStorage.setItem('selectedLanguage', importData.data.settings.language);
                }
                if (importData.data.settings.theme) {
                    localStorage.setItem('theme', importData.data.settings.theme);
                }
            }
            
            // Mensagem de sucesso
            const successMessages = {
                pt: `Backup importado com sucesso!\n${totalFavorites} favoritos + ${totalMechanics} pÃ¡ginas restauradas.`,
                en: `Backup imported successfully!\n${totalFavorites} favorites + ${totalMechanics} pages restored.`,
                es: `Â¡Backup importado con Ã©xito!\n${totalFavoritos} favoritos + ${totalMechanics} pÃ¡ginas restauradas.`
            };
            alert(successMessages[lang]);
            
            // Recarregar a pÃ¡gina para aplicar todas as mudanÃ§as
            const reloadMessages = {
                pt: 'A pÃ¡gina serÃ¡ recarregada para aplicar as alteraÃ§Ãµes.',
                en: 'The page will be reloaded to apply the changes.',
                es: 'La pÃ¡gina se recargarÃ¡ para aplicar los cambios.'
            };
            alert(reloadMessages[lang]);
            location.reload();
            
        } catch (error) {
            console.error('Erro ao importar backup completo:', error);
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            const errorMessages = {
                pt: 'Erro ao importar arquivo. Verifique se o formato estÃ¡ correto.',
                en: 'Error importing file. Check if the format is correct.',
                es: 'Error al importar el archivo. Verifica si el formato es correcto.'
            };
            alert(errorMessages[lang]);
        }
    };
    
    input.click();
}
