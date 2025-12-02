// Sistema de Busca Global - NGT Site
// Busca através de Fractals, Strikes, Raids e Meta Events

(function() {
    'use strict';

    // Database de conteúdo para busca
    const contentDatabase = {
        fractals: [
            { name: 'Aetherblade', url: 'fractals/aetherblade.html', category: 'Fractals', tier: 'T4/CM' },
            { name: 'Aquatic Ruins', url: 'fractals/aquatic-ruins.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Chaos', url: 'fractals/chaos.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Cliffside', url: 'fractals/cliffside.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Deepstone', url: 'fractals/deepstone.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Furnace', url: 'fractals/furnace.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Kinfall', url: 'fractals/kinfall.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Lonely Tower', url: 'fractals/lonely.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Mai Trin', url: 'fractals/maitrin.html', category: 'Fractals', tier: 'T4/CM' },
            { name: 'Molten Boss', url: 'fractals/molten.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Nightmare', url: 'fractals/nightmare.html', category: 'Fractals', tier: 'T4/CM' },
            { name: 'Observatory', url: 'fractals/observatory.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Silent Surf', url: 'fractals/silentsurf.html', category: 'Fractals', tier: 'T4/CM' },
            { name: 'Siren\'s Reef', url: 'fractals/sirens.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Snowblind', url: 'fractals/snowblind.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Solid Ocean', url: 'fractals/solidocean.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Sunqua Peak', url: 'fractals/sunqua.html', category: 'Fractals', tier: 'T4/CM' },
            { name: 'Swampland', url: 'fractals/swamp.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Thaumanova Reactor', url: 'fractals/thaumanova.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Twilight Oasis', url: 'fractals/twilight.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Uncategorized', url: 'fractals/uncategorized.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Underground Facility', url: 'fractals/underground.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Urban Battleground', url: 'fractals/urban.html', category: 'Fractals', tier: 'T1-T4' },
            { name: 'Volcanic', url: 'fractals/volcanic.html', category: 'Fractals', tier: 'T1-T4' }
        ],
        strikes: [
            { name: 'Aetherblade Hideout', url: 'strikes/aetherblade.html', category: 'Strikes', tier: 'CM' },
            { name: 'Boneskinner', url: 'strikes/boneskinner.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Cold War', url: 'strikes/coldwar.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Cosmic Observatory', url: 'strikes/cosmic.html', category: 'Strikes', tier: 'CM' },
            { name: 'Forging Steel', url: 'strikes/forgingsteel.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Fraenir of Jormag', url: 'strikes/fraenir.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Harvest Temple', url: 'strikes/harvest.html', category: 'Strikes', tier: 'CM' },
            { name: 'Kaineng Overlook', url: 'strikes/kaineng.html', category: 'Strikes', tier: 'CM' },
            { name: 'Old Lion\'s Court', url: 'strikes/oldlionscourt.html', category: 'Strikes', tier: 'CM' },
            { name: 'Shiverpeaks Pass', url: 'strikes/shiverpeaks.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Temple of Febe', url: 'strikes/temple.html', category: 'Strikes', tier: 'CM' },
            { name: 'Voice and the Claw', url: 'strikes/voicewinter.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Whisper of Jormag', url: 'strikes/whisperfall.html', category: 'Strikes', tier: 'Normal' },
            { name: 'Xunlai Jade Junkyard', url: 'strikes/xunlai.html', category: 'Strikes', tier: 'CM' }
        ],
        raids: [
            { name: 'Adina', url: 'raids/adina.html', category: 'Raids', wing: 'Wing 7' },
            { name: 'Bandit Trio', url: 'raids/bandittrio.html', category: 'Raids', wing: 'Wing 2' },
            { name: 'Cairn', url: 'raids/cairn.html', category: 'Raids', wing: 'Wing 4' },
            { name: 'Cardinal Adina', url: 'raids/ca.html', category: 'Raids', wing: 'Wing 7' },
            { name: 'Conjured Amalgamate', url: 'raids/ca.html', category: 'Raids', wing: 'Wing 6' },
            { name: 'Decima', url: 'raids/decima.html', category: 'Raids', wing: 'Wing 8' },
            { name: 'Deimos', url: 'raids/deimos.html', category: 'Raids', wing: 'Wing 4' },
            { name: 'Dhuum', url: 'raids/dhuum.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Eater of Souls', url: 'raids/eater.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Escort', url: 'raids/escort.html', category: 'Raids', wing: 'Wing 3' },
            { name: 'Eyes', url: 'raids/eyes.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Gorseval', url: 'raids/gorseval.html', category: 'Raids', wing: 'Wing 1' },
            { name: 'Greer', url: 'raids/greer.html', category: 'Raids', wing: 'Wing 8' },
            { name: 'Keep Construct', url: 'raids/keepconstruct.html', category: 'Raids', wing: 'Wing 3' },
            { name: 'Largos Twins', url: 'raids/largos.html', category: 'Raids', wing: 'Wing 6' },
            { name: 'Matthias', url: 'raids/matthias.html', category: 'Raids', wing: 'Wing 2' },
            { name: 'Mursaat Overseer', url: 'raids/mursaat.html', category: 'Raids', wing: 'Wing 4' },
            { name: 'Qadim', url: 'raids/qadim.html', category: 'Raids', wing: 'Wing 6' },
            { name: 'Qadim the Peerless', url: 'raids/qadim2.html', category: 'Raids', wing: 'Wing 7' },
            { name: 'River of Souls', url: 'raids/river.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Sabetha', url: 'raids/sabetha.html', category: 'Raids', wing: 'Wing 1' },
            { name: 'Sabir', url: 'raids/sabir.html', category: 'Raids', wing: 'Wing 7' },
            { name: 'Samarog', url: 'raids/samarog.html', category: 'Raids', wing: 'Wing 4' },
            { name: 'Slothasor', url: 'raids/slothasor.html', category: 'Raids', wing: 'Wing 2' },
            { name: 'Soulless Horror', url: 'raids/soulless.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Spirit Woods', url: 'raids/spiritwoods.html', category: 'Raids', wing: 'Wing 1' },
            { name: 'Statue of Darkness', url: 'raids/statues.html', category: 'Raids', wing: 'Wing 5' },
            { name: 'Twisted Castle', url: 'raids/twistedcastle.html', category: 'Raids', wing: 'Wing 3' },
            { name: 'Ura', url: 'raids/ura.html', category: 'Raids', wing: 'Wing 8' },
            { name: 'Vale Guardian', url: 'raids/vale.html', category: 'Raids', wing: 'Wing 1' },
            { name: 'Xera', url: 'raids/xera.html', category: 'Raids', wing: 'Wing 3' }
        ],
        metaEvents: [
            { name: 'Amnytas', url: 'meta-events/amnytas.html', category: 'Meta Events', expansion: 'SotO' },
            { name: 'Auric Basin', url: 'meta-events/auric-basin.html', category: 'Meta Events', expansion: 'HoT' },
            { name: 'Battle for Lion\'s Arch', url: 'meta-events/battle-lions-arch.html', category: 'Meta Events', expansion: 'LW1' },
            { name: 'Bjora Marches', url: 'meta-events/bjora-marches.html', category: 'Meta Events', expansion: 'IbS' },
            { name: 'Branded Shatterer', url: 'meta-events/branded-shatterer.html', category: 'Meta Events', expansion: 'LW4' },
            { name: 'Casino Blitz', url: 'meta-events/casino-blitz.html', category: 'Meta Events', expansion: 'LW4' },
            { name: 'Desolation', url: 'meta-events/desolation.html', category: 'Meta Events', expansion: 'PoF' },
            { name: 'Dragon\'s End', url: 'meta-events/dragons-end.html', category: 'Meta Events', expansion: 'EoD' },
            { name: 'Dragon\'s Stand', url: 'meta-events/dragons-stand.html', category: 'Meta Events', expansion: 'HoT' },
            { name: 'Dragonstorm', url: 'meta-events/dragonstorm.html', category: 'Meta Events', expansion: 'IbS' },
            { name: 'Dry Top', url: 'meta-events/dry-top.html', category: 'Meta Events', expansion: 'LW2' },
            { name: 'Echovald Wilds', url: 'meta-events/echovald-wilds.html', category: 'Meta Events', expansion: 'EoD' },
            { name: 'Grothmar Valley', url: 'meta-events/grothmar-valley.html', category: 'Meta Events', expansion: 'IbS' },
            { name: 'Hammerhart Rumble!', url: 'meta-events/hammerhart-rumble.html', category: 'Meta Events', expansion: 'VoE' },
            { name: 'Inner Nayos', url: 'meta-events/inner-nayos.html', category: 'Meta Events', expansion: 'SotO' },
            { name: 'Janthir Syntri', url: 'meta-events/janthir-syntri.html', category: 'Meta Events', expansion: 'JW' },
            { name: 'Kaineng City', url: 'meta-events/kaineng-city.html', category: 'Meta Events', expansion: 'EoD' },
            { name: 'Karka Queen', url: 'meta-events/karka-queen.html', category: 'Meta Events', expansion: 'Core' },
            { name: 'Lake Doric', url: 'meta-events/lake-doric.html', category: 'Meta Events', expansion: 'LW3' },
            { name: 'Ley-Line Anomaly', url: 'meta-events/ley-line-anomaly.html', category: 'Meta Events', expansion: 'LW3' },
            { name: 'Lowland Shore', url: 'meta-events/lowland-shore.html', category: 'Meta Events', expansion: 'JW' },
            { name: 'Palawadan', url: 'meta-events/palawadan.html', category: 'Meta Events', expansion: 'PoF' },
            { name: 'Scarlet Invasion', url: 'meta-events/scarlet-invasion.html', category: 'Meta Events', expansion: 'LW1' },
            { name: 'Secrets of the Weald', url: 'meta-events/secrets-weald.html', category: 'Meta Events', expansion: 'VoE' },
            { name: 'Seitung Province', url: 'meta-events/seitung-province.html', category: 'Meta Events', expansion: 'EoD' },
            { name: 'Serpent\'s Ire', url: 'meta-events/serpents-ire.html', category: 'Meta Events', expansion: 'PoF' },
            { name: 'Shatterer', url: 'meta-events/shatterer.html', category: 'Meta Events', expansion: 'Core' },
            { name: 'Skywatch Archipelago', url: 'meta-events/skywatch.html', category: 'Meta Events', expansion: 'SotO' },
            { name: 'Tangled Depths', url: 'meta-events/tangled-depths.html', category: 'Meta Events', expansion: 'HoT' },
            { name: 'Tequatl', url: 'meta-events/tequatl.html', category: 'Meta Events', expansion: 'Core' },
            { name: 'Tower of Nightmares', url: 'meta-events/tower-nightmares.html', category: 'Meta Events', expansion: 'LW1' },
            { name: 'Triple Trouble', url: 'meta-events/triple-trouble.html', category: 'Meta Events', expansion: 'Core' },
            { name: 'Twisted Marionette', url: 'meta-events/twisted-marionette.html', category: 'Meta Events', expansion: 'LW1' },
            { name: 'Verdant Brink', url: 'meta-events/verdant-brink.html', category: 'Meta Events', expansion: 'HoT' }
        ]
    };

    // Função de busca
    function searchContent(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        // Buscar em todas as categorias
        Object.keys(contentDatabase).forEach(category => {
            contentDatabase[category].forEach(item => {
                const nameMatch = item.name.toLowerCase().includes(searchTerm);
                const categoryMatch = item.category.toLowerCase().includes(searchTerm);
                const tierMatch = item.tier && item.tier.toLowerCase().includes(searchTerm);
                const wingMatch = item.wing && item.wing.toLowerCase().includes(searchTerm);
                const expansionMatch = item.expansion && item.expansion.toLowerCase().includes(searchTerm);

                if (nameMatch || categoryMatch || tierMatch || wingMatch || expansionMatch) {
                    results.push({
                        ...item,
                        relevance: nameMatch ? 3 : (categoryMatch ? 2 : 1)
                    });
                }
            });
        });

        // Ordenar por relevância
        results.sort((a, b) => b.relevance - a.relevance);

        return results;
    }

    // Função para exibir resultados
    function displayResults(results) {
        const modal = document.getElementById('globalSearchModal');
        const resultsContainer = document.getElementById('globalSearchResults');
        const noResults = document.getElementById('globalSearchNoResults');

        if (results.length === 0) {
            resultsContainer.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Agrupar por categoria
        const grouped = {};
        results.forEach(item => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });

        // Renderizar resultados
        let html = '';
        Object.keys(grouped).forEach(category => {
            html += `<div class="search-category">
                <h3 class="search-category-title">${category} (${grouped[category].length})</h3>
                <div class="search-results-grid">`;
            
            grouped[category].forEach(item => {
                const badge = item.tier || item.wing || item.expansion || '';
                html += `
                    <a href="${item.url}" class="search-result-item">
                        <div class="search-result-name">${item.name}</div>
                        ${badge ? `<div class="search-result-badge">${badge}</div>` : ''}
                    </a>
                `;
            });

            html += `</div></div>`;
        });

        resultsContainer.innerHTML = html;
    }

    // Inicializar busca global
    function initGlobalSearch() {
        const searchInput = document.getElementById('globalSearchInput');
        const modal = document.getElementById('globalSearchModal');
        const closeBtn = document.getElementById('closeGlobalSearch');
        const searchContainer = document.querySelector('.global-search-container');

        if (!searchInput || !modal) return;

        // Função para ajustar z-index da barra de busca
        function updateSearchBarZIndex(modalOpen) {
            if (searchContainer) {
                searchContainer.style.zIndex = modalOpen ? '10002' : '1100';
            }
        }

        // Event listener para input
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value;

            if (query.trim().length >= 2) {
                searchTimeout = setTimeout(() => {
                    const results = searchContent(query);
                    displayResults(results);
                    modal.style.display = 'flex';
                    updateSearchBarZIndex(true);
                }, 300); // Debounce de 300ms
            } else {
                modal.style.display = 'none';
                updateSearchBarZIndex(false);
            }
        });

        // Focus no input abre o modal se houver texto
        searchInput.addEventListener('focus', function(e) {
            if (e.target.value.trim().length >= 2) {
                const results = searchContent(e.target.value);
                displayResults(results);
                modal.style.display = 'flex';
                updateSearchBarZIndex(true);
            }
        });

        // Fechar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                updateSearchBarZIndex(false);
            });
        }

        // Fechar ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                updateSearchBarZIndex(false);
            }
        });

        // Atalho ESC para fechar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                updateSearchBarZIndex(false);
            }
        });

        // Atalho Ctrl+K para focar no input
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Inicializar quando o DOM estiver pronto E o header carregado
    function waitForHeaderAndInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                document.addEventListener('headerLoaded', initGlobalSearch);
                // Timeout de segurança caso o header já tenha sido carregado
                setTimeout(initGlobalSearch, 1000);
            });
        } else {
            // Se o DOM já está pronto, esperar o header ou tentar depois de 500ms
            if (document.getElementById('globalSearchInput')) {
                initGlobalSearch();
            } else {
                document.addEventListener('headerLoaded', initGlobalSearch);
                setTimeout(initGlobalSearch, 1000);
            }
        }
    }

    waitForHeaderAndInit();
})();
