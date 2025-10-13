// Meta Events Data - GW2 Wiki Event Timer Style
// All times are in UTC

const metaEventCategories = [
    {
        id: 'core-tyria',
        name: {
            pt: 'Core Tyria',
            en: 'Core Tyria',
            es: 'Core Tyria'
        },
        events: [
            {
                name: 'Admiral Taidha Covington',
                location: {
                    pt: 'Bloodtide Coast',
                    en: 'Bloodtide Coast',
                    es: 'Costa de Marea Sangrienta'
                },
                waypoint: '[&BPABAAA=]',
                times: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
            },
            {
                name: 'Svanir Shaman Chief',
                location: {
                    pt: 'Wayfarer Foothills',
                    en: 'Wayfarer Foothills',
                    es: 'Estribaciones del Caminante'
                },
                waypoint: '[&BMIDAAA=]',
                times: ['00:15', '02:15', '04:15', '06:15', '08:15', '10:15', '12:15', '14:15', '16:15', '18:15', '20:15', '22:15']
            },
            {
                name: 'Megadestroyer',
                waypoint: '[&BKoBAAA=]',
                location: {
                    pt: 'Mount Maelstrom',
                    en: 'Mount Maelstrom',
                    es: 'Monte Vorágine'
                },
                times: ['00:30', '03:30', '06:30', '09:30', '12:30', '15:30', '18:30', '21:30']
            },
            {
                name: 'Great Jungle Wurm',
                waypoint: '[&BPwCAAA=]',
                location: {
                    pt: 'Caledon Forest',
                    en: 'Caledon Forest',
                    es: 'Bosque de Caledon'
                },
                times: ['00:15', '02:15', '04:15', '06:15', '08:15', '10:15', '12:15', '14:15', '16:15', '18:15', '20:15', '22:15']
            },
            {
                name: 'Modniir Ulgoth',
                waypoint: '[&BPcBAAA=]',
                location: {
                    pt: 'Harathi Hinterlands',
                    en: 'Harathi Hinterlands',
                    es: 'Tierras Agrestes de Harathi'
                },
                times: ['00:30', '02:30', '04:30', '06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30', '22:30']
            },
            {
                name: 'Shadow Behemoth',
                waypoint: '[&BE4DAAA=]',
                location: {
                    pt: 'Queensdale',
                    en: 'Queensdale',
                    es: 'Queensdale'
                },
                times: ['00:15', '02:15', '04:15', '06:15', '08:15', '10:15', '12:15', '14:15', '16:15', '18:15', '20:15', '22:15']
            },
            {
                name: 'Fire Elemental',
                waypoint: '[&BN4EAAA=]',
                location: {
                    pt: 'Metrica Province',
                    en: 'Metrica Province',
                    es: 'Provincia de Metrica'
                },
                times: ['00:45', '02:45', '04:45', '06:45', '08:45', '10:45', '12:45', '14:45', '16:45', '18:45', '20:45', '22:45']
            },
            {
                name: 'The Shatterer',
                waypoint: '[&BN0AAAA=]',
                location: {
                    pt: 'Blazeridge Steppes',
                    en: 'Blazeridge Steppes',
                    es: 'Estepas de Filocandente'
                },
                times: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
            },
            {
                name: 'Tequatl the Sunless',
                waypoint: '[&BNABAAA=]',
                location: {
                    pt: 'Sparkfly Fen',
                    en: 'Sparkfly Fen',
                    es: 'Pantano de Moscabrillante'
                },
                times: ['00:00', '03:00', '07:00', '11:30', '16:00', '19:00']
            },
            {
                name: 'Karka Queen',
                waypoint: '[&BN4GAAA=]',
                location: {
                    pt: 'Southsun Cove',
                    en: 'Southsun Cove',
                    es: 'Cala de Southsun'
                },
                times: ['02:00', '06:00', '10:30', '14:30', '18:30', '23:00']
            },
            {
                name: 'Triple Trouble',
                waypoint: '[&BKoBAAA=]',
                location: {
                    pt: 'Bloodtide Coast',
                    en: 'Bloodtide Coast',
                    es: 'Costa de Marea Sangrienta'
                },
                times: ['01:00', '04:00', '08:00', '13:00', '17:00', '20:00']
            },
            {
                name: 'Claw of Jormag',
                waypoint: '[&BPULAAA=]',
                location: {
                    pt: 'Frostgorge Sound',
                    en: 'Frostgorge Sound',
                    es: 'Ensenada Escarchada'
                },
                times: ['00:30', '03:30', '06:30', '09:30', '12:30', '15:30', '18:30', '21:30']
            }
        ]
    },
    {
        id: 'heart-of-thorns',
        name: {
            pt: 'Heart of Thorns',
            en: 'Heart of Thorns',
            es: 'Heart of Thorns'
        },
        events: [
            {
                name: 'Night Bosses - Verdant Brink',
                waypoint: '[&BOAHAAA=]',
                location: {
                    pt: 'Verdant Brink',
                    en: 'Verdant Brink',
                    es: 'Linde Verdant'
                },
                times: ['01:30', '03:30', '05:30', '07:30', '09:30', '11:30', '13:30', '15:30', '17:30', '19:30', '21:30', '23:30']
            },
            {
                name: 'Battle in Auric Basin',
                waypoint: '[&BPUHAAA=]',
                location: {
                    pt: 'Auric Basin',
                    en: 'Auric Basin',
                    es: 'Cuenca Áurea'
                },
                times: ['00:45', '02:45', '04:45', '06:45', '08:45', '10:45', '12:45', '14:45', '16:45', '18:45', '20:45', '22:45']
            },
            {
                name: 'Preparing Tangled Depths',
                waypoint: '[&BAIHAAA=]',
                location: {
                    pt: 'Tangled Depths',
                    en: 'Tangled Depths',
                    es: 'Profundidades Enredadas'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: "Dragon's Stand",
                waypoint: '[&BBAIAAA=]',
                location: {
                    pt: "Dragon's Stand",
                    en: "Dragon's Stand",
                    es: 'Bastión del Dragón'
                },
                times: ['01:30', '03:30', '05:30', '07:30', '09:30', '11:30', '13:30', '15:30', '17:30', '19:30', '21:30', '23:30']
            }
        ]
    },
    {
        id: 'path-of-fire',
        name: {
            pt: 'Path of Fire',
            en: 'Path of Fire',
            es: 'Path of Fire'
        },
        events: [
            {
                name: 'Casino Blitz',
                waypoint: '[&BLsKAAA=]',
                location: {
                    pt: 'The Crystal Oasis',
                    en: 'The Crystal Oasis',
                    es: 'El Oasis de Cristal'
                },
                times: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
            },
            {
                name: {
                    pt: 'Ira da Serpente',
                    en: 'Serpent\'s Ire',
                    es: 'Ira de la Serpiente'
                },
                location: {
                    pt: 'Domain of Vabbi',
                    en: 'Domain of Vabbi',
                    es: 'Dominio de Vabbi'
                },
                times: ['00:30', '02:30', '04:30', '06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30', '22:30']
            },
            {
                name: 'Maw of Torment',
                waypoint: '[&BHwLAAA=]',
                location: {
                    pt: 'Domain of Istan',
                    en: 'Domain of Istan',
                    es: 'Dominio de Istan'
                },
                times: ['01:05', '03:05', '05:05', '07:05', '09:05', '11:05', '13:05', '15:05', '17:05', '19:05', '21:05', '23:05']
            }
        ]
    },
    {
        id: 'living-world-s4',
        name: {
            pt: 'Living World Season 4',
            en: 'Living World Season 4',
            es: 'Living World Season 4'
        },
        events: [
            {
                name: 'Palawadan, Jewel of Istan',
                waypoint: '[&BHwLAAA=]',
                location: {
                    pt: 'Domain of Istan',
                    en: 'Domain of Istan',
                    es: 'Dominio de Istan'
                },
                times: ['00:45', '02:45', '04:45', '06:45', '08:45', '10:45', '12:45', '14:45', '16:45', '18:45', '20:45', '22:45']
            },
            {
                name: 'Death-Branded Shatterer',
                waypoint: '[&BKYLAAA=]',
                location: {
                    pt: 'Jahai Bluffs',
                    en: 'Jahai Bluffs',
                    es: 'Acantilados de Jahai'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Thunderhead Keep',
                waypoint: '[&BPoLAAA=]',
                location: {
                    pt: 'Thunderhead Peaks',
                    en: 'Thunderhead Peaks',
                    es: 'Picos Cabeza de Trueno'
                },
                times: ['00:45', '02:00', '03:45', '05:00', '06:45', '08:00', '09:45', '11:00', '12:45', '14:00', '15:45', '17:00', '18:45', '20:00', '21:45', '23:00']
            },
            {
                name: 'The Oil Floes',
                waypoint: '[&BKQLAAA=]',
                location: {
                    pt: 'Sandswept Isles',
                    en: 'Sandswept Isles',
                    es: 'Islas Barridas por la Arena'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Dragonfall',
                waypoint: '[&BIMMAAA=]',
                location: {
                    pt: 'Dragonfall',
                    en: 'Dragonfall',
                    es: 'Caída del Dragón'
                },
                times: ['01:30', '03:30', '05:30', '07:30', '09:30', '11:30', '13:30', '15:30', '17:30', '19:30', '21:30', '23:30']
            }
        ]
    },
    {
        id: 'icebrood-saga',
        name: {
            pt: 'The Icebrood Saga',
            en: 'The Icebrood Saga',
            es: 'The Icebrood Saga'
        },
        events: [
            {
                name: 'Drakkar',
                waypoint: '[&BDkMAAA=]',
                location: {
                    pt: 'Bjora Marches',
                    en: 'Bjora Marches',
                    es: 'Marchas de Bjora'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Storms of Winter',
                waypoint: '[&BDkMAAA=]',
                location: {
                    pt: 'Bjora Marches',
                    en: 'Bjora Marches',
                    es: 'Marchas de Bjora'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Leyline Anomaly',
                waypoint: '[&BAwMAAA=]',
                location: {
                    pt: 'Grothmar Valley',
                    en: 'Grothmar Valley',
                    es: 'Valle de Grothmar'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            }
        ]
    },
    {
        id: 'end-of-dragons',
        name: {
            pt: 'End of Dragons',
            en: 'End of Dragons',
            es: 'End of Dragons'
        },
        events: [
            {
                name: 'Battle for the Jade Sea',
                waypoint: '[&BJINAAA=]',
                location: {
                    pt: 'New Kaineng City',
                    en: 'New Kaineng City',
                    es: 'Nueva Ciudad de Kaineng'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Gang War',
                waypoint: '[&BFsNAAA=]',
                location: {
                    pt: 'New Kaineng City',
                    en: 'New Kaineng City',
                    es: 'Nueva Ciudad de Kaineng'
                },
                times: ['00:30', '02:30', '04:30', '06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30', '22:30']
            },
            {
                name: 'Void Surge',
                waypoint: null,
                location: {
                    pt: 'Multiple Maps',
                    en: 'Multiple Maps',
                    es: 'Múltiples Mapas'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: "Battle for Dragon's End",
                waypoint: '[&BFYNAAA=]',
                location: {
                    pt: "Dragon's End",
                    en: "Dragon's End",
                    es: 'Fin del Dragón'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Akanon, Voidbringer',
                waypoint: '[&BO0NAAA=]',
                location: {
                    pt: 'The Echovald Wilds',
                    en: 'The Echovald Wilds',
                    es: 'Las Tierras Salvajes de Echovald'
                },
                times: ['00:30', '02:30', '04:30', '06:30', '08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30', '22:30']
            },
            {
                name: 'Gyala Delve',
                waypoint: '[&BH4NAAA=]',
                location: {
                    pt: 'Gyala Delve',
                    en: 'Gyala Delve',
                    es: 'Excavación de Gyala'
                },
                times: ['00:30', '01:30', '02:30', '03:30', '04:30', '05:30', '06:30', '07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30', '23:30']
            }
        ]
    },
    {
        id: 'secrets-of-the-obscure',
        name: {
            pt: 'Secrets of the Obscure',
            en: 'Secrets of the Obscure',
            es: 'Secrets of the Obscure'
        },
        events: [
            {
                name: 'Convergence',
                waypoint: '[&BKQOAAA=]',
                location: {
                    pt: 'Skywatch Archipelago',
                    en: 'Skywatch Archipelago',
                    es: 'Archipiélago Vigía del Cielo'
                },
                times: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
            },
            {
                name: 'Rift Hunts',
                waypoint: null,
                location: {
                    pt: 'Multiple Maps',
                    en: 'Multiple Maps',
                    es: 'Múltiples Mapas'
                },
                times: ['Every 5 minutes']
            }
        ]
    }
];

// Função para parsear tempo no formato HH:MM
function parseTime(timeStr) {
    if (timeStr === 'Every 5 minutes') return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
}

// Função para calcular o próximo horário
function getNextTime(times) {
    if (!times || times.length === 0 || times[0] === 'Every 5 minutes') {
        return { nextTime: 'Ongoing', countdown: 'Always active' };
    }
    
    const now = new Date();
    const currentUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
                                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    
    let nextEventTime = null;
    let nextTimeStr = '';
    
    for (const timeStr of times) {
        const time = parseTime(timeStr);
        if (!time) continue;
        
        let eventTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
                                 time.hours, time.minutes, 0);
        
        // Se o evento já passou hoje, verificar amanhã
        if (eventTime <= currentUTC) {
            eventTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 
                                time.hours, time.minutes, 0);
        }
        
        if (nextEventTime === null || eventTime < nextEventTime) {
            nextEventTime = eventTime;
            nextTimeStr = timeStr;
        }
    }
    
    const timeUntil = nextEventTime - currentUTC;
    const countdown = formatCountdown(timeUntil);
    
    return { nextTime: nextTimeStr, countdown, millisUntil: timeUntil };
}

// Função para formatar countdown
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

// Função para copiar waypoint para a área de transferência
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
    
    navigator.clipboard.writeText(waypoint).then(() => {
        showCopyMessage(`Waypoint copied: ${waypoint}`, true);
    }).catch(err => {
        console.error('Failed to copy waypoint:', err);
        const lang = localStorage.getItem('selectedLanguage') || 'pt';
        const messages = {
            pt: 'Falha ao copiar waypoint',
            en: 'Failed to copy waypoint',
            es: 'Error al copiar waypoint'
        };
        showCopyMessage(messages[lang], false);
    });
}

// Função para mostrar mensagem de cópia
function showCopyMessage(message, success) {
    // Remover mensagem anterior se existir
    const existingMsg = document.querySelector('.copy-notification');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Criar nova mensagem
    const notification = document.createElement('div');
    notification.className = 'copy-notification ' + (success ? 'success' : 'error');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Função para criar a tabela de uma categoria
function createCategoryTable(category, lang) {
    const section = document.createElement('div');
    section.className = 'event-category-section';
    
    const title = document.createElement('h2');
    title.className = 'event-category-title';
    title.textContent = category.name[lang];
    section.appendChild(title);
    
    const table = document.createElement('table');
    table.className = 'event-timer-table';
    
    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerTexts = {
        pt: {
            event: 'Evento',
            location: 'Localização (clique para copiar waypoint)',
            next: 'Próximo',
            in: 'Em'
        },
        en: {
            event: 'Event',
            location: 'Location (click to copy waypoint)',
            next: 'Next',
            in: 'In'
        },
        es: {
            event: 'Evento',
            location: 'Ubicación (haga clic para copiar waypoint)',
            next: 'Próximo',
            in: 'En'
        }
    };
    
    thead.innerHTML = `
        <tr>
            <th class="event-name-col">${headerTexts[lang].event}</th>
            <th class="event-location-col">${headerTexts[lang].location}</th>
            <th class="event-next-col">${headerTexts[lang].next}</th>
            <th class="event-countdown-col">${headerTexts[lang].in}</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    
    category.events.forEach(event => {
        const { nextTime, countdown, millisUntil } = getNextTime(event.times);
        
        const row = document.createElement('tr');
        row.className = 'event-timer-row';
        row.dataset.eventTimes = JSON.stringify(event.times);
        
        // Adicionar classe de urgência baseado no tempo
        if (millisUntil) {
            const minutes = millisUntil / (1000 * 60);
            if (minutes <= 15) {
                row.classList.add('event-imminent');
            } else if (minutes <= 30) {
                row.classList.add('event-soon');
            }
        }
        
        // Nome do evento (sempre em inglês)
        const nameCell = document.createElement('td');
        nameCell.className = 'event-name';
        nameCell.textContent = event.name;
        
        // Criar célula de localização clicável
        const locationCell = document.createElement('td');
        locationCell.className = 'event-location';
        if (event.waypoint) {
            locationCell.classList.add('has-waypoint');
            const tooltipTexts = {
                pt: 'Clique para copiar waypoint',
                en: 'Click to copy waypoint',
                es: 'Haga clic para copiar waypoint'
            };
            locationCell.title = tooltipTexts[lang];
            locationCell.style.cursor = 'pointer';
            locationCell.onclick = () => copyWaypoint(event.waypoint, event.name);
        }
        locationCell.textContent = event.location[lang];
        
        // Próximo horário
        const nextTimeCell = document.createElement('td');
        nextTimeCell.className = 'event-next-time';
        nextTimeCell.textContent = nextTime;
        
        // Countdown
        const countdownCell = document.createElement('td');
        countdownCell.className = 'event-countdown';
        countdownCell.textContent = countdown;
        
        row.appendChild(nameCell);
        row.appendChild(locationCell);
        row.appendChild(nextTimeCell);
        row.appendChild(countdownCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    section.appendChild(table);
    
    return section;
}

// Função para atualizar todos os countdowns
function updateAllCountdowns() {
    const rows = document.querySelectorAll('.event-timer-row');
    
    rows.forEach(row => {
        const times = JSON.parse(row.dataset.eventTimes);
        const { nextTime, countdown, millisUntil } = getNextTime(times);
        
        const nextTimeCell = row.querySelector('.event-next-time');
        const countdownCell = row.querySelector('.event-countdown');
        
        if (nextTimeCell && countdownCell) {
            nextTimeCell.textContent = nextTime;
            countdownCell.textContent = countdown;
        }
        
        // Atualizar classes de urgência
        row.classList.remove('event-imminent', 'event-soon');
        if (millisUntil) {
            const minutes = millisUntil / (1000 * 60);
            if (minutes <= 15) {
                row.classList.add('event-imminent');
            } else if (minutes <= 30) {
                row.classList.add('event-soon');
            }
        }
    });
}

// Função para renderizar todas as categorias
function renderEventTimers() {
    const container = document.getElementById('eventTimersContainer');
    if (!container) return;
    
    const lang = localStorage.getItem('selectedLanguage') || 'pt';
    
    // Limpar container
    container.innerHTML = '';
    
    // Criar tabelas para cada categoria
    metaEventCategories.forEach(category => {
        const categoryTable = createCategoryTable(category, lang);
        container.appendChild(categoryTable);
    });
    
    // Iniciar atualização dos countdowns a cada segundo
    setInterval(updateAllCountdowns, 1000);
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEventTimers);
} else {
    renderEventTimers();
}

// Atualizar quando o idioma mudar
document.addEventListener('languageChanged', renderEventTimers);
