// Advanced Meta Events System - Using Official GW2 Wiki Data
// Loads from gw2-timer-raw.json and processes sequences to show upcoming events timeline

let eventData = null;
let updateInterval = null;
let waypointCache = {}; // Cache for waypoint names

// Expose for debugging
window.eventData = null;

// Categories to display (filter out PvP tournaments and some others)
const CATEGORIES_TO_SHOW = [
    'Core Tyria',
    'Living World Season 1',
    'Living World Season 2',
    'Heart of Thorns',
    'Living World Season 3',
    'Path of Fire',
    'Living World Season 4',
    'The Icebrood Saga',
    'End of Dragons',
    'Secrets of the Obscure',
    'Janthir Wilds'
];

// Events to exclude (we don't want PvP tournaments, day/night cycle, etc.)
const EVENTS_TO_EXCLUDE = [
    't', // empty timer
    'dn', // day/night
    'euat', // EU PvP tournaments
    'naat', // NA PvP tournaments
    'fi' // Fractal Incursions (too frequent)
];

// Category translations
const CATEGORY_NAMES = {
    'Core Tyria': {
        pt: 'Core Tyria',
        en: 'Core Tyria',
        es: 'Core Tyria'
    },
    'Living World Season 1': {
        pt: 'Living World - Temporada 1',
        en: 'Living World Season 1',
        es: 'Living World - Temporada 1'
    },
    'Living World Season 2': {
        pt: 'Living World - Temporada 2',
        en: 'Living World Season 2',
        es: 'Living World - Temporada 2'
    },
    'Heart of Thorns': {
        pt: 'Heart of Thorns',
        en: 'Heart of Thorns',
        es: 'Heart of Thorns'
    },
    'Living World Season 3': {
        pt: 'Living World - Temporada 3',
        en: 'Living World Season 3',
        es: 'Living World - Temporada 3'
    },
    'Path of Fire': {
        pt: 'Path of Fire',
        en: 'Path of Fire',
        es: 'Path of Fire'
    },
    'Living World Season 4': {
        pt: 'Living World - Temporada 4',
        en: 'Living World Season 4',
        es: 'Living World - Temporada 4'
    },
    'The Icebrood Saga': {
        pt: 'The Icebrood Saga',
        en: 'The Icebrood Saga',
        es: 'The Icebrood Saga'
    },
    'End of Dragons': {
        pt: 'End of Dragons',
        en: 'End of Dragons',
        es: 'End of Dragons'
    },
    'Secrets of the Obscure': {
        pt: 'Secrets of the Obscure',
        en: 'Secrets of the Obscure',
        es: 'Secrets of the Obscure'
    },
    'Janthir Wilds': {
        pt: 'Janthir Wilds',
        en: 'Janthir Wilds',
        es: 'Janthir Wilds'
    }
};

// Load event data from JSON
async function loadEventData() {
    try {
        const response = await fetch('gw2-timer-raw.json');
        eventData = await response.json();
        window.eventData = eventData; // Expose for debugging
        console.log('Event data loaded successfully', eventData);
        
        renderAllEvents();
    } catch (error) {
        console.error('Error loading event data:', error);
        showError('Failed to load event data. Please refresh the page.');
    }
}

// Decode GW2 chatlink to get POI ID
function decodeChatlink(chatlink) {
    try {
        // Remove [&...=] wrapper and unescape HTML entities
        const base64 = chatlink.replace(/\[&|=\]/g, '').replace(/&/g, '&');
        
        // Decode base64
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        
        // First byte is type (4 = POI/waypoint)
        const type = bytes[0];
        if (type !== 4) {
            return null; // Not a waypoint
        }
        
        // Next 4 bytes are the POI ID (little-endian)
        const poiId = bytes[1] | (bytes[2] << 8) | (bytes[3] << 16) | (bytes[4] << 24);
        return poiId;
    } catch (error) {
        console.error('Error decoding chatlink:', chatlink, error);
        return null;
    }
}

// Fetch waypoint name from GW2 API
async function getWaypointName(chatlink) {
    if (!chatlink) return null;
    
    // Check cache first
    if (waypointCache[chatlink]) {
        return waypointCache[chatlink];
    }
    
    const poiId = decodeChatlink(chatlink);
    if (!poiId) return null;
    
    try {
        const lang = localStorage.getItem('selectedLanguage') || 'pt';
        const apiLang = lang === 'pt' ? 'en' : lang; // GW2 API doesn't have PT, use EN
        
        // Try to fetch directly from maps API
        // We need to search through all continents and floors
        const continents = [1, 2]; // Tyria and Mists
        
        for (const continentId of continents) {
            try {
                // Get floors for this continent
                const floorsResponse = await fetch(`https://api.guildwars2.com/v2/continents/${continentId}/floors?ids=all`);
                if (!floorsResponse.ok) continue;
                
                const floors = await floorsResponse.json();
                
                // Search each floor
                for (const floor of floors) {
                    if (!floor.regions) continue;
                    
                    for (const regionId in floor.regions) {
                        const region = floor.regions[regionId];
                        if (!region.maps) continue;
                        
                        for (const mapId in region.maps) {
                            const map = region.maps[mapId];
                            if (!map.points_of_interest) continue;
                            
                            for (const poi of map.points_of_interest) {
                                if (poi.id === poiId && poi.type === 'waypoint') {
                                    waypointCache[chatlink] = poi.name;
                                    return poi.name;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`Error searching continent ${continentId}:`, err);
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching waypoint name:', error);
        return null;
    }
}

// Calculate upcoming events from a sequence
function calculateUpcomingEvents(eventConfig, count = 5) {
    const now = new Date();
    const currentTime = now.getTime();
    
    // Get sequence pattern - use pattern if not empty, otherwise use partial
    let pattern = eventConfig.sequences.pattern;
    let usePartialAsPattern = false;
    
    if (!pattern || pattern.length === 0) {
        pattern = eventConfig.sequences.partial || [];
        usePartialAsPattern = true;
    }
    
    const partial = eventConfig.sequences.partial || [];
    
    if (pattern.length === 0) return [];
    
    // Calculate total cycle duration
    let cycleDuration = 0;
    pattern.forEach(step => {
        cycleDuration += step.d;
    });
    
    // Calculate partial offset (only if we have both pattern AND partial as separate sequences)
    let partialDuration = 0;
    if (!usePartialAsPattern && eventConfig.sequences.pattern && eventConfig.sequences.pattern.length > 0 && eventConfig.sequences.partial) {
        partial.forEach(step => {
            partialDuration += step.d;
        });
    }
    
    // Find current position in cycle (in minutes since epoch)
    const minutesSinceEpoch = Math.floor(currentTime / (1000 * 60));
    
    // Calculate cycle position
    let cyclePosition;
    if (usePartialAsPattern) {
        // For events using only partial (like HWB), calculate position directly
        // GW2 events typically align to UTC midnight, so we use that as reference
        const minutesSinceMidnight = minutesSinceEpoch % (24 * 60);
        cyclePosition = minutesSinceMidnight % cycleDuration;
    } else {
        // For events with separate pattern and partial, use the partial offset
        cyclePosition = (minutesSinceEpoch - partialDuration) % cycleDuration;
    }
    
    // Find upcoming events
    const upcomingEvents = [];
    let accumulatedTime = 0;
    let currentCycleOffset = 0;
    
    // Build timeline for next few cycles
    for (let cycle = 0; cycle < 4 && upcomingEvents.length < count + 10; cycle++) {
        for (let i = 0; i < pattern.length; i++) {
            const step = pattern[i];
            const stepStart = accumulatedTime;
            const stepEnd = accumulatedTime + step.d;
            
            // Calculate when this event starts (timeOffset can be negative if event already started)
            const timeOffset = (cycle * cycleDuration) + stepStart - cyclePosition;
            
            if (step.r !== 0) { // r=0 means empty/gap
                const segment = eventConfig.segments[step.r];
                // Skip if segment doesn't exist or has empty name
                if (segment && segment.name && segment.name.trim() !== '') {
                    const eventTime = new Date(currentTime + (timeOffset * 60 * 1000));
                    const timeUntil = timeOffset * 60 * 1000; // in milliseconds (can be negative)
                    const eventEndTime = eventTime.getTime() + (step.d * 60 * 1000);
                    
                    // Check if event is currently active (started but not finished)
                    const isActive = currentTime >= eventTime.getTime() && currentTime < eventEndTime;
                    
                    // Include active events and upcoming events
                    if (isActive || timeUntil >= 0) {
                        upcomingEvents.push({
                            name: segment.name,
                            location: segment.link || segment.name,
                            chatlink: segment.chatlink || null,
                            waypointName: null, // Will be loaded asynchronously
                            time: eventTime,
                            timeUntil: timeUntil,
                            duration: step.d,
                            isActive: isActive
                        });
                    }
                }
            }
            
            accumulatedTime = stepEnd;
        }
        accumulatedTime = (cycle + 1) * cycleDuration;
    }
    
    // Sort: active events first, then by time
    upcomingEvents.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.timeUntil - b.timeUntil;
    });
    
    return upcomingEvents.slice(0, count);
}

// Format countdown time
function formatCountdown(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Format time as HH:MM in local timezone
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Get timezone offset
    const offset = -date.getTimezoneOffset() / 60;
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    
    return `${hours}:${minutes} (UTC${offsetStr})`;
}

// Copy waypoint to clipboard
function copyWaypoint(waypoint, eventName) {
    if (!waypoint) {
        const lang = localStorage.getItem('selectedLanguage') || 'pt';
        const messages = {
            pt: 'Waypoint não disponível',
            en: 'No waypoint available',
            es: 'Waypoint no disponible'
        };
        showCopyMessage(messages[lang], false);
        return;
    }
    
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Use the reliable fallback method that works in file:// protocol
    const textArea = document.createElement('textarea');
    textArea.value = waypoint;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const messages = {
                pt: `Waypoint copiado: ${waypoint}`,
                en: `Waypoint copied: ${waypoint}`,
                es: `Waypoint copiado: ${waypoint}`
            };
            showCopyMessage(messages[lang], true);
        } else {
            throw new Error('Copy command returned false');
        }
    } catch (err) {
        console.error('Failed to copy waypoint:', err);
        const messages = {
            pt: `Falha ao copiar. Waypoint: ${waypoint}`,
            en: `Failed to copy. Waypoint: ${waypoint}`,
            es: `Error al copiar. Waypoint: ${waypoint}`
        };
        showCopyMessage(messages[lang], false);
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy notification
function showCopyMessage(message, success) {
    const existingMsg = document.querySelector('.copy-notification');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'copy-notification ' + (success ? 'success' : 'error');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error message
function showError(message) {
    const container = document.getElementById('eventTimersContainer');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Create event bar for category (horizontal timeline)
function createEventBar(eventKey, eventConfig, lang) {
    if (!eventConfig.category || !CATEGORIES_TO_SHOW.includes(eventConfig.category)) {
        return null;
    }
    
    const upcomingEvents = calculateUpcomingEvents(eventConfig, 8);
    
    if (upcomingEvents.length === 0) return null;
    
    const section = document.createElement('div');
    section.className = 'event-bar-section';
    section.dataset.eventKey = eventKey;
    
    // Header with category and event type
    const header = document.createElement('div');
    header.className = 'event-bar-header';
    
    const title = document.createElement('h3');
    title.className = 'event-bar-title';
    title.textContent = eventConfig.name;
    
    header.appendChild(title);
    section.appendChild(header);
    
    // Scrollable timeline container
    const timeline = document.createElement('div');
    timeline.className = 'event-bar-timeline';
    
    upcomingEvents.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.eventKey = eventKey;
        card.dataset.index = index;
        card.dataset.eventTime = event.time.getTime(); // Store event time for countdown updates
        card.dataset.duration = event.duration; // Store duration for active check
        
        // Add urgency/active class
        if (event.isActive || event.timeUntil <= 0) {
            card.classList.add('event-active');
        } else {
            const minutes = event.timeUntil / (1000 * 60);
            if (minutes <= 15) {
                card.classList.add('event-imminent');
            } else if (minutes <= 30) {
                card.classList.add('event-soon');
            }
        }
        
        // Event name
        const name = document.createElement('div');
        name.className = 'event-card-name';
        name.textContent = event.name;
        
        // Time info
        const timeInfo = document.createElement('div');
        timeInfo.className = 'event-card-time';
        
        if (event.isActive || event.timeUntil <= 0) {
            // Calculate time remaining in the event
            const eventEndTime = event.time.getTime() + (event.duration * 60 * 1000);
            const timeRemaining = eventEndTime - new Date().getTime();
            
            timeInfo.innerHTML = `
                <div class="event-card-utc">${formatTime(event.time)} UTC</div>
                <div class="event-card-countdown event-active-text">🔴 ${formatCountdown(timeRemaining)}</div>
            `;
        } else {
            timeInfo.innerHTML = `
                <div class="event-card-utc">${formatTime(event.time)} UTC</div>
                <div class="event-card-countdown">${formatCountdown(event.timeUntil)}</div>
            `;
        }
        
        // Waypoint button - show waypoint icon only
        const waypointBtn = document.createElement('div');
        waypointBtn.className = 'event-card-waypoint';
        if (event.chatlink) {
            // Show waypoint icon centered
            waypointBtn.innerHTML = `<img src="waypoint.png" alt="Waypoint" class="waypoint-icon-img" />`;
            waypointBtn.style.cursor = 'pointer';
            waypointBtn.style.display = 'flex';
            waypointBtn.style.justifyContent = 'center';
            waypointBtn.style.alignItems = 'center';
            waypointBtn.title = `${event.name} - Click to copy waypoint`;
            
            // Set onclick immediately
            waypointBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyWaypoint(event.chatlink, event.name);
            };
        } else {
            const lang = localStorage.getItem('selectedLanguage') || 'pt';
            const noWaypointText = {
                pt: 'Sem waypoint',
                en: 'No waypoint',
                es: 'Sin waypoint'
            };
            waypointBtn.innerHTML = `<span style="color: #999;">${noWaypointText[lang]}</span>`;
        }
        
        // Duration badge
        const duration = document.createElement('div');
        duration.className = 'event-card-duration';
        duration.textContent = `${event.duration}min`;
        
        card.appendChild(name);
        card.appendChild(timeInfo);
        card.appendChild(waypointBtn);
        card.appendChild(duration);
        
        timeline.appendChild(card);
    });
    
    section.appendChild(timeline);
    
    return section;
}

// Update all countdowns - recalculate time remaining every second
function updateAllCountdowns() {
    if (!eventData) return;
    
    const now = new Date().getTime();
    let needsRerender = false;
    
    // Update each card's countdown by recalculating time difference
    document.querySelectorAll('.event-card').forEach(card => {
        const eventTime = parseInt(card.dataset.eventTime);
        const duration = parseInt(card.dataset.duration);
        if (!eventTime) return;
        
        const timeUntil = eventTime - now;
        const timeSinceStart = now - eventTime;
        const isActive = timeSinceStart >= 0 && timeSinceStart <= (duration * 60 * 1000);
        
        // If event duration ended, we need to re-render
        if (timeSinceStart > (duration * 60 * 1000)) {
            needsRerender = true;
            return;
        }
        
        const countdown = card.querySelector('.event-card-countdown');
        if (countdown) {
            if (isActive) {
                // Show countdown of time remaining in the active event
                const eventEndTime = eventTime + (duration * 60 * 1000);
                const timeRemaining = eventEndTime - now;
                countdown.textContent = `🔴 ${formatCountdown(timeRemaining)}`;
                countdown.classList.add('event-active-text');
            } else {
                countdown.textContent = formatCountdown(timeUntil);
                countdown.classList.remove('event-active-text');
            }
        }
        
        // Update urgency/active class
        card.classList.remove('event-imminent', 'event-soon', 'event-active');
        if (isActive) {
            card.classList.add('event-active');
        } else {
            const minutes = timeUntil / (1000 * 60);
            if (minutes <= 15) {
                card.classList.add('event-imminent');
            } else if (minutes <= 30) {
                card.classList.add('event-soon');
            }
        }
    });
    
    if (needsRerender) {
        renderAllEvents();
    }
}

// Render all events grouped by category
function renderAllEvents() {
    const container = document.getElementById('eventTimersContainer');
    if (!container || !eventData) return;
    
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    container.innerHTML = '';
    
    // Group events by category
    const groupedEvents = {};
    
    for (const [eventKey, eventConfig] of Object.entries(eventData.events)) {
        if (EVENTS_TO_EXCLUDE.includes(eventKey)) continue;
        if (!eventConfig.category || !CATEGORIES_TO_SHOW.includes(eventConfig.category)) continue;
        
        if (!groupedEvents[eventConfig.category]) {
            groupedEvents[eventConfig.category] = [];
        }
        
        groupedEvents[eventConfig.category].push({
            key: eventKey,
            config: eventConfig
        });
    }
    
    // Render each category group
    CATEGORIES_TO_SHOW.forEach(categoryName => {
        if (!groupedEvents[categoryName]) return;
        
        // Create category container
        const categorySection = document.createElement('div');
        categorySection.className = 'event-category-group';
        categorySection.setAttribute('data-category', categoryName);
        
        // Category title
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'event-category-group-title';
        const translatedName = CATEGORY_NAMES[categoryName] || { pt: categoryName, en: categoryName, es: categoryName };
        categoryTitle.textContent = translatedName[lang];
        categorySection.appendChild(categoryTitle);
        
        // Add all event bars for this category
        groupedEvents[categoryName].forEach(({ key, config }) => {
            const eventBar = createEventBar(key, config, lang);
            if (eventBar) {
                categorySection.appendChild(eventBar);
            }
        });
        
        container.appendChild(categorySection);
    });
    
    // Start updating countdowns every second
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    updateInterval = setInterval(updateAllCountdowns, 1000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEventData);
} else {
    loadEventData();
}

// Re-render when language changes
document.addEventListener('languageChanged', renderAllEvents);

// Filter functionality
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            
            // Show/hide categories
            const categoryGroups = document.querySelectorAll('.event-category-group');
            
            categoryGroups.forEach(group => {
                if (filter === 'all') {
                    group.style.display = 'block';
                } else {
                    const category = group.getAttribute('data-category');
                    if (category === filter) {
                        group.style.display = 'block';
                    } else {
                        group.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Setup filters after a short delay to ensure DOM is ready
setTimeout(setupFilters, 100);

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

// Função de busca de eventos
function filterEventsBySearch(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Buscar todos os cards de eventos E todas as seções de barras
    const allCards = document.querySelectorAll('.event-card');
    const allBarSections = document.querySelectorAll('.event-bar-section');
    
    // Se a busca estiver vazia, mostrar todos
    if (normalizedSearch === '') {
        allCards.forEach(card => {
            card.style.display = '';
        });
        allBarSections.forEach(section => {
            section.style.display = '';
        });
        
        // Mostrar/ocultar categorias vazias
        document.querySelectorAll('.event-category-group').forEach(section => {
            const visibleBars = section.querySelectorAll('.event-bar-section:not([style*="display: none"])');
            section.style.display = visibleBars.length > 0 ? 'block' : 'none';
        });
        return;
    }
    
    // Filtrar cards de eventos
    allCards.forEach(card => {
        const nameElement = card.querySelector('.event-card-name');
        
        if (!nameElement) {
            return;
        }
        
        const eventName = nameElement.textContent.toLowerCase();
        
        // Mostrar se o nome contém o termo de busca
        if (eventName.includes(normalizedSearch)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Ocultar barras de eventos que não têm cards visíveis
    allBarSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.event-card:not([style*="display: none"])');
        section.style.display = visibleCards.length > 0 ? '' : 'none';
    });
    
    // Ocultar categorias que não têm barras visíveis
    document.querySelectorAll('.event-category-group').forEach(section => {
        const visibleBars = section.querySelectorAll('.event-bar-section:not([style*="display: none"])');
        section.style.display = visibleBars.length > 0 ? 'block' : 'none';
    });
}

// Inicializar busca de eventos
function initEventSearch() {
    const searchInput = document.getElementById('eventSearchInput');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        // Busca ao digitar
        searchInput.addEventListener('input', (e) => {
            filterEventsBySearch(e.target.value);
        });
        
        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filterEventsBySearch(searchInput.value);
            }
        });
        
        // Limpar busca quando mudar o idioma
        document.addEventListener('languageChanged', () => {
            searchInput.value = '';
            filterEventsBySearch('');
        });
    }
    
    // Adicionar click no ícone de busca
    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            filterEventsBySearch(searchInput.value);
        });
    }
}

// Inicializar busca após carregar eventos
setTimeout(() => {
    initEventSearch();
}, 500);
