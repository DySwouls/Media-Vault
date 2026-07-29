(function () {
    const STORAGE_KEY = 'media-vault-library';

    const defaultItems = [
        {
            id: 'default-anime-1',
            title: 'One Piece',
            category: 'animes',
            status: 'assistindo',
            note: 'Saga atual em andamento',
            description: 'Aventura épica com uma busca por um tesouro lendário.',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
            subcategories: 'shounen, aventura',
            addedAt: '2026-07-01T10:00:00.000Z'
        },
        {
            id: 'default-film-1',
            title: 'Interstellar',
            category: 'filmes',
            status: 'favorito',
            note: 'Filme de sci-fi favorito',
            description: 'Uma jornada emocional e científica pelo espaço.',
            image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80',
            subcategories: 'sci-fi, drama',
            addedAt: '2026-07-02T12:00:00.000Z'
        },
        {
            id: 'default-series-1',
            title: 'Breaking Bad',
            category: 'series',
            status: 'concluido',
            note: 'Série clássica e marcante',
            description: 'Uma história intensa sobre transformação e moralidade.',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
            subcategories: 'crime, drama',
            addedAt: '2026-07-03T15:00:00.000Z'
        },
        {
            id: 'default-jogo-1',
            title: 'Elden Ring',
            category: 'jogos',
            status: 'zerado',
            note: 'Jogo incrível com excelente mundo aberto',
            description: 'Um RPG de ação com combate desafiador e narrativa envolvente.',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
            subcategories: 'RPG, action, soulslike',
            addedAt: '2026-07-04T09:00:00.000Z'
        },
        {
            id: 'default-livro-1',
            title: '1984',
            category: 'livros',
            status: 'concluido',
            note: 'Leitura obrigatória',
            description: 'Um clássico distópico sobre poder e controle.',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
            subcategories: 'distopia, política',
            addedAt: '2026-07-05T18:00:00.000Z'
        }
    ];

    function createId() {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function getDefaultItems() {
        return defaultItems.map((item) => ({ ...item }));
    }

    function getLibraryItems() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            saveLibraryItems(getDefaultItems());
            return getDefaultItems();
        }

        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : getDefaultItems();
        } catch (error) {
            console.warn('Erro ao carregar biblioteca:', error);
            saveLibraryItems(getDefaultItems());
            return getDefaultItems();
        }
    }

    function saveLibraryItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return items;
    }

    function addLibraryItem(item) {
        const normalized = {
            id: createId(),
            title: item.title.trim(),
            category: item.category,
            status: item.status,
            note: item.note.trim(),
            description: item.description.trim(),
            image: item.image.trim(),
            subcategories: item.subcategories.trim(),
            addedAt: new Date().toISOString()
        };

        const items = getLibraryItems();
        items.unshift(normalized);
        saveLibraryItems(items);

        return normalized;
    }

    window.MediaVaultStorage = {
        STORAGE_KEY,
        getLibraryItems,
        saveLibraryItems,
        addLibraryItem
    };
})();
