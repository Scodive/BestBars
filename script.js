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
    const modalImageCountIndicator = document.getElementById('modal-image-count-indicator');
    const modalBarNameInput = document.getElementById('modal-bar-name');
    const modalBarLocationInput = document.getElementById('modal-bar-location');
    const modalBarDescriptionInput = document.getElementById('modal-bar-description');
    const modalCocktailRecommendationInput = document.getElementById('modal-cocktail-recommendation');
    const saveEntryButton = document.getElementById('save-entry');

    const detailsModalDateElement = document.getElementById('details-modal-date');
    const detailsModalImagesContainer = document.getElementById('details-modal-images-container');
    const detailsModalBarName = document.getElementById('details-modal-bar-name');
    const detailsModalBarLocation = document.getElementById('details-modal-bar-location');
    const detailsModalBarDescription = document.getElementById('details-modal-bar-description');
    const detailsModalCocktailRecommendation = document.getElementById('details-modal-cocktail-recommendation');
    const deleteEntryButton = document.getElementById('delete-entry-button');
    const clearAllButton = document.getElementById('clear-all-button');
    const toggleBackgroundButton = document.getElementById('toggle-background-button');

    const navCalendarButton = document.getElementById('nav-calendar');
    const navTop50Button = document.getElementById('nav-top50');
    const calendarPage = document.getElementById('calendar-page');
    const top50Page = document.getElementById('top50-page');

    const top50ListContainer = document.getElementById('top50-list-container');
    const top50CheckedCountElement = document.getElementById('top50-checked-count');
    const top50RemainingCountElement = document.getElementById('top50-remaining-count');
    const generateShareButton = document.getElementById('generate-share-button');
    const shareCardModal = document.getElementById('share-card-modal');
    const shareCardBarsGrid = document.getElementById('share-card-bars-grid');
    const shareCardRenderArea = document.getElementById('share-card-render-area');
    const downloadShareCardButton = document.getElementById('download-share-card');
    const mapContainer = document.getElementById('top50-map-container');
    let top50Map = null; // To store the Leaflet map instance

    let currentDate = new Date();
    let currentEditingDate = null; // Stores YYYY-MM-DD of the day being edited
    let tempUploadedImages = []; // 用于暂存新上传的图片 base64 数据
    const backgroundStyles = ['bg-style-default', 'bg-style-light', 'bg-style-gold-accent', 'bg-style-deep-ocean'];
    let currentBackgroundIndex = 0;

    // Load data from localStorage or initialize if not present
    let calendarData = JSON.parse(localStorage.getItem('calendarData')) || {};

    // Asia Top 50 Bars Data (Manually extracted and structured)
    const asiaTop50Bars = [
        { id: "sgp_barleone", name: "Bar Leone", city: "香港", country: "中国", lat: 22.2835, lng: 114.1505, checked: false },
        { id: "kor_zest", name: "Zest", city: "首尔", country: "韩国", lat: 37.5247, lng: 126.9252, checked: false },
        { id: "sgp_jiggerpony", name: "Jigger & Pony", city: "新加坡", country: "新加坡", lat: 1.2922, lng: 103.8514, checked: false },
        { id: "hkg_coa", name: "Coa", city: "香港", country: "中国", lat: 22.2842, lng: 114.1512, checked: false },
        { id: "jpn_barbenfiddich", name: "Bar Benfiddich", city: "东京", country: "日本", lat: 35.6900, lng: 139.7000, checked: false },
        { id: "sgp_nutmegclove", name: "Nutmeg & Clove", city: "新加坡", country: "新加坡", lat: 1.2836, lng: 103.8451, checked: false },
        { id: "tha_bkksocial", name: "BKK Social Club", city: "曼谷", country: "泰国", lat: 13.7308, lng: 100.5687, checked: false },
        { id: "mys_penrose", name: "Penrose", city: "吉隆坡", country: "马来西亚", lat: 3.1578, lng: 101.7119, checked: false },
        { id: "hkg_argo", name: "Argo", city: "香港", country: "中国", lat: 22.2818, lng: 114.1588, checked: false },
        { id: "hkg_theaubrey", name: "The Aubrey", city: "香港", country: "中国", lat: 22.2798, lng: 114.1585, checked: false },
        { id: "jpn_virtu", name: "Virtù", city: "东京", country: "日本", lat: 35.6740, lng: 139.7650, checked: false },
        { id: "idn_thecocktailclub", name: "The Cocktail Club", city: "雅加达", country: "印度尼西亚", lat: -6.2245, lng: 106.8093, checked: false },
        { id: "tha_vesper", name: "Vesper", city: "曼谷", country: "泰国", lat: 13.7275, lng: 100.5354, checked: false },
        { id: "chn_hopeandseasame", name: "庙前冰室 Hope & Seasame", city: "广州", country: "中国", lat: 23.1291, lng: 113.2644, checked: false },
        { id: "sgp_sagohouse", name: "Sago House", city: "新加坡", country: "新加坡", lat: 1.2816, lng: 103.8430, checked: false }, 
        { id: "sgp_nighthawk", name: "Night Hawk", city: "新加坡", country: "新加坡", lat: 1.2839, lng: 103.8440, checked: false },
        { id: "hkg_darkside", name: "Darkside", city: "香港", country: "中国", lat: 22.2951, lng: 114.1722, checked: false },
        { id: "tha_mahaniyom", name: "Mahaniyom Cocktail Club", city: "曼谷", country: "泰国", lat: 13.7460, lng: 100.5390, checked: false },
        { id: "hkg_savoryproject", name: "The Savory Project", city: "香港", country: "中国", lat: 22.2830, lng: 114.1560, checked: false },
        { id: "kor_barcham", name: "Bar Cham", city: "首尔", country: "韩国", lat: 37.5486, lng: 126.9070, checked: false },
        { id: "tha_barus", name: "Bar Us", city: "曼谷", country: "泰国", lat: 13.7230, lng: 100.5290, checked: false },
        { id: "mac_stregisbar", name: "The St. Regis Bar", city: "澳门", country: "中国", lat: 22.1497, lng: 113.5610, checked: false },
        { id: "jpn_sgclub", name: "The SG Club", city: "东京", country: "日本", lat: 35.6586, lng: 139.7027, checked: false },
        { id: "hkg_penicillin", name: "Penicillin", city: "香港", country: "中国", lat: 22.2833, lng: 114.1522, checked: false },
        { id: "sgp_offtrack", name: "Offtrack", city: "新加坡", country: "新加坡", lat: 1.2990, lng: 103.8550, checked: false },
        { id: "hkg_quinary", name: "Quinary", city: "香港", country: "中国", lat: 22.2828, lng: 114.1538, checked: false },
        { id: "idn_pantja", name: "Pantja", city: "雅加达", country: "印度尼西亚", lat: -6.2445, lng: 106.8000, checked: false },
        { id: "jpn_craftroom", name: "Craftroom", city: "大阪", country: "日本", lat: 34.6723, lng: 135.5023, checked: false },
        { id: "mdv_smokebitters", name: "Smoke & Bitters", city: "马累", country: "马尔代夫", lat: 4.1755, lng: 73.5093, checked: false },
        { id: "twn_vendor", name: "Vendor", city: "台中", country: "中国台湾", lat: 24.1500, lng: 120.6833, checked: false },
        { id: "sgp_native", name: "Native", city: "新加坡", country: "新加坡", lat: 1.2858, lng: 103.8480, checked: false },
        { id: "sgp_originbar", name: "Origin Bar", city: "新加坡", country: "新加坡", lat: 1.2720, lng: 103.8430, checked: false },
        { id: "phl_thecurator", name: "The Curator", city: "马尼拉", country: "菲律宾", lat: 14.5547, lng: 121.0245, checked: false },
        { id: "jpn_thebellwood", name: "The Bellwood", city: "东京", country: "日本", lat: 35.6600, lng: 139.7000, checked: false },
        { id: "sgp_analogue", name: "Analogue Initiative", city: "新加坡", country: "新加坡", lat: 1.2910, lng: 103.8510, checked: false },
        { id: "mys_bartrigona", name: "Bar Trigona", city: "吉隆坡", country: "马来西亚", lat: 3.1528, lng: 101.7119, checked: false },
        { id: "twn_barmood", name: "Bar Mood", city: "台北", country: "中国台湾", lat: 25.0478, lng: 121.5318, checked: false },
        { id: "sgp_employeesonly", name: "Employees Only", city: "新加坡", country: "新加坡", lat: 1.2830, lng: 103.8480, checked: false },
        { id: "npl_barc", name: "BarC", city: "加德满都", country: "尼泊尔", lat: 27.7172, lng: 85.3240, checked: false },
        { id: "ind_zlb23", name: "ZLB23", city: "班加罗尔", country: "印度", lat: 12.9716, lng: 77.5946, checked: false },
        { id: "mys_reka", name: "Reka", city: "吉隆坡", country: "马来西亚", lat: 3.1450, lng: 101.7100, checked: false },
        { id: "sgp_fura", name: "Fura", city: "新加坡", country: "新加坡", lat: 1.2960, lng: 103.8520, checked: false },
        { id: "chn_cmyk", name: "CMYK", city: "长沙", country: "中国", lat: 28.2282, lng: 112.9388, checked: false },
        { id: "twn_publichouse", name: "The Public House", city: "台北", country: "中国台湾", lat: 25.0330, lng: 121.5654, checked: false },
        { id: "hkg_mostlyharmless", name: "Mostly Harmless", city: "香港", country: "中国", lat: 22.2860, lng: 114.1500, checked: false },
        { id: "kor_alice", name: "Alice", city: "首尔", country: "韩国", lat: 37.5242, lng: 127.0380, checked: false },
        { id: "vnm_haflington", name: "The Haflington", city: "河内", country: "越南", lat: 21.0278, lng: 105.8342, checked: false },
        { id: "kor_lechamber", name: "Le Chamber", city: "首尔", country: "韩国", lat: 37.5250, lng: 127.0370, checked: false },
        { id: "sgp_atlas", name: "Atlas", city: "新加坡", country: "新加坡", lat: 1.2976, lng: 103.8539, checked: false },
        { id: "kor_pineco", name: "Pine & Co", city: "首尔", country: "韩国", lat: 37.5200, lng: 127.0250, checked: false }
    ];
    let top50Data = []; // This will hold the loaded or initialized bar data

    function saveCalendarData() {
        localStorage.setItem('calendarData', JSON.stringify(calendarData));
    }

    function applyBackgroundStyle(index) {
        document.body.classList.remove(...backgroundStyles); // Remove all possible bg classes
        document.body.classList.add(backgroundStyles[index]);
        localStorage.setItem('selectedBackgroundIndex', index);
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

                if (entry.images && entry.images.length > 0) {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = entry.images[0];
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
        tempUploadedImages = []; // 清空暂存图片
        modalImageCountIndicator.textContent = ''; // 清空计数器
        
        if (calendarData[dateKey]) {
            const entry = calendarData[dateKey];
            detailsModalDateElement.textContent = `${year}年${month}月${day}日`;
            
            detailsModalImagesContainer.innerHTML = ''; // 清空旧图片
            if (entry.images && entry.images.length > 0) {
                entry.images.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    detailsModalImagesContainer.appendChild(img);
                });
            } else {
                detailsModalImagesContainer.innerHTML = '<p style="color:#888;">没有上传图片</p>';
            }

            detailsModalBarName.textContent = entry.barName || '未提供';
            detailsModalBarLocation.textContent = entry.barLocation || '未提供';
            detailsModalBarDescription.textContent = entry.description || '未提供';
            detailsModalCocktailRecommendation.textContent = entry.cocktail || '未提供';
            detailsModal.style.display = 'block';
        } else {
            // Show entry modal for new entry or to edit existing (will prefill if data exists)
            modalDateElement.textContent = `${year}年${month}月${day}日`;
            const existingEntry = calendarData[dateKey];
            if (existingEntry && existingEntry.images && existingEntry.images.length > 0) {
                modalImagePreview.src = existingEntry.images[0];
                modalImagePreview.style.display = 'block';
                if (existingEntry.images.length > 1) {
                    modalImageCountIndicator.textContent = `(共 ${existingEntry.images.length} 张，重新上传将替换所有)`;
                } else {
                     modalImageCountIndicator.textContent = `(共 1 张，重新上传将替换所有)`;
                }
            } else {
                modalImagePreview.style.display = 'none';
                modalImagePreview.src = '#';
                modalImageCountIndicator.textContent = '';
            }
            modalImageUpload.value = ''; // Clear previous file input selection
            modalBarNameInput.value = existingEntry?.barName || '';
            modalBarLocationInput.value = existingEntry?.barLocation || '';
            modalBarDescriptionInput.value = existingEntry?.description || '';
            modalCocktailRecommendationInput.value = existingEntry?.cocktail || '';
            entryModal.style.display = 'block';
        }
    }

    modalImageUpload.addEventListener('change', (event) => {
        const files = event.target.files;
        tempUploadedImages = []; // 每次选择都重置临时图片数组
        modalImagePreview.style.display = 'none';
        modalImageCountIndicator.textContent = '';

        if (files.length > 0) {
            // Display first image as preview
            const readerPreview = new FileReader();
            readerPreview.onload = (e) => {
                modalImagePreview.src = e.target.result;
                modalImagePreview.style.display = 'block';
            }
            readerPreview.readAsDataURL(files[0]);

            if (files.length > 0) {
                modalImageCountIndicator.textContent = `已选择 ${files.length} 张图片`;
            }

            // Convert all selected files to base64 and store in tempUploadedImages
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    tempUploadedImages.push(e.target.result);
                }
                reader.readAsDataURL(file);
            });
        }
    });

    saveEntryButton.addEventListener('click', () => {
        if (!currentEditingDate) return;
        const dateToSave = currentEditingDate;

        let imagesToSave = [];
        if (tempUploadedImages.length > 0) {
            imagesToSave = tempUploadedImages; // 使用新上传的图片
        } else if (calendarData[dateToSave] && calendarData[dateToSave].images) {
            imagesToSave = calendarData[dateToSave].images; // 保留旧图片
        }

        const entryData = {
            images: imagesToSave, // 修改: 保存图片数组
            barName: modalBarNameInput.value.trim(),
            barLocation: modalBarLocationInput.value.trim(),
            description: modalBarDescriptionInput.value.trim(),
            cocktail: modalCocktailRecommendationInput.value.trim(),
        };

        // Only save/update if there's meaningful data or any images
        if (entryData.barName || entryData.barLocation || entryData.description || entryData.cocktail || (entryData.images && entryData.images.length > 0)) {
            calendarData[dateToSave] = entryData;
        } else {
            if (calendarData[dateToSave]) { 
                delete calendarData[dateToSave];
            }
        }
        
        saveCalendarData();
        renderCalendar();
        entryModal.style.display = 'none';
        tempUploadedImages = []; // 清空暂存
        modalImageCountIndicator.textContent = '';
    });

    deleteEntryButton.addEventListener('click', () => {
        if (currentEditingDate && calendarData[currentEditingDate]) {
            if (confirm('您确定要删除这条记录吗？')) {
                delete calendarData[currentEditingDate];
                saveCalendarData();
                renderCalendar();
                detailsModal.style.display = 'none';
                currentEditingDate = null;
            }
        }
    });

    clearAllButton.addEventListener('click', () => {
        if (confirm('您确定要清空所有日历记录吗？此操作无法撤销。')) {
            calendarData = {};
            saveCalendarData();
            renderCalendar();
            alert('所有记录已清空。');
        }
    });

    toggleBackgroundButton.addEventListener('click', () => {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundStyles.length;
        applyBackgroundStyle(currentBackgroundIndex);
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

    // --- Navigation Logic ---
    function setActivePage(pageId) {
        document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active-page'));
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active-tab'));
        
        document.getElementById(pageId).classList.add('active-page');
        if (pageId === 'calendar-page') {
            navCalendarButton.classList.add('active-tab');
        } else if (pageId === 'top50-page') {
            navTop50Button.classList.add('active-tab');
            renderTop50List(); // Render the list when this page becomes active
            initializeTop50Map(); // Initialize map when page is active
        }
    }
    navCalendarButton.addEventListener('click', () => setActivePage('calendar-page'));
    navTop50Button.addEventListener('click', () => setActivePage('top50-page'));

    // --- Top 50 Bars Logic ---
    function loadTop50Data() {
        const savedData = localStorage.getItem('top50BarData');
        if (savedData) {
            top50Data = JSON.parse(savedData);
            // Ensure all bars from the master list are present, update if needed
            const masterIds = asiaTop50Bars.map(b => b.id);
            const savedIds = top50Data.map(b => b.id);
            asiaTop50Bars.forEach(masterBar => {
                if (!savedIds.includes(masterBar.id)) {
                    top50Data.push({...masterBar, checked: false }); // Add new bar from master list
                } else {
                    // Update existing bar's non-checked properties from master if they changed (e.g. name, city)
                    const savedBar = top50Data.find(b => b.id === masterBar.id);
                    savedBar.name = masterBar.name;
                    savedBar.city = masterBar.city;
                    savedBar.country = masterBar.country;
                    savedBar.lat = masterBar.lat;
                    savedBar.lng = masterBar.lng;
                }
            });
            // Remove bars from saved data that are no longer in master list
            top50Data = top50Data.filter(b => masterIds.includes(b.id));

        } else {
            top50Data = asiaTop50Bars.map(bar => ({...bar})); // Initial load, copy from master
        }
        saveTop50Data();
    }

    function saveTop50Data() {
        localStorage.setItem('top50BarData', JSON.stringify(top50Data));
    }

    function updateTop50Stats() {
        const checkedInCount = top50Data.filter(bar => bar.checked).length;
        const totalBars = top50Data.length;
        top50CheckedCountElement.textContent = checkedInCount;
        top50RemainingCountElement.textContent = totalBars - checkedInCount;
    }

    function toggleCheckIn(barId) {
        const bar = top50Data.find(b => b.id === barId);
        if (bar) {
            bar.checked = !bar.checked;
            saveTop50Data();
            renderTop50List(); // Re-render to update button style and stats
            updateMapMarkers(); // Update map markers if map is initialized
        }
    }

    function renderTop50List() {
        if (!top50ListContainer) return; // Only render if the container exists on the current page
        top50ListContainer.innerHTML = '';
        top50Data.forEach(bar => {
            const item = document.createElement('div');
            item.classList.add('top50-bar-item');
            item.innerHTML = `
                <div class="bar-info">
                    <h3>${bar.name}</h3>
                    <p>${bar.city}, ${bar.country}</p>
                </div>
                <button class="check-in-button ${bar.checked ? 'checked-in' : ''}" data-id="${bar.id}">
                    ${bar.checked ? '已打卡 ✓' : '打卡'}
                </button>
            `;
            item.querySelector('.check-in-button').addEventListener('click', (e) => {
                toggleCheckIn(e.target.dataset.id);
            });
            top50ListContainer.appendChild(item);
        });
        updateTop50Stats();
    }
    
    // --- Share Card Logic ---
    generateShareButton.addEventListener('click', () => {
        shareCardBarsGrid.innerHTML = ''; // Clear previous
        const visitedBars = top50Data.filter(bar => bar.checked);
        if (visitedBars.length === 0) {
            shareCardBarsGrid.innerHTML = '<p style="color:#ccc; text-align:center;">还没有打卡任何酒吧哦！</p>';
        } else {
            visitedBars.forEach(bar => {
                const barElement = document.createElement('div');
                barElement.classList.add('share-bar-item');
                barElement.innerHTML = `<h4>${bar.name}</h4><p>${bar.city}</p>`;
                shareCardBarsGrid.appendChild(barElement);
            });
        }
        shareCardModal.style.display = 'block';
    });

    document.querySelectorAll('.share-modal .share-close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            shareCardModal.style.display = 'none';
        });
    });
    
    downloadShareCardButton.addEventListener('click', () => {
        if(html2canvas) {
             html2canvas(shareCardRenderArea, {
                 backgroundColor: '#252525', // Match modal content bg
                 useCORS: true // If images from other domains were on the card
             }).then(canvas => {
                const image = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = 'my_top50_bars_journey.png';
                link.href = image;
                link.click();
            }).catch(err => {
                console.error('Error generating share card image:', err);
                alert('生成分享图片失败，请查看控制台获取更多信息。');
            });
        } else {
            alert('无法生成图片，html2canvas 库未加载。');
        }
    });

    // --- Leaflet Map Logic ---
    function initializeTop50Map() {
        if (top50Map || !mapContainer || mapContainer.style.display === 'none') {
             // If map already initialized, or container not visible, do nothing or just update markers
            if (top50Map && mapContainer.style.display !== 'none') updateMapMarkers();
            return;
        }
        
        // Show map container if it was hidden
        mapContainer.style.display = 'block';

        top50Map = L.map(mapContainer).setView([20, 115], 3); // Centered roughly over Asia, adjust zoom

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { // Using a dark theme map
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(top50Map);
        updateMapMarkers();
    }

    function updateMapMarkers() {
        if (!top50Map) return;
        // Clear existing markers
        top50Map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                top50Map.removeLayer(layer);
            }
        });

        top50Data.forEach(bar => {
            if (bar.lat && bar.lng) {
                const markerColor = bar.checked ? 'gold' : 'royalblue'; // Different color for checked-in
                // Simple custom icon using SVG for better styling
                const svgIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="${markerColor}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
                const customIcon = L.divIcon({
                    html: svgIconHtml,
                    className: 'custom-map-marker',
                    iconSize: [28, 28],
                    iconAnchor: [14, 28], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -28] // point from which the popup should open relative to the iconAnchor
                });

                L.marker([bar.lat, bar.lng], {icon: customIcon})
                 .addTo(top50Map)
                 .bindPopup(`<b>${bar.name}</b><br>${bar.city}${bar.checked ? '<br>✓ 已打卡' : ''}`);
            }
        });
    }

    // Initial Load
    loadTop50Data(); // Load Top 50 bar data first
    const savedBgIndex = localStorage.getItem('selectedBackgroundIndex');
    if (savedBgIndex !== null && backgroundStyles[parseInt(savedBgIndex)]) {
        currentBackgroundIndex = parseInt(savedBgIndex);
    } else {
        currentBackgroundIndex = 0; 
    }
    applyBackgroundStyle(currentBackgroundIndex);
    renderCalendar(); // Render calendar for the initially active calendar page
    setActivePage('calendar-page'); // Set calendar page as active on first load
}); 