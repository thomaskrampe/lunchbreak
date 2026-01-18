let countdownInterval;
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const inputControls = document.getElementById('input-controls'); 
const resetButton = document.getElementById('reset-button');   
const countdownTitle = document.getElementById('countdown-title'); // NEU: Referenz auf die Überschrift
const titleSelect = document.getElementById('title-select');       // NEU: Referenz auf das Dropdown

// ---------------------------------------------
// NEUE FUNKTION: Aktualisiert die Überschrift
// ---------------------------------------------
function updateTitle() {
    const selectedTitle = titleSelect.options[titleSelect.selectedIndex].value;
    // Fügt das Icon und den ausgewählten Titel in die H1-Überschrift ein
    countdownTitle.textContent = `🕙 ${selectedTitle}`; 
}

/**
 * Startet den Countdown basierend auf einer Ziel-Unix-Zeit.
 * @param {number} targetTimeMs Die Zielzeit in Millisekunden (Unix-Zeit).
 */
function startCountdown(targetTimeMs) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Formular ausblenden und Reset-Button anzeigen
    inputControls.style.display = 'none';
    resetButton.style.display = 'block';

    messageDisplay.textContent = 'Countdown läuft...';

    // NEU: Titel im laufenden Modus fixieren
    updateTitle(); 

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTimeMs - now;

        // Wenn der Countdown abgelaufen ist
        if (distance < 0) {
            clearInterval(countdownInterval);
            timerDisplay.textContent = "00:00:00";
            messageDisplay.textContent = `Zeit für ${countdownTitle.textContent.replace('⏰ ', '')} ist abgelaufen!`;
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        timerDisplay.textContent = display;

    }, 1000);
}

// Funktion: App zurücksetzen
function resetApp() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Formular wieder anzeigen und Reset-Button ausblenden
    inputControls.style.display = 'block';
    resetButton.style.display = 'none';

    // Anzeige zurücksetzen
    timerDisplay.textContent = '00:00:00';
    messageDisplay.textContent = 'Wähle einen Titel und eine Zeit.';
    
    // NEU: Setzt das Dropdown und die Überschrift zurück
    titleSelect.selectedIndex = 0; 
    updateTitle(); 

    document.getElementById('minutes').value = '';
    document.getElementById('target-time').value = '';
}

// Initialer Aufruf, um den Standardtitel beim Laden zu setzen
document.addEventListener('DOMContentLoaded', updateTitle);


// --- Vorhandene Start-Funktionen (bleiben gleich) ---

function startCountdownByMinutes() {
    const minutesInput = document.getElementById('minutes').value;
    const minutes = parseInt(minutesInput, 10);

    if (isNaN(minutes) || minutes <= 0) {
        alert("Bitte eine gültige positive Minutenzahl eingeben.");
        return;
    }

    const targetTimeMs = new Date().getTime() + (minutes * 60 * 1000);
    startCountdown(targetTimeMs);
    messageDisplay.textContent = `Countdown für ${minutes} Minute(n) läuft...`;
}

function startCountdownByTime() {
    const targetTimeInput = document.getElementById('target-time').value;

    if (!targetTimeInput) {
        alert("Bitte eine Ziel-Uhrzeit eingeben.");
        return;
    }

    const [hours, minutes] = targetTimeInput.split(':').map(Number);
    let targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    let targetTimeMs = targetDate.getTime();
    const now = new Date().getTime();

    if (targetTimeMs <= now) {
        targetDate.setDate(targetDate.getDate() + 1);
        targetTimeMs = targetDate.getTime();
    }
    
    startCountdown(targetTimeMs);
    messageDisplay.textContent = `Es geht um ${targetTimeInput} Uhr weiter...`;
}