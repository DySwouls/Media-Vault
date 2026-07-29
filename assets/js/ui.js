(function () {
    const storage = window.MediaVaultStorage;
    const state = {
        search: '',
        category: 'all',
        status: 'all'
    };

    function getCategoryLabel(category) {
        const labels = {
            animes: 'Animes',
            filmes: 'Filmes',
            series: 'Séries',
            jogos: 'Jogos',
            livros: 'Livros'
        };

        return labels[category] || category;
    }

    function getStatusLabel(status) {
        const labels = {
            favorito: 'Favorito',
            assistindo: 'Assistindo',
            concluido: 'Concluído',
            'quero-ver': 'Quero ver',
            zerado: 'Zerado',
            dropado: 'Dropado',
            'nao-joguei': 'Nunca joguei',
            'nao-assisti': 'Não assisti',
            'nao-li': 'Não li'
        };

        return labels[status] || status;
    }

    function filterItems(items) {
        return items.filter((item) => {
            const matchesSearch = !state.search || `${item.title} ${item.note} ${getCategoryLabel(item.category)} ${getStatusLabel(item.status)}`
                .toLowerCase()
                .includes(state.search.toLowerCase());

            const matchesCategory = state.category === 'all' || item.category === state.category;
            const matchesStatus = state.status === 'all' || item.status === state.status;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }

    function renderLibrary() {
        const list = document.getElementById('library-list');
        const count = document.getElementById('library-count');

        if (!list || !count) return;

        const items = filterItems(storage.getLibraryItems());
        count.textContent = `${items.length} ${items.length === 1 ? 'item' : 'itens'}`;

        if (!items.length) {
            list.innerHTML = '<div class="empty-state">Nenhum item encontrado com esses filtros.</div>';
            return;
        }

        list.innerHTML = items.map((item) => `
            <article class="media-card" data-item-id="${item.id}" style="background-image: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(4,7,14,0.9)), url('${item.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80'}'); background-size: cover; background-position: center;">
                <div>
                    <h5>${item.title}</h5>
                    <p>${item.description || item.note || 'Sem observações adicionais.'}</p>
                    <div class="media-meta">
                        <span class="badge">${getCategoryLabel(item.category)}</span>
                        <span class="badge">${getStatusLabel(item.status)}</span>
                    </div>
                </div>
                <div class="card-hover">
                    <strong>${item.title}</strong>
                    <p>${item.note || 'Sem observações adicionais.'}</p>
                    ${item.subcategories ? `<p><strong>Subcategorias:</strong> ${item.subcategories}</p>` : ''}
                    <p><strong>Clique para ver mais</strong></p>
                </div>
            </article>
        `).join('');
    }

    function setActiveCategoryButtons() {
        document.querySelectorAll('.filter-chip').forEach((button) => {
            button.classList.toggle('active', button.dataset.category === state.category);
        });
    }

    const statusOptionsByCategory = {
        all: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'assistindo', label: 'Assistindo' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'quero-ver', label: 'Quero ver' },
            { value: 'zerado', label: 'Zerado' },
            { value: 'dropado', label: 'Dropado' },
            { value: 'nao-joguei', label: 'Nunca joguei' },
            { value: 'nao-assisti', label: 'Não assisti' },
            { value: 'nao-li', label: 'Não li' }
        ],
        animes: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'assistindo', label: 'Assistindo' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'quero-ver', label: 'Quero ver' },
            { value: 'dropado', label: 'Dropado' }
        ],
        filmes: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'assistindo', label: 'Assistindo' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'quero-ver', label: 'Quero ver' },
            { value: 'dropado', label: 'Dropado' }
        ],
        series: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'assistindo', label: 'Assistindo' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'quero-ver', label: 'Quero ver' },
            { value: 'dropado', label: 'Dropado' }
        ],
        jogos: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'zerado', label: 'Zerado' },
            { value: 'dropado', label: 'Dropado' },
            { value: 'quero-ver', label: 'Quero jogar' },
            { value: 'nao-joguei', label: 'Nunca joguei' }
        ],
        livros: [
            { value: 'all', label: 'Todos' },
            { value: 'favorito', label: 'Favorito' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'quero-ver', label: 'Quero ler' },
            { value: 'nao-li', label: 'Não li' },
            { value: 'dropado', label: 'Dropado' }
        ]
    };

    function renderStatusFilter(statusFilter) {
        if (!statusFilter) return;
        populateStatusSelect(statusFilter, state.category, state.status);
    }

    function populateStatusSelect(selectElement, category, selectedValue = 'all') {
        if (!selectElement) return;
        const options = statusOptionsByCategory[category] || statusOptionsByCategory.all;
        selectElement.innerHTML = options.map((option) => `
            <option value="${option.value}">${option.label}</option>
        `).join('');
        selectElement.value = options.some((option) => option.value === selectedValue) ? selectedValue : options[0].value;
    }

    function setupLibrary() {
        const searchInput = document.getElementById('library-search');
        const statusFilter = document.getElementById('status-filter');
        const form = document.getElementById('library-form');
        const openModalButton = document.getElementById('open-add-modal');
        const closeModalButton = document.getElementById('close-add-modal');
        const modal = document.getElementById('add-modal');

        document.querySelectorAll('.filter-chip').forEach((button) => {
            button.addEventListener('click', () => {
                state.category = button.dataset.category;
                state.status = 'all';
                setActiveCategoryButtons();
                renderStatusFilter(statusFilter);
                renderLibraryWithDetails();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                state.search = event.target.value;
                renderLibraryWithDetails();
            });
        }

        const addStatusSelect = document.getElementById('item-status');
        const addCategorySelect = document.getElementById('item-category');

        if (statusFilter) {
            renderStatusFilter(statusFilter);
            statusFilter.addEventListener('change', (event) => {
                state.status = event.target.value;
                renderLibraryWithDetails();
            });
        }

        if (addCategorySelect && addStatusSelect) {
            populateStatusSelect(addStatusSelect, addCategorySelect.value, addStatusSelect.value || 'favorito');
            addCategorySelect.addEventListener('change', (event) => {
                populateStatusSelect(addStatusSelect, event.target.value, 'favorito');
            });
        }

        if (openModalButton && modal) {
            openModalButton.addEventListener('click', () => {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const initialCategory = urlParams.get('category');
        if (initialCategory && statusOptionsByCategory[initialCategory]) {
            state.category = initialCategory;
            setActiveCategoryButtons();
            renderStatusFilter(statusFilter);
        }

        if (closeModalButton && modal) {
            closeModalButton.addEventListener('click', () => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            });
        }

        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        }

        const detailModal = document.getElementById('detail-modal');
        const detailCloseButton = document.getElementById('close-detail-modal');
        const detailCover = document.getElementById('detail-cover');
        const detailTitle = document.getElementById('detail-title');
        const detailCategory = document.getElementById('detail-category');
        const detailDescription = document.getElementById('detail-description');
        const detailStatus = document.getElementById('detail-status');
        const detailYear = document.getElementById('detail-year');
        const detailSubcategories = document.getElementById('detail-subcategories');
        const detailNote = document.getElementById('detail-note');
        const detailAdded = document.getElementById('detail-added');
        const detailStatusInput = document.getElementById('detail-status-input');
        const detailNoteInput = document.getElementById('detail-note-input');
        const detailSubcategoriesInput = document.getElementById('detail-subcategories-input');
        const detailForm = document.getElementById('detail-form');
        const detailDelete = document.getElementById('detail-delete');
        let activeDetailId = null;

        function openDetailModal(item) {
            if (!detailModal) return;
            activeDetailId = item.id;
            detailCover.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('${item.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80'}')`;
            detailTitle.textContent = item.title;
            detailCategory.textContent = getCategoryLabel(item.category);
            detailDescription.textContent = item.description || item.note || 'Sem descrição disponível.';
            detailStatus.textContent = getStatusLabel(item.status);
            detailYear.textContent = item.year || 'Ano não informado';
            detailSubcategories.textContent = item.subcategories || 'Sem subcategorias';
            detailNote.textContent = item.note || 'Sem comentários';
            detailAdded.textContent = new Date(item.addedAt).toLocaleDateString('pt-BR');
            populateStatusSelect(detailStatusInput, item.category, item.status);
            detailNoteInput.value = item.note;
            detailSubcategoriesInput.value = item.subcategories;
            detailModal.classList.add('active');
            detailModal.setAttribute('aria-hidden', 'false');
        }

        if (detailCloseButton && detailModal) {
            detailCloseButton.addEventListener('click', () => {
                detailModal.classList.remove('active');
                detailModal.setAttribute('aria-hidden', 'true');
            });
        }

        if (detailModal) {
            detailModal.addEventListener('click', (event) => {
                if (event.target === detailModal) {
                    detailModal.classList.remove('active');
                    detailModal.setAttribute('aria-hidden', 'true');
                }
            });
        }

        function refreshDetailListeners() {
            document.querySelectorAll('.media-card[data-item-id]').forEach((card) => {
                card.addEventListener('click', () => {
                    const itemId = card.dataset.itemId;
                    const item = storage.getLibraryItems().find((entry) => entry.id === itemId);
                    if (item) {
                        openDetailModal(item);
                    }
                });
            });
        }

        const renderLibraryWithDetails = () => {
            renderLibrary();
            refreshDetailListeners();
        };

        if (detailForm) {
            detailForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const items = storage.getLibraryItems();
                const itemIndex = items.findIndex((entry) => entry.id === activeDetailId);
                if (itemIndex === -1) return;

                const item = items[itemIndex];
                item.status = detailStatusInput.value;
                item.note = detailNoteInput.value.trim();
                item.subcategories = detailSubcategoriesInput.value.trim();
                item.description = detailDescription.textContent;

                storage.saveLibraryItems(items);
                renderLibraryWithDetails();
                openDetailModal(item);
            });
        }

        if (detailDelete) {
            detailDelete.addEventListener('click', () => {
                const items = storage.getLibraryItems();
                const filtered = items.filter((entry) => entry.id !== activeDetailId);
                storage.saveLibraryItems(filtered);
                detailModal.classList.remove('active');
                detailModal.setAttribute('aria-hidden', 'true');
                renderLibrary();
            });
        }

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const title = document.getElementById('item-title').value.trim();
                const category = document.getElementById('item-category').value;
                const status = document.getElementById('item-status').value;
                const description = document.getElementById('item-description').value.trim();
                const image = document.getElementById('item-image').value.trim();
                const subcategories = document.getElementById('item-subcategories').value.trim();
                const note = description || '';

                if (!title) return;

                storage.addLibraryItem({ title, category, status, note, description, image, subcategories });
                form.reset();
                if (modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
                renderLibrary();
                refreshDetailListeners();
            });
        }

        function initListeners() {
            setActiveCategoryButtons();
            renderLibraryWithDetails();
        }

        initListeners();
    }

    window.MediaVaultUI = {
        setupLibrary,
        renderLibrary
    };
})();
