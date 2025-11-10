// ========================================
// FAVORITES MODAL - CARREGAMENTO DINÂMICO
// ========================================

// Função para migrar formato antigo (agrupado) para novo (array)
function migrateFavoritesFormat() {
    // Usar a MESMA chave que language.js
    const rawData = localStorage.getItem('ngt-favorites');
    if (!rawData) return [];
    
    try {
        const data = JSON.parse(rawData);
        
        // Se já é um array simples, retorna direto
        if (Array.isArray(data)) {
            console.log('✅ Formato já é array simples');
            return data;
        }
        
        // Se é objeto agrupado por categoria (formato do language.js), converte
        if (data.fractals || data.raids || data.strikes || data.metas) {
            console.log('🔄 Convertendo formato agrupado para array...');
            const arrayFavorites = [];
            
            const categoryMap = {
                'fractals': 'Fractals',
                'raids': 'Raids', 
                'strikes': 'Strikes',
                'metas': 'Meta Events'
            };
            
            for (const [key, categoryName] of Object.entries(categoryMap)) {
                if (data[key] && Array.isArray(data[key])) {
                    data[key].forEach(item => {
                        arrayFavorites.push({
                            url: item.path || item.url,
                            title: item.title,
                            category: categoryName
                        });
                    });
                }
            }
            
            console.log('✅ Conversão completa! Total:', arrayFavorites.length);
            return arrayFavorites;
        }
        
        return [];
    } catch (e) {
        console.error('❌ Erro ao converter favoritos:', e);
        return [];
    }
}

(function() {
    // Detectar se estamos em uma subpasta ou na raiz
    const scriptTag = document.querySelector('script[src*="favorites.js"]');
    const isInSubfolder = scriptTag && scriptTag.getAttribute('src').startsWith('../');
    const modalPath = isInSubfolder ? '../favorites-modal.html' : 'favorites-modal.html';
    
    // Carregar o modal dinamicamente
    fetch(modalPath)
        .then(response => response.text())
        .then(html => {
            // Inserir o modal no final do body
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Carregar favoritos após modal estar carregado
            loadFavorites();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de favoritos:', error);
        });
})();

// ========================================
// FUNÇÕES DE FAVORITOS
// ========================================

function openFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'flex';
        loadFavorites();
    }
}

function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadFavorites() {
    const favoritesContent = document.getElementById('favoritesContent');
    const favoritesEmpty = document.getElementById('favoritesEmpty');
    
    if (!favoritesContent) return;
    
    // Migrar formato se necessário
    const favorites = migrateFavoritesFormat();
    
    if (favorites.length === 0) {
        if (favoritesEmpty) {
            favoritesEmpty.style.display = 'flex';
        }
        // Limpar outros elementos
        const items = favoritesContent.querySelectorAll('.favorite-item');
        items.forEach(item => item.remove());
        return;
    }
    
    if (favoritesEmpty) {
        favoritesEmpty.style.display = 'none';
    }
    
    // Limpar favoritos antigos
    const oldItems = favoritesContent.querySelectorAll('.favorite-item');
    oldItems.forEach(item => item.remove());
    
    // Adicionar favoritos
    favorites.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <a href="${fav.url}" class="favorite-link">
                <div class="favorite-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="favorite-info">
                    <h3>${fav.title}</h3>
                    <p>${fav.category || ''}</p>
                </div>
            </a>
            <button class="remove-favorite" onclick="removeFavorite('${fav.url}')" title="Favoritos">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        favoritesContent.appendChild(item);
    });
}

function removeFavorite(url) {
    console.log('🗑️ Removendo favorito:', url);
    
    // Obter favoritos no formato do language.js
    const rawData = localStorage.getItem('ngt-favorites');
    let favorites = rawData ? JSON.parse(rawData) : { fractals: [], raids: [], strikes: [], metas: [] };
    
    // Procurar e remover em todas as categorias
    let removed = false;
    for (const categoryKey of ['fractals', 'raids', 'strikes', 'metas']) {
        if (favorites[categoryKey]) {
            const beforeLength = favorites[categoryKey].length;
            favorites[categoryKey] = favorites[categoryKey].filter(fav => fav.path !== url);
            if (favorites[categoryKey].length < beforeLength) {
                removed = true;
                console.log(`✅ Removido de ${categoryKey}`);
            }
        }
    }
    
    if (removed) {
        localStorage.setItem('ngt-favorites', JSON.stringify(favorites));
        loadFavorites();
        updateFavoriteIcon();
        console.log('💾 Favoritos atualizados após remoção');
    } else {
        console.log('⚠️ Favorito não encontrado:', url);
    }
}

function toggleFavorite() {
    console.log('🎯 toggleFavorite iniciado (favorites.js)!');
    
    const currentPath = window.location.pathname;
    const pageTitle = document.querySelector('h1')?.textContent || document.title;
    
    // Detectar categoria e ID
    let category = null;
    let categoryKey = null;
    let pageId = currentPath.split('/').pop().replace('.html', '');
    
    if (currentPath.includes('/fractals/')) {
        category = 'Fractals';
        categoryKey = 'fractals';
    } else if (currentPath.includes('/raids/')) {
        category = 'Raids';
        categoryKey = 'raids';
    } else if (currentPath.includes('/strikes/')) {
        category = 'Strikes';
        categoryKey = 'strikes';
    } else if (currentPath.includes('/meta-events/')) {
        category = 'Meta Events';
        categoryKey = 'metas';
    }
    
    if (!categoryKey) {
        console.error('❌ Categoria não detectada para:', currentPath);
        return;
    }
    
    console.log('📍 Current Path:', currentPath);
    console.log('📄 Page Title:', pageTitle);
    console.log('📂 Category:', category, `(${categoryKey})`);
    console.log('🆔 Page ID:', pageId);
    
    // Obter favoritos no formato do language.js
    const rawData = localStorage.getItem('ngt-favorites');
    let favorites = rawData ? JSON.parse(rawData) : { fractals: [], raids: [], strikes: [], metas: [] };
    
    // Garantir que a categoria existe
    if (!favorites[categoryKey]) {
        favorites[categoryKey] = [];
    }
    
    const categoryFavorites = favorites[categoryKey];
    const existingIndex = categoryFavorites.findIndex(fav => fav.id === pageId);
    
    console.log('🔍 Existing index:', existingIndex);
    console.log('📚 Current favorites in category:', categoryFavorites);
    
    let isNowFavorite;
    if (existingIndex > -1) {
        // Remover dos favoritos
        categoryFavorites.splice(existingIndex, 1);
        isNowFavorite = false;
        console.log('❌ Favorito REMOVIDO!');
    } else {
        // Adicionar aos favoritos
        categoryFavorites.push({
            id: pageId,
            title: pageTitle,
            path: currentPath
        });
        isNowFavorite = true;
        console.log('✅ Favorito ADICIONADO!');
        
        // Trigger animação de heartbeat no botão do header
        const headerBtn = document.getElementById('headerFavoriteBtn');
        if (headerBtn) {
            console.log('💓 Aplicando animação heartbeat...');
            headerBtn.classList.add('adding-favorite');
            setTimeout(() => {
                headerBtn.classList.remove('adding-favorite');
                console.log('💓 Animação heartbeat concluída');
            }, 600);
        }
        
        // Também animar o botão do topo se existir
        const topBtn = document.getElementById('favoriteBtn');
        if (topBtn) {
            topBtn.classList.add('adding-favorite');
            setTimeout(() => {
                topBtn.classList.remove('adding-favorite');
            }, 600);
        }
    }
    
    favorites[categoryKey] = categoryFavorites;
    localStorage.setItem('ngt-favorites', JSON.stringify(favorites));
    console.log('💾 Favoritos salvos no localStorage (ngt-favorites):', favorites);
    
    const modal = document.getElementById('favoritesModal');
    if (modal && modal.style.display === 'flex') {
        loadFavorites();
    }

    updateFavoriteIcon(isNowFavorite);
}

function updateFavoriteIcon(forceState) {
    let isFavorite;

    if (typeof forceState === 'boolean') {
        isFavorite = forceState;
    } else {
        const currentUrl = window.location.pathname;
        const favorites = migrateFavoritesFormat();
        isFavorite = favorites.some(fav => fav.url === currentUrl);
    }

    console.log('Atualizando icones - isFavorite:', isFavorite);
    applyFavoriteVisualState(isFavorite);
}

function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('/fractals/')) return 'Fractals';
    if (path.includes('/raids/')) return 'Raids';
    if (path.includes('/strikes/')) return 'Strikes';
    if (path.includes('/meta-events/')) return 'Meta Events';
    return '';
}

// Atualizar ícone ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFavorites);
} else {
    initializeFavorites();
}

function initializeFavorites() {
    console.log('🚀 Inicializando favoritos...');
    
    // Atualizar ícone inicial
    updateFavoriteIcon();
    
    // O botão do header já tem onclick no HTML, não precisa adicionar listener
    const headerFavoriteBtn = document.getElementById('headerFavoriteBtn');
    if (headerFavoriteBtn) {
        console.log('✅ Botão do header encontrado (usa onclick do HTML)');
    } else {
        console.log('⚠️ Botão do header NÃO encontrado');
    }

    window.addEventListener('storage', event => {
        if (event.key === 'ngt-favorites') {
            updateFavoriteIcon();
        }
    });
}

function applyFavoriteVisualState(isFavorite) {
    // Atualizar apenas os botões de toggle de favoritos (botão circular no header)
    // NÃO atualizar o botão que abre o modal (favorites-button no topo)
    const favoriteButtons = document.querySelectorAll('.header-favorite-btn');
    favoriteButtons.forEach(button => {
        button.classList.toggle('active', isFavorite);
        button.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
        button.setAttribute('data-favorite', isFavorite ? 'true' : 'false');
        button.removeAttribute('style');

        // Título dinâmico apenas para o botão circular de toggle
        const label = isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
        if (button.getAttribute('title') !== null) {
            button.title = label;
        }
        button.setAttribute('aria-label', label);

        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.removeProperty('fill');
            svg.style.removeProperty('stroke');
        }
    });

    // Atualizar APENAS o estado visual do botão do topo (que abre o modal)
    // NÃO alterar seu título - deve permanecer "Ver Favoritos" ou "Favoritos"
    const topFavoriteBtn = document.getElementById('favoriteBtn');
    if (topFavoriteBtn && topFavoriteBtn.classList.contains('favorites-button')) {
        // Apenas adiciona classe 'active' para mostrar visualmente que é favorito
        topFavoriteBtn.classList.toggle('active', isFavorite);
        topFavoriteBtn.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
        // NÃO modificar o title - manter como está no HTML ("Ver Favoritos")
    }
}

function handleHeaderFavoriteClick(e) {
    // Esta função não é mais necessária pois usamos onclick no HTML
    console.log('⚠️ handleHeaderFavoriteClick não deveria ser chamado');
}

// ========================================
// EXPOR FUNÇÕES GLOBALMENTE
// ========================================
window.openFavoritesModal = openFavoritesModal;
window.closeFavoritesModal = closeFavoritesModal;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.loadFavorites = loadFavorites;




