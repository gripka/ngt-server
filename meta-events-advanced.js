// Advanced Meta Events System - Using Official GW2 Wiki Data
// Loads from gw2-timer-raw.json and processes sequences to show upcoming events timeline

let eventData = null;
let updateInterval = null;
let waypointCache = {}; // Cache for waypoint names
let animationFrameId = null; // For requestAnimationFrame
let lastUpdateTime = 0; // Throttle updates
let isPageVisible = true; // Track page visibility
let cardObserver = null; // Intersection Observer for lazy loading
let lastRenderTime = 0; // Prevent too frequent re-renders
const RERENDER_COOLDOWN = 60000; // Only re-render every 60 seconds max

// Expose for debugging
window.eventData = null;

// Detect if animations should be reduced
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Event name to detail page mapping
const EVENT_DETAIL_PAGES = {
    // Core Tyria - Hard World Bosses
    'The Shatterer': 'meta-events/shatterer.html',
    'Tequatl the Sunless': 'meta-events/tequatl.html',
    'Triple Trouble': 'meta-events/triple-trouble.html',
    'Great Jungle Wurm': 'meta-events/triple-trouble.html',
    'Karka Queen': 'meta-events/karka-queen.html',
    // Core Tyria - Ley-Line Anomaly
    'Ley-Line Anomaly': 'meta-events/ley-line-anomaly.html',
    'Timberline Falls': 'meta-events/ley-line-anomaly.html',
    'Iron Marches': 'meta-events/ley-line-anomaly.html',
    'Gendarran Fields': 'meta-events/ley-line-anomaly.html',
    // Living World Season 1
    'Twisted Marionette (Public)': 'meta-events/twisted-marionette.html',
    'Tower of Nightmares (Public)': 'meta-events/tower-nightmares.html',
    'Battle For Lion\'s Arch (Public)': 'meta-events/battle-lions-arch.html',
    'Scarlet\'s Invasion': 'meta-events/scarlet-invasion.html',
    'Defeat Scarlet\'s minions': 'meta-events/scarlet-invasion.html',
    // Living World Season 2
    'Crash Site': 'meta-events/dry-top.html',
    'Sandstorm': 'meta-events/dry-top.html',
    'Dry Top': 'meta-events/dry-top.html',
    // Heart of Thorns
    'Night and the Enemy': 'meta-events/verdant-brink.html',
    'Verdant Brink': 'meta-events/verdant-brink.html',
    'Auric Basin': 'meta-events/auric-basin.html',
    'Octovine': 'meta-events/auric-basin.html',
    'Tangled Depths': 'meta-events/tangled-depths.html',
    'Chak Gerent': 'meta-events/tangled-depths.html',
    'Dragon\'s Stand': 'meta-events/dragons-stand.html',
    'Mouth of Mordremoth': 'meta-events/dragons-stand.html',
    // Living World Season 3
    'Lake Doric': 'meta-events/lake-doric.html',
    'White Mantle Control': 'meta-events/lake-doric.html',
    'Noran\'s Homestead': 'meta-events/lake-doric.html',
    'Saidra\'s Haven': 'meta-events/lake-doric.html',
    'New Loamhurst': 'meta-events/lake-doric.html',
    // Path of Fire
    'Casino Blitz': 'meta-events/casino-blitz.html',
    'Crystal Oasis': 'meta-events/casino-blitz.html',
    'Serpents\' Ire': 'meta-events/serpents-ire.html',
    'Domain of Vabbi': 'meta-events/serpents-ire.html',
    'Forged with Fire': 'meta-events/serpents-ire.html',
    'Maws of Torment': 'meta-events/desolation.html',
    'Junundu Rising': 'meta-events/desolation.html',
    'The Desolation': 'meta-events/desolation.html',
    // Living World Season 4
    'Palawadan': 'meta-events/palawadan.html',
    'Domain of Istan': 'meta-events/palawadan.html',
    'Death-Branded Shatterer': 'meta-events/branded-shatterer.html',
    'Destroy the Death-Branded Shatterer': 'meta-events/branded-shatterer.html',
    'Jahai Bluffs': 'meta-events/branded-shatterer.html',
    // The Icebrood Saga
    'Grothmar Valley': 'meta-events/grothmar-valley.html',
    'Effigy': 'meta-events/grothmar-valley.html',
    'Doomlore Shrine': 'meta-events/grothmar-valley.html',
    'Ooze Pits': 'meta-events/grothmar-valley.html',
    'Metal Concert': 'meta-events/grothmar-valley.html',
    'Bjora Marches': 'meta-events/bjora-marches.html',
    'Storms of Winter': 'meta-events/bjora-marches.html',
    'Drakkar': 'meta-events/bjora-marches.html',
    'Champion of the Ice Dragon': 'meta-events/bjora-marches.html',
    'Dragonstorm': 'meta-events/dragonstorm.html',
    'Dragonstorm (Public)': 'meta-events/dragonstorm.html',
    // End of Dragons
    'Seitung Province': 'meta-events/seitung-province.html',
    'Aetherblade Assault': 'meta-events/seitung-province.html',
    'Battle for the Jade Sea': 'meta-events/seitung-province.html',
    'New Kaineng City': 'meta-events/kaineng-city.html',
    'Kaineng Blackout': 'meta-events/kaineng-city.html',
    'Echovald Wilds': 'meta-events/echovald-wilds.html',
    'Gang War': 'meta-events/echovald-wilds.html',
    'The Gang War of Echovald': 'meta-events/echovald-wilds.html',
    'Dragon\'s End': 'meta-events/dragons-end.html',
    'The Battle for the Jade Sea': 'meta-events/dragons-end.html',
    'Jade Maw': 'meta-events/dragons-end.html',
    // Secrets of the Obscure
    'Skywatch Archipelago': 'meta-events/skywatch.html',
    'Decima': 'meta-events/skywatch.html',
    'Decima the Stormsinger': 'meta-events/skywatch.html',
    'Defeat Decima': 'meta-events/skywatch.html',
    'Inner Nayos': 'meta-events/inner-nayos.html',
    'Convergence': 'meta-events/inner-nayos.html',
    'The Midnight King': 'meta-events/inner-nayos.html',
    'Eparch': 'meta-events/inner-nayos.html',
    'Defense of Amnytas': 'meta-events/amnytas.html',
    'Amnytas': 'meta-events/amnytas.html',
    // Janthir Wilds
    'Janthir Syntri': 'meta-events/janthir-syntri.html',
    'Stoic Rampart': 'meta-events/janthir-syntri.html',
    'The Stoic Rampart': 'meta-events/janthir-syntri.html',
    'Lowland Shore': 'meta-events/lowland-shore.html',
    'Titan\'s Threshold': 'meta-events/lowland-shore.html',
    'Greer': 'meta-events/lowland-shore.html',
    // Visions of Eternity
    'Hammerhart Rumble!': 'meta-events/hammerhart-rumble.html',
    'Secrets of the Weald': 'meta-events/secrets-weald.html'
};

// Event key to detail page mapping (fallback for segments without specific links)
const EVENT_KEY_TO_PAGE = {
    'hwb': 'meta-events/shatterer.html', // Hard World Bosses (will use specific pages)
    'la': 'meta-events/ley-line-anomaly.html',
    'eotn': 'meta-events/twisted-marionette.html', // Eye of the North (will use specific pages)
    'dt': 'meta-events/dry-top.html',
    'vb': 'meta-events/verdant-brink.html',
    'ab': 'meta-events/auric-basin.html',
    'td': 'meta-events/tangled-depths.html',
    'ds': 'meta-events/dragons-stand.html',
    'ld': 'meta-events/lake-doric.html',
    'co': 'meta-events/casino-blitz.html',
    'si': 'meta-events/scarlet-invasion.html',
    'dv': 'meta-events/serpents-ire.html',
    'de': 'meta-events/desolation.html',
    'pal': 'meta-events/palawadan.html',
    'dbs': 'meta-events/branded-shatterer.html',
    'gv': 'meta-events/grothmar-valley.html',
    'bm': 'meta-events/bjora-marches.html',
    'dsp': 'meta-events/dragonstorm.html',
    'sp': 'meta-events/seitung-province.html',
    'nkc': 'meta-events/kaineng-city.html',
    'tew': 'meta-events/echovald-wilds.html',
    'dre': 'meta-events/dragons-end.html',
    'sa': 'meta-events/skywatch.html',
    'con': 'meta-events/inner-nayos.html',
    'am': 'meta-events/amnytas.html',
    'js': 'meta-events/janthir-syntri.html',
    'bn': 'meta-events/lowland-shore.html',
    'voe-ss': 'meta-events/hammerhart-rumble.html',
    'voe-sw': 'meta-events/secrets-weald.html'
};

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
    'Janthir Wilds',
    'Visions of Eternity'
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
    },
    'Visions of Eternity': {
        pt: 'Visions of Eternity',
        en: 'Visions of Eternity',
        es: 'Visions of Eternity'
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
function calculateUpcomingEvents(eventConfig, count = 50) {
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
    
    // Build timeline for next 24 hours
    const hoursToShow = 24;
    const minutesToShow = hoursToShow * 60;
    const maxCycles = Math.ceil(minutesToShow / cycleDuration) + 2; // +2 for safety margin
    
    for (let cycle = 0; cycle < maxCycles && upcomingEvents.length < count; cycle++) {
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
                    
                    // Include events within 24 hours
                    const timeUntilMinutes = timeUntil / (60 * 1000);
                    if (isActive || (timeUntil >= 0 && timeUntilMinutes <= minutesToShow)) {
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
    
    // Salvar posição atual do scroll
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    
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
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus({ preventScroll: true }); // Evita scroll ao focar
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
        // Restaurar posição do scroll (caso tenha mudado)
        window.scrollTo(scrollX, scrollY);
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
    
    // Show all events within 24 hours
    const upcomingEvents = calculateUpcomingEvents(eventConfig, 50);
    
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
        
        // Add click handler to navigate to detail page if exists
        // Try specific event name first, then fall back to event key
        const detailPage = EVENT_DETAIL_PAGES[event.name] || EVENT_KEY_TO_PAGE[eventKey];
        
        if (detailPage) {
            card.style.cursor = 'pointer';
            card.onclick = (e) => {
                // Don't navigate if clicking on waypoint button
                if (e.target.closest('.event-card-waypoint')) {
                    return;
                }
                window.location.href = detailPage;
            };
            // Add hover effect
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        }
        
        timeline.appendChild(card);
    });
    
    section.appendChild(timeline);
    
    return section;
}

// Update all countdowns - optimized with throttling
function updateAllCountdowns(timestamp) {
    if (!eventData || !isPageVisible) {
        // Don't update if page is not visible
        animationFrameId = requestAnimationFrame(updateAllCountdowns);
        return;
    }
    
    // Throttle updates to every 1000ms (1 second) for better performance
    if (timestamp - lastUpdateTime < 1000) {
        animationFrameId = requestAnimationFrame(updateAllCountdowns);
        return;
    }
    
    lastUpdateTime = timestamp;
    const now = new Date().getTime();
    let needsRerender = false;
    
    // Batch DOM reads and writes for better performance
    // Only update visible cards for better performance
    const cards = document.querySelectorAll('.event-card.card-visible, .event-card:not(.card-visible):nth-child(-n+3)');
    const updates = [];
    
    // Read phase - collect all data
    cards.forEach(card => {
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
        if (!countdown) return;
        
        // Calculate new values
        let newText, newActiveClass;
        if (isActive) {
            const eventEndTime = eventTime + (duration * 60 * 1000);
            const timeRemaining = eventEndTime - now;
            newText = `🔴 ${formatCountdown(timeRemaining)}`;
            newActiveClass = 'event-active-text';
        } else {
            newText = formatCountdown(timeUntil);
            newActiveClass = '';
        }
        
        // Calculate urgency class
        let urgencyClass = '';
        if (isActive) {
            urgencyClass = 'event-active';
        } else {
            const minutes = timeUntil / (1000 * 60);
            if (minutes <= 15) {
                urgencyClass = 'event-imminent';
            } else if (minutes <= 30) {
                urgencyClass = 'event-soon';
            }
        }
        
        updates.push({ card, countdown, newText, newActiveClass, urgencyClass });
    });
    
    // Write phase - apply all changes at once
    updates.forEach(({ card, countdown, newText, newActiveClass, urgencyClass }) => {
        // Only update if text changed (avoid unnecessary reflows)
        if (countdown.textContent !== newText) {
            countdown.textContent = newText;
        }
        
        // Only update classes if needed
        const currentActiveClass = countdown.classList.contains('event-active-text');
        if (newActiveClass && !currentActiveClass) {
            countdown.classList.add('event-active-text');
        } else if (!newActiveClass && currentActiveClass) {
            countdown.classList.remove('event-active-text');
        }
        
        // Update card classes
        const currentClasses = card.className;
        const baseClass = 'event-card';
        const newClasses = urgencyClass ? `${baseClass} ${urgencyClass}` : baseClass;
        
        if (currentClasses !== newClasses) {
            card.className = newClasses;
        }
    });
    
    if (needsRerender) {
        // Throttle re-renders to avoid performance issues
        const now = Date.now();
        if (now - lastRenderTime > RERENDER_COOLDOWN) {
            lastRenderTime = now;
            renderAllEvents();
            return; // Don't schedule next frame, renderAllEvents will do it
        }
    }
    
    // Schedule next update
    animationFrameId = requestAnimationFrame(updateAllCountdowns);
}

// Render all events grouped by category (optimized with DocumentFragment)
function renderAllEvents() {
    const container = document.getElementById('eventTimersContainer');
    if (!container || !eventData) return;
    
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
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
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
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
        
        fragment.appendChild(categorySection);
    });
    
    // Clear and append all at once (single reflow)
    container.innerHTML = '';
    container.appendChild(fragment);
    
    // Setup Intersection Observer for performance optimization
    setupCardObserver();
    
    // Start updating countdowns with requestAnimationFrame (more efficient)
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastUpdateTime = 0; // Reset throttle timer
    animationFrameId = requestAnimationFrame(updateAllCountdowns);
}

// Setup Intersection Observer to optimize rendering of off-screen cards
function setupCardObserver() {
    // Disconnect existing observer
    if (cardObserver) {
        cardObserver.disconnect();
    }
    
    // Create new Intersection Observer
    // Cards outside viewport will have reduced updates
    const observerOptions = {
        root: null,
        rootMargin: '100px', // Start observing 100px before entering viewport
        threshold: 0
    };
    
    cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
            } else {
                entry.target.classList.remove('card-visible');
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const cards = document.querySelectorAll('.event-card');
    cards.forEach(card => cardObserver.observe(card));
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEventData);
} else {
    loadEventData();
}

// Re-render when language changes
document.addEventListener('languageChanged', renderAllEvents);

// Pause updates when page is not visible (saves CPU)
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    
    if (isPageVisible) {
        // Resume updates when page becomes visible
        if (!animationFrameId && eventData) {
            lastUpdateTime = 0;
            animationFrameId = requestAnimationFrame(updateAllCountdowns);
        }
    } else {
        // Pause updates when page is hidden
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
});

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

// Debounce helper function
let searchDebounceTimer = null;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Função de busca de eventos (optimized)
function filterEventsBySearch(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Use querySelectorAll once and reuse
    const allCards = document.querySelectorAll('.event-card');
    const allBarSections = document.querySelectorAll('.event-bar-section');
    
    // Se a busca estiver vazia, mostrar todos
    if (normalizedSearch === '') {
        // Batch DOM updates
        requestAnimationFrame(() => {
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
        });
        return;
    }
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
        // Filtrar cards de eventos
        allCards.forEach(card => {
            const nameElement = card.querySelector('.event-card-name');
            
            if (!nameElement) {
                return;
            }
            
            const eventName = nameElement.textContent.toLowerCase();
            
            // Mostrar se o nome contém o termo de busca
            card.style.display = eventName.includes(normalizedSearch) ? '' : 'none';
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
    });
}

// Inicializar busca de eventos
function initEventSearch() {
    const searchInput = document.getElementById('eventSearchInput');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        // Busca ao digitar com debounce (300ms) para melhor performance
        const debouncedSearch = debounce((value) => {
            filterEventsBySearch(value);
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
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
