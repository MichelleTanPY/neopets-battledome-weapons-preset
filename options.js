// Save settings when the "Save" button is clicked
document.getElementById('equipment').addEventListener('click', () => {
    // Determine which preset is currently active
    const activePreset = document.querySelector('.tab.active');
    let ability, equipment1, equipment2, skipReplay, collectRewards;

    if (activePreset.id === 'preset1') {
        ability = document.getElementById('ability1').value;
        equipment1 = document.getElementById('equipment1').value;
        equipment2 = document.getElementById('equipment2').value;
        skipReplay = document.getElementById('skipReplay1').checked;
        collectRewards = document.getElementById('collectRewards1').checked;

        // Save the settings for Preset 1
        chrome.storage.sync.set({
            ability1: ability,
            equipment1: equipment1,
            equipment2: equipment2,
            skipReplay1: skipReplay,
            collectRewards1: collectRewards
        });

    } else if (activePreset.id === 'preset2') {
        ability = document.getElementById('ability2').value;
        equipment1 = document.getElementById('equipment1b').value;
        equipment2 = document.getElementById('equipment2b').value;
        skipReplay = document.getElementById('skipReplay2').checked;
        collectRewards = document.getElementById('collectRewards2').checked;

        // Save the settings for Preset 2
        chrome.storage.sync.set({
            ability2: ability,
            equipment1b: equipment1,
            equipment2b: equipment2,
            skipReplay2: skipReplay,
            collectRewards2: collectRewards
        });
    }

    // Grey out the inputs and the save button
    disableInputs();

    // Update the label to show "Settings Saved!"
    const statusLabel = document.getElementById('statusLabel');
    statusLabel.textContent = 'Settings Saved!';
    statusLabel.classList.add('show'); // Add the show class to fade in the label

    setTimeout(() => {
        // Only hide if it's currently showing
        if (statusLabel.classList.contains('show')) {
            statusLabel.classList.replace('show', 'hide'); // Replace show with hide to fade out
        }
    }, 2000); // Keep the label visible for 2 seconds
    
    // Re-enable the inputs after a delay if needed
    setTimeout(() => {
        enableInputs();
        // Clear the "Settings Saved!" message after a few seconds
        if (statusLabel.classList.contains('hide')) {
            statusLabel.classList.remove('hide'); // Remove hide class
        }
        statusLabel.textContent = ''; // Clear the message
    }, 3000); // 3-second delay before re-enabling the fields and button
});

// Load settings when the options page is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['ability1', 'equipment1', 'equipment2', 'skipReplay1', 'collectRewards1',
                             'ability2', 'equipment1b', 'equipment2b', 'skipReplay2', 'collectRewards2'], (data) => {
        // Load data into Preset 1 inputs
        document.getElementById('ability1').value = data.ability1 || '';
        document.getElementById('equipment1').value = data.equipment1 || '';
        document.getElementById('equipment2').value = data.equipment2 || '';
        document.getElementById('skipReplay1').checked = data.skipReplay1 || false;
        document.getElementById('collectRewards1').checked = data.collectRewards1 || false;

        // Load data into Preset 2 inputs
        document.getElementById('ability2').value = data.ability2 || '';
        document.getElementById('equipment1b').value = data.equipment1b || '';
        document.getElementById('equipment2b').value = data.equipment2b || '';
        document.getElementById('skipReplay2').checked = data.skipReplay2 || false;
        document.getElementById('collectRewards2').checked = data.collectRewards2 || false;
    });
});

// Function to disable inputs
function disableInputs() {
    document.querySelectorAll('#preset1 input, #preset2 input').forEach(input => {
        input.disabled = true;
    });
    document.getElementById('equipment').disabled = true;
}

// Function to enable inputs
function enableInputs() {
    document.querySelectorAll('#preset1 input, #preset2 input').forEach(input => {
        input.disabled = false;
    });
    document.getElementById('equipment').disabled = false;
}

// Handle tab switching
document.getElementById('preset1Tab').addEventListener('click', function() {
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');

    // Check if already active to avoid unnecessary class toggling
    if (!preset1.classList.contains('active')) {
        preset1.classList.add('active');
        preset2.classList.remove('active');
        this.classList.add('active');
        document.getElementById('preset2Tab').classList.remove('active');

        // Optional: Add animation effect when showing the tab
        preset1.style.opacity = 0; // Start hidden
        setTimeout(() => {
            preset1.style.opacity = 1; // Fade in
        }, 0);
    }
});

document.getElementById('preset2Tab').addEventListener('click', function() {
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');

    // Check if already active to avoid unnecessary class toggling
    if (!preset2.classList.contains('active')) {
        preset2.classList.add('active');
        preset1.classList.remove('active');
        this.classList.add('active');
        document.getElementById('preset1Tab').classList.remove('active');

        // Optional: Add animation effect when showing the tab
        preset2.style.opacity = 0; // Start hidden
        setTimeout(() => {
            preset2.style.opacity = 1; // Fade in
        }, 0);
    }
});

// Handle tab switching
document.getElementById('preset1Tab').addEventListener('click', function() {
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');
    
    // Check if already active to avoid unnecessary class toggling
    if (!preset1.classList.contains('active')) {
        preset1.classList.add('active');
        preset2.classList.remove('active');
        this.classList.add('active');
        document.getElementById('preset2Tab').classList.remove('active');

        // Optional: Add animation effect when showing the tab
        preset1.style.opacity = 0; // Start hidden
        setTimeout(() => {
            preset1.style.opacity = 1; // Fade in
        }, 0);
    }
});

document.getElementById('preset2Tab').addEventListener('click', function() {
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');
    
    // Check if already active to avoid unnecessary class toggling
    if (!preset2.classList.contains('active')) {
        preset2.classList.add('active');
        preset1.classList.remove('active');
        this.classList.add('active');
        document.getElementById('preset1Tab').classList.remove('active');

        // Optional: Add animation effect when showing the tab
        preset2.style.opacity = 0; // Start hidden
        setTimeout(() => {
            preset2.style.opacity = 1; // Fade in
        }, 0);
    }
});