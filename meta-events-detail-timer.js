// Meta Event Detail Page Timer
// Shows event times on detail pages

let detailEventData = null;
let detailUpdateInterval = null;
let detailAnimationFrameId = null;
let detailLastUpdateTime = 0;

// Get event key from page
function getEventKeyFromPage() {
    const pageId = document.body.dataset.pageId;
    if (!pageId) return null;
    
    // Map page IDs to event keys from gw2-timer-raw.json
    const pageToEventKey = {
        'meta-amnytas': 'am',
        'meta-shatterer': 'hwb',
        'meta-tequatl': 'hwb',
        'meta-triple-trouble': 'hwb',
        'meta-karka-queen': 'hwb',
        'meta-ley-line': 'la',
        'meta-marionette': 'eotn',
        'meta-tower': 'eotn',
        'meta-battle-la': 'eotn',
        'meta-scarlet': 'si',
        'meta-drytop': 'dt',
        'meta-verdant-brink': 'vb',
        'meta-auric-basin': 'ab',
        'meta-tangled-depths': 'td',
        'meta-dragons-stand': 'ds',
        'meta-lake-doric': 'ld',
        'meta-casino-blitz': 'co',
        'meta-serpents-ire': 'dv',
        'meta-desolation': 'de',
        'meta-palawadan': 'pal',
        'meta-branded-shatterer': 'dbs',
        'meta-grothmar-valley': 'gv',
        'meta-bjora-marches': 'bm',
        'meta-dragonstorm': 'dsp',
        'meta-seitung-province': 'sp',
        'meta-kaineng-city': 'nkc',
        'meta-echovald-wilds': 'tew',
        'meta-dragons-end': 'dre',
        'meta-skywatch': 'sa',
        'meta-inner-nayos': 'con',
        'meta-janthir-syntri': 'js',
        'meta-lowland-shore': 'bn',
        'meta-hammerhart-rumble': 'voe-ss',
        'meta-secrets-weald': 'voe-sw'
    };
    
    return pageToEventKey[pageId] || null;
}

// Get event name for specific events
function getEventNameFromPage() {
    const pageId = document.body.dataset.pageId;
    
    // Map specific page IDs to event names
    const specificEventNames = {
        'meta-shatterer': 'The Shatterer',
        'meta-tequatl': 'Tequatl the Sunless',
        'meta-triple-trouble': 'Triple Trouble',
        'meta-karka-queen': 'Karka Queen',
        'meta-marionette': 'Twisted Marionette (Public)',
        'meta-tower': 'Tower of Nightmares (Public)',
        'meta-battle-la': 'Battle For Lion\'s Arch (Public)',
        'meta-hammerhart-rumble': 'Hammerhart Rumble!',
        'meta-secrets-weald': 'Secrets of the Weald'
    };
    
    return specificEventNames[pageId] || null;
}

// Calculate upcoming events (simplified from meta-events-advanced.js)
function calculateDetailUpcomingEvents(eventConfig, count = 8) {
    const now = new Date();
    const currentTime = now.getTime();
    
    let pattern = eventConfig.sequences.pattern;
    let usePartialAsPattern = false;
    
    if (!pattern || pattern.length === 0) {
        pattern = eventConfig.sequences.partial || [];
        usePartialAsPattern = true;
    }
    
    const partial = eventConfig.sequences.partial || [];
    
    if (pattern.length === 0) {
        return [];
    }
    
    let cycleDuration = 0;
    pattern.forEach(step => {
        cycleDuration += step.d;
    });
    
    if (cycleDuration === 0) return [];
    
    let partialDuration = 0;
    if (!usePartialAsPattern && eventConfig.sequences.pattern && eventConfig.sequences.pattern.length > 0 && eventConfig.sequences.partial) {
        partial.forEach(step => {
            partialDuration += step.d;
        });
    }
    
    const minutesSinceEpoch = Math.floor(currentTime / (1000 * 60));
    
    let cyclePosition;
    if (usePartialAsPattern) {
        const minutesSinceMidnight = minutesSinceEpoch % (24 * 60);
        cyclePosition = minutesSinceMidnight % cycleDuration;
    } else {
        cyclePosition = (minutesSinceEpoch - partialDuration) % cycleDuration;
    }
    
    const upcomingEvents = [];
    let accumulatedTime = 0;
    
    const hoursToShow = 24;
    const minutesToShow = hoursToShow * 60;
    const maxCycles = Math.ceil(minutesToShow / cycleDuration) + 2;
    
    // Get specific event name if this is a HWB page
    const specificEventName = getEventNameFromPage();
    
    for (let cycle = 0; cycle < maxCycles && upcomingEvents.length < count; cycle++) {
        for (let i = 0; i < pattern.length; i++) {
            const step = pattern[i];
            const stepStart = accumulatedTime;
            const stepEnd = accumulatedTime + step.d;
            
            const timeOffset = (cycle * cycleDuration) + stepStart - cyclePosition;
            
            if (step.r !== 0) {
                const segment = eventConfig.segments[step.r];
                if (segment && segment.name && segment.name.trim() !== '') {
                    // If we have a specific event name, filter for it
                    if (specificEventName && segment.name !== specificEventName) {
                        accumulatedTime = stepEnd;
                        continue;
                    }
                    
                    const eventTime = new Date(currentTime + (timeOffset * 60 * 1000));
                    const timeUntil = timeOffset * 60 * 1000;
                    const eventEndTime = eventTime.getTime() + (step.d * 60 * 1000);
                    
                    const isActive = currentTime >= eventTime.getTime() && currentTime < eventEndTime;
                    
                    const timeUntilMinutes = timeUntil / (60 * 1000);
                    if (isActive || (timeUntil >= 0 && timeUntilMinutes <= minutesToShow)) {
                        upcomingEvents.push({
                            name: segment.name,
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
    
    upcomingEvents.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.timeUntil - b.timeUntil;
    });
    
    return upcomingEvents.slice(0, count);
}

// Format countdown
function formatDetailCountdown(milliseconds) {
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

// Format time
function formatDetailTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Create timer widget
function createTimerWidget(events, eventName) {
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    const widget = document.createElement('div');
    widget.className = 'detail-timer-widget';
    
    const header = document.createElement('div');
    header.className = 'detail-timer-header';
    
    const title = document.createElement('h3');
    title.setAttribute('data-translate', 'upcoming-times');
    // Set initial text, will be updated by translation system
    const titleTexts = {
        pt: 'Próximos Horários',
        en: 'Upcoming Times',
        es: 'Próximos Horarios'
    };
    title.textContent = titleTexts[lang];
    
    header.appendChild(title);
    widget.appendChild(header);
    
    const timeline = document.createElement('div');
    timeline.className = 'detail-timer-timeline';
    
    events.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'detail-timer-card';
        card.dataset.eventTime = event.time.getTime();
        card.dataset.duration = event.duration;
        
        if (event.isActive) {
            card.classList.add('detail-active');
        } else {
            const minutes = event.timeUntil / (1000 * 60);
            if (minutes <= 15) {
                card.classList.add('detail-imminent');
            } else if (minutes <= 30) {
                card.classList.add('detail-soon');
            }
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'detail-timer-time';
        timeDiv.textContent = formatDetailTime(event.time);
        
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'detail-timer-countdown';
        
        if (event.isActive) {
            const eventEndTime = event.time.getTime() + (event.duration * 60 * 1000);
            const timeRemaining = eventEndTime - new Date().getTime();
            
            const activeText = {
                pt: 'ATIVO',
                en: 'ACTIVE',
                es: 'ACTIVO'
            };
            
            countdownDiv.innerHTML = `<span class="detail-active-badge" data-translate="active-now">${activeText[lang]}</span><span class="detail-time-remaining">${formatDetailCountdown(timeRemaining)}</span>`;
        } else {
            countdownDiv.textContent = formatDetailCountdown(event.timeUntil);
        }
        
        const durationDiv = document.createElement('div');
        durationDiv.className = 'detail-timer-duration';
        durationDiv.textContent = `${event.duration}min`;
        
        card.appendChild(timeDiv);
        card.appendChild(countdownDiv);
        card.appendChild(durationDiv);
        
        timeline.appendChild(card);
    });
    
    widget.appendChild(timeline);
    
    return widget;
}

// Update countdowns
function updateDetailCountdowns(timestamp) {
    if (!detailEventData) {
        detailAnimationFrameId = requestAnimationFrame(updateDetailCountdowns);
        return;
    }
    
    if (timestamp - detailLastUpdateTime < 1000) {
        detailAnimationFrameId = requestAnimationFrame(updateDetailCountdowns);
        return;
    }
    
    detailLastUpdateTime = timestamp;
    const now = new Date().getTime();
    
    const cards = document.querySelectorAll('.detail-timer-card');
    
    cards.forEach(card => {
        const eventTime = parseInt(card.dataset.eventTime);
        const duration = parseInt(card.dataset.duration);
        if (!eventTime) return;
        
        const timeUntil = eventTime - now;
        const timeSinceStart = now - eventTime;
        const isActive = timeSinceStart >= 0 && timeSinceStart <= (duration * 60 * 1000);
        
        const countdown = card.querySelector('.detail-timer-countdown');
        if (!countdown) return;
        
        if (isActive) {
            const eventEndTime = eventTime + (duration * 60 * 1000);
            const timeRemaining = eventEndTime - now;
            
            if (timeRemaining > 0) {
                const lang = localStorage.getItem('selectedLanguage') || 'pt';
                const activeText = {
                    pt: 'ATIVO',
                    en: 'ACTIVE',
                    es: 'ACTIVO'
                };
                
                countdown.innerHTML = `<span class="detail-active-badge" data-translate="active-now">${activeText[lang]}</span><span class="detail-time-remaining">${formatDetailCountdown(timeRemaining)}</span>`;
                card.classList.add('detail-active');
            } else {
                // Event ended, need to re-render
                renderDetailTimer();
                return;
            }
        } else if (timeUntil > 0) {
            countdown.textContent = formatDetailCountdown(timeUntil);
            card.classList.remove('detail-active');
            
            const minutes = timeUntil / (1000 * 60);
            card.classList.remove('detail-imminent', 'detail-soon');
            if (minutes <= 15) {
                card.classList.add('detail-imminent');
            } else if (minutes <= 30) {
                card.classList.add('detail-soon');
            }
        }
    });
    
    detailAnimationFrameId = requestAnimationFrame(updateDetailCountdowns);
}

// Render timer
function renderDetailTimer() {
    const eventKey = getEventKeyFromPage();
    const pageId = document.body.dataset.pageId;
    
    if (!eventKey || !detailEventData) {
        return;
    }
    
    const eventConfig = detailEventData.events[eventKey];
    if (!eventConfig) {
        return;
    }
    
    const events = calculateDetailUpcomingEvents(eventConfig, 8);
    
    if (events.length === 0) {
        return;
    }
    
    // Remove existing widget
    const existingWidget = document.querySelector('.detail-timer-widget');
    if (existingWidget) {
        existingWidget.remove();
    }
    
    // Create and insert new widget after header
    const widget = createTimerWidget(events, eventConfig.name);
    const container = document.querySelector('.menu-container');
    const header = document.querySelector('.detail-page-header');
    
    if (container && header) {
        header.insertAdjacentElement('afterend', widget);
        console.log('[Timer Debug] Widget inserted!');
        
        // Apply translations if language system is loaded
        const lang = localStorage.getItem('selectedLanguage') || 'pt';
        if (typeof changeLanguage === 'function') {
            changeLanguage(lang);
        }
    } else {
        console.log('[Timer Debug] Missing container or header');
    }
    
    // Start updates
    if (detailAnimationFrameId) {
        cancelAnimationFrame(detailAnimationFrameId);
    }
    detailLastUpdateTime = 0;
    detailAnimationFrameId = requestAnimationFrame(updateDetailCountdowns);
}

// Load data
async function loadDetailEventData() {
    try {
        const response = await fetch('../gw2-timer-raw.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        detailEventData = await response.json();
        renderDetailTimer();
    } catch (error) {
        console.error('[Detail Timer] Error loading event data:', error);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for language.js to load
        setTimeout(loadDetailEventData, 100);
    });
} else {
    setTimeout(loadDetailEventData, 100);
}

// Re-render on language change
document.addEventListener('languageChanged', renderDetailTimer);
