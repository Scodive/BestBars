document.addEventListener('DOMContentLoaded', () => {
    const monthYearElement = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    const entryModal = document.getElementById('entry-modal');
    const detailsModal = document.getElementById('details-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    
    const modalDateElement = document.getElementById('modal-date');
    const modalImageUpload = document.getElementById('modal-image-upload');
    const modalImagePreview = document.getElementById('modal-image-preview');
    const modalBarNameInput = document.getElementById('modal-bar-name');
    const modalBarLocationInput = document.getElementById('modal-bar-location');
    const modalBarDescriptionInput = document.getElementById('modal-bar-description');
    const modalCocktailRecommendationInput = document.getElementById('modal-cocktail-recommendation');
    const saveEntryButton = document.getElementById('save-entry');

    const detailsModalDateElement = document.getElementById('details-modal-date');
    const detailsModalImage = document.getElementById('details-modal-image');
    const detailsModalBarName = document.getElementById('details-modal-bar-name');
    const detailsModalBarLocation = document.getElementById('details-modal-bar-location');
    const detailsModalBarDescription = document.getElementById('details-modal-bar-description');
    const detailsModalCocktailRecommendation = document.getElementById('details-modal-cocktail-recommendation');

    let currentDate = new Date();
    let currentEditingDate = null; // Stores YYYY-MM-DD of the day being edited

    // Load data from localStorage or initialize if not present
    let calendarData = JSON.parse(localStorage.getItem('calendarData')) || {};

    function saveCalendarData() {
        localStorage.setItem('calendarData', JSON.stringify(calendarData));
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        monthYearElement.textContent = `${year}年${month + 1}月`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adjust firstDayOfMonth to be Monday-first (0 for Monday, 6 for Sunday)
        const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        // Create empty cells for days before the first day of the month
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            const dayContent = document.createElement('div');
            dayContent.classList.add('day-content');
            
            const dateKey = dayCell.dataset.date;
            if (calendarData[dateKey]) {
                dayCell.classList.add('has-entry');
                const entry = calendarData[dateKey];

                if (entry.image) {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = entry.image;
                    thumbnail.classList.add('day-image-thumbnail');
                    dayContent.appendChild(thumbnail);
                }
                const summary = document.createElement('div');
                summary.classList.add('day-entry-summary');
                if (entry.barName) {
                    const barNameP = document.createElement('p');
                    barNameP.classList.add('entry-bar-name')
                    barNameP.textContent = entry.barName;
                    summary.appendChild(barNameP);
                }
                if (entry.barLocation) {
                     const barLocationP = document.createElement('p');
                     barLocationP.textContent = entry.barLocation;
                     summary.appendChild(barLocationP);
                }
                dayContent.appendChild(summary);

                // Hover effect for bar name and location
                const hoverInfo = document.createElement('div');
                hoverInfo.classList.add('bar-name-hover');
                hoverInfo.textContent = `${entry.barName || ''} - ${entry.barLocation || ''}`;
                if(entry.barName || entry.barLocation) {
                    dayCell.appendChild(hoverInfo);
                }
            }
            
            dayCell.appendChild(dayContent);
            dayCell.addEventListener('click', () => handleDayClick(dateKey));
            calendarGrid.appendChild(dayCell);
        }
    }

    function handleDayClick(dateKey) {
        currentEditingDate = dateKey;
        const [year, month, day] = dateKey.split('-');
        
        if (calendarData[dateKey]) {
            // Show details modal
            const entry = calendarData[dateKey];
            detailsModalDateElement.textContent = `${year}年${month}月${day}日`;
            detailsModalImage.src = entry.image || '#';
            detailsModalImage.style.display = entry.image ? 'block' : 'none';
            detailsModalBarName.textContent = entry.barName || '未提供';
            detailsModalBarLocation.textContent = entry.barLocation || '未提供';
            detailsModalBarDescription.textContent = entry.description || '未提供';
            detailsModalCocktailRecommendation.textContent = entry.cocktail || '未提供';
            detailsModal.style.display = 'block';
        } else {
            // Show entry modal for new entry
            modalDateElement.textContent = `${year}年${month}月${day}日`;
            modalImagePreview.style.display = 'none';
            modalImagePreview.src = '#';
            modalImageUpload.value = ''; // Clear previous file selection
            modalBarNameInput.value = '';
            modalBarLocationInput.value = '';
            modalBarDescriptionInput.value = '';
            modalCocktailRecommendationInput.value = '';
            entryModal.style.display = 'block';
        }
    }

    modalImageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                modalImagePreview.src = e.target.result;
                modalImagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    saveEntryButton.addEventListener('click', () => {
        if (!currentEditingDate) return;

        const entryData = {
            image: modalImagePreview.src.startsWith('data:image') ? modalImagePreview.src : (calendarData[currentEditingDate]?.image || null) ,
            barName: modalBarNameInput.value.trim(),
            barLocation: modalBarLocationInput.value.trim(),
            description: modalBarDescriptionInput.value.trim(),
            cocktail: modalCocktailRecommendationInput.value.trim(),
        };

        if (entryData.barName || entryData.barLocation || entryData.description || entryData.cocktail || entryData.image) {
            calendarData[currentEditingDate] = entryData;
        } else {
            // If all fields are empty and no new image, consider deleting the entry
             if (calendarData[currentEditingDate] && !entryData.image) { // only delete if no new image either
                delete calendarData[currentEditingDate];
             }
        }
        
        saveCalendarData();
        renderCalendar();
        entryModal.style.display = 'none';
        currentEditingDate = null;
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            entryModal.style.display = 'none';
            detailsModal.style.display = 'none';
            currentEditingDate = null; // Reset editing date when closing modal
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === entryModal) {
            entryModal.style.display = 'none';
            currentEditingDate = null;
        }
        if (event.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
}); 