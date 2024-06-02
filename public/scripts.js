document.addEventListener('DOMContentLoaded', () => {
    const characterForm = document.getElementById('character-form');
    const inventoryInput = document.getElementById('inventory-item');
    const inventoryList = document.getElementById('inventory-list');
    const addInventoryButton = document.getElementById('add-inventory');
    const spellInput = document.getElementById('spell-item');
    const spellList = document.getElementById('spell-list');
    const addSpellButton = document.getElementById('add-spell');

    if (addInventoryButton) {
        addInventoryButton.addEventListener('click', () => {
            if (inventoryInput.value.trim() !== '') {
                const listItem = document.createElement('li');
                listItem.textContent = inventoryInput.value;
                inventoryList.appendChild(listItem);
                inventoryInput.value = '';
            }
        });
    }

    if (addSpellButton) {
        addSpellButton.addEventListener('click', () => {
            if (spellInput.value.trim() !== '') {
                const listItem = document.createElement('li');
                listItem.textContent = spellInput.value;
                spellList.appendChild(listItem);
                spellInput.value = '';
            }
        });
    }

    if (characterForm) {
        characterForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const inventoryItems = Array.from(inventoryList.children).map(item => item.textContent);
            const spellItems = Array.from(spellList.children).map(item => item.textContent);

            const formData = new FormData(characterForm);
            formData.append('inventory', JSON.stringify(inventoryItems));
            formData.append('spells', JSON.stringify(spellItems));

            const formDataObject = {};
            formData.forEach((value, key) => {
                if (key === 'stats') {
                    formDataObject[key] = JSON.parse(value);
                } else {
                    formDataObject[key] = value;
                }
            });

            try {
                const response = await fetch(characterForm.action, {
                    method: 'POST',
                    body: JSON.stringify(formDataObject),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Karakter oluşturulurken bir hata oluştu.');
                }

                alert('Karakter başarıyla oluşturuldu!');
                characterForm.reset();
                inventoryList.innerHTML = '';
                spellList.innerHTML = '';
            } catch (error) {
                console.error('Hata:', error);
                alert('Karakter oluşturulurken bir hata oluştu.');
            }
        });
    }
});
