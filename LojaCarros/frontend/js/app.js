// Configuração
const API_BASE = '/api/cars';

// Elementos DOM
const dialog = document.getElementById('form-dialog');
const form = document.getElementById('car-dialog-form');
const el = id => document.getElementById(id);

// Estado da aplicação
let allCars = [];
let currentFilter = 'all';

// Elementos do carrossel
const featPrev = document.getElementById('feat-prev');
const featNext = document.getElementById('feat-next');
const featuredGridEl = document.getElementById('featured-grid');
const carsGridEl = document.getElementById('cars-grid');

// Estado do carrossel
let featRafId = null;
let featRunning = false;
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DRIFT_PX_PER_SEC = 300;
let lastTs = 0;

// ==================== Utilitários ====================

function showMessage(text, type) {
    const msg = el('msg');
    msg.textContent = text;
    msg.className = `message ${type}`;
    setTimeout(() => { msg.textContent = ''; msg.className = ''; }, 4000);
}

async function apiFetch(url, opts = {}) {
    try {
        const res = await fetch(url, opts);
        const text = await res.text();
        if (!res.ok) {
            let errorMsg = res.statusText;
            try {
                const errorData = JSON.parse(text);
                // Prefer message, then error, then statusText
                errorMsg = errorData.message || errorData.error || errorMsg;
                if (errorData.details) {
                    errorMsg += ' - ' + String(errorData.details).slice(0, 300);
                }
            } catch (e) {
                errorMsg = text || res.statusText;
            }
            throw new Error(errorMsg);
        }
        // Tenta parsear JSON; se falhar, lança erro com conteúdo para auxiliar diagnóstico
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch (e) {
            // Resposta 200 com conteúdo não-JSON: provável HTML de erro do PHP
            const snippet = text.slice(0, 1000);
            throw new Error('Resposta inválida da API (não-JSON): ' + snippet);
        }
    } catch (err) {
        if (err instanceof TypeError && err.message.includes('fetch')) {
            throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
        }
        throw err;
    }
}

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": "&#39;"
    })[c]);
}

function formatPrice(price) {
    if (price == null) return 'Sob consulta';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// ==================== Processamento de Imagens ====================

function loadBestImage(carImageEl, candidates, fallback) {
    const list = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
    const fb = fallback || '';
    // Se não há candidatos nem fallback, marca como 'no-image' e limpa background
    if (list.length === 0 && !fb) {
        carImageEl.classList.add('no-image');
        carImageEl.style.backgroundImage = '';
        return;
    }
    const tryNext = (idx) => {
        if (idx >= list.length) {
            if (fb) carImageEl.style.backgroundImage = `url('${fb}')`;
            else {
                carImageEl.classList.add('no-image');
                carImageEl.style.backgroundImage = '';
            }
            return;
        }
        const src = list[idx];
        const probe = new Image();
        probe.onload = () => { carImageEl.style.backgroundImage = `url('${src}')`; };
        probe.onerror = () => { tryNext(idx + 1); };
        probe.src = src;
    };
    tryNext(0);
}

function slugifyVehicle(make, model) {
    const base = `${make || ''} ${model || ''}`.trim().toLowerCase();
    return base
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[`'"']/g, '') // remove aspas e acentos
        .replace(/[^a-z0-9]+/g, '-') // tudo que não for alfanumérico vira '-'
        .replace(/^-+|-+$/g, ''); // remove hifens nas pontas
}

function normalizeVehicleKey(make, model) {
    const cleanModel = String(model || '')
        .split(' - ')[0] // remove sufixos após " - " (ex: "- Stallone")
        .trim();
    const base = `${make || ''} ${cleanModel}`.trim().toLowerCase();
    return base
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[`'"']/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function fullVehicleKey(make, model) {
    const base = `${make || ''} ${model || ''}`.trim().toLowerCase();
    return base
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[`'"']/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getImageCandidates(c) {
    const candidates = [];
    const exts = ['.webp', '.jpg', '.jpeg', '.png'];
    const fallbackImage = 'assets/carro1.jpg';
    const slug = slugifyVehicle(c.make, c.model);
    const remoteImageRaw = c.brand_logo || '';
    const remoteImage = remoteImageRaw;
    
    // Verifica se é uma URL válida (http/https)
    const isRemoteUrl = remoteImage && (remoteImage.startsWith('http://') || remoteImage.startsWith('https://'));
    
    // Função auxiliar para adicionar mapeamentos locais baseados no nome/modelo atual
    const addLocalMappings = () => {
        const fullKey = fullVehicleKey(c.make, c.model);
        
        // Mapeamento manual para veículos completos
        const manualMapFull = {
            'mercedes-benz amg g63 - mansory p720': ['assets/G63-P720.webp', 'assets/G63-P720.jpg', 'assets/G63-P720.png'],
            'mercedes-benz amg g63 - grande entree p820': ['assets/AMG-G63.webp'],
            'rolls-royce spectre by mansory': ['assets/RR-Spectre.webp', 'assets/RR-Spectre.jpg', 'assets/RR-Spectre.png'],
        };
        if (manualMapFull[fullKey]) candidates.push(...manualMapFull[fullKey]);
        
        // Mapeamento manual para veículos normalizados
        const key = normalizeVehicleKey(c.make, c.model);
        const manualMap = {
            'ferrari 12 cilindri': ['assets/12Cilindri.webp'],
            'ferrari 812 gts': ['assets/812GTs.webp', 'assets/812GTs.jpg', 'assets/812GTs.png'],
            'mercedes-benz amg g63': [
                'assets/AMG-G63.webp',
                'assets/G63-720.webp',
                'assets/G63-720.jpg',
                'assets/G63-720.png'
            ],
            'ferrari purosangue': ['assets/Purosangue.webp', 'assets/Purosangue.jpg', 'assets/Purosangue.png'],
            'rolls-royce cullinan': ['assets/RR-Cullinan.webp', 'assets/RR-Cullinan.jpg', 'assets/RR-Cullinan.png'],
            'rolls-royce ghost by mansory': [
                'assets/RR-Gost.webp', 'assets/RR-Gost.jpg', 'assets/RR-Gost.png',
                'assets/RR-Ghost.webp', 'assets/RR-Ghost.jpg', 'assets/RR-Ghost.png'
            ],
            'rolls-royce phantom': ['assets/RR-Phantom.webp', 'assets/RR-Phantom.jpg', 'assets/RR-Phantom.png'],
            'lamborghini urus se': ['assets/UrusSE.webp', 'assets/UrusSE.jpg', 'assets/UrusSE.png'],
            'lamborghini urus': ['assets/Urus-P900.webp', 'assets/Urus-P900.jpg', 'assets/Urus-P900.png'],
        };
        if (manualMap[key]) candidates.push(...manualMap[key]);
        
        // Tenta imagens baseadas no slug
        if (slug) {
            exts.forEach(ext => candidates.push(`assets/${slug}${ext}`));
            if (slug.includes('-gt2')) exts.forEach(ext => candidates.push(`assets/${slug.replace('-gt2', '-gts')}${ext}`));
            if (slug.includes('-gts')) exts.forEach(ext => candidates.push(`assets/${slug.replace('-gts', '-gt2')}${ext}`));
        }
    };
    
    // PRIORIDADE 1: Se há uma URL remota válida, ela é SEMPRE a primeira opção
    // Isso garante que a imagem salva no banco seja sempre tentada primeiro
    // Se a URL falhar (CORS, 404, etc.), tenta mapeamentos locais baseados no nome/modelo atual
    // Isso permite que cada veículo tenha suas próprias imagens locais como fallback
    if (isRemoteUrl) {
        candidates.push(remoteImage);
        // Adiciona mapeamentos locais como fallback (caso a URL falhe)
        // Isso garante que mesmo se a URL falhar, cada veículo tenta suas próprias imagens locais
        addLocalMappings();
        // Fallback genérico como último recurso
        candidates.push(fallbackImage);
        return { candidates, fallbackImage };
    }
    
    // PRIORIDADE 2: Se não há URL remota válida, tenta mapeamentos locais
    if (!remoteImageRaw || remoteImageRaw === 'not image') {
        addLocalMappings();
        
        // Se não encontrou nenhum candidato, retorna sem imagem
        if (candidates.length === 0) {
            return { candidates: [], fallbackImage: '', noImage: true };
        }
        
        // Adiciona fallback no final
        candidates.push(fallbackImage);
        return { candidates, fallbackImage };
    }
    
    // PRIORIDADE 3: Se tem um valor que não é URL remota nem 'not image'
    // (pode ser um caminho local relativo)
    if (remoteImage) {
        candidates.push(remoteImage);
    }
    
    // Tenta também mapeamentos locais como fallback
    addLocalMappings();
    
    // Adiciona fallback no final
    candidates.push(fallbackImage);
    
    return { candidates, fallbackImage };
}

// ==================== Criação de Cards ====================

function createCarCard(c) {
    const card = document.createElement('div');
    card.className = 'car-card';
    if (c.featured) card.classList.add('featured');
    
    const categoryClass = c.category || 'luxury';
    const { candidates, fallbackImage, noImage } = getImageCandidates(c);
    const initialBg = (noImage ? '' : fallbackImage);

    card.innerHTML = `
        <div class="car-image ${noImage ? 'no-image' : ''}" ${initialBg ? `style="background-image:url('${escapeHtml(initialBg)}');"` : ''} data-fallback="${escapeHtml(fallbackImage)}">
            ${c.featured ? '<span class="featured-badge">Destaque</span>' : ''}
            <span class="category-badge ${categoryClass}">${escapeHtml(c.category || 'luxury').toUpperCase()}</span>
            ${noImage ? '<div class="no-image-placeholder">Sem imagem</div>' : ''}
        </div>
        <div class="car-info">
            <div class="car-header">
                <div>
                    <h4>${escapeHtml(c.make)} ${escapeHtml(c.model)}</h4>
                    <p class="car-year">${c.year || ''}</p>
                </div>
                <div class="car-price">${formatPrice(c.price)}</div>
            </div>
            ${c.description ? `<p class="car-description">${escapeHtml(c.description.substring(0, 100))}${c.description.length > 100 ? '...' : ''}</p>` : ''}
            <div class="car-actions">
                <button data-id="${c.id}" class="btn edit-btn" type="button">Editar</button>
                <button data-id="${c.id}" class="btn ghost del-btn" type="button">Excluir</button>
            </div>
        </div>
    `;
    
    // Pré-carrega melhor imagem e salva candidatos para clones
    const carImage = card.querySelector('.car-image');
    carImage.setAttribute('data-candidates', (Array.isArray(candidates) ? candidates.join('|') : ''));
    carImage.setAttribute('data-fallback', fallbackImage || '');
    // Somente tenta carregar imagens quando houver candidatos ou fallback
    if (!noImage) {
        loadBestImage(carImage, candidates, fallbackImage);
    } else {
        // Garante estado visual 'no-image' quando não há imagem
        carImage.classList.add('no-image');
        carImage.style.backgroundImage = '';
    }
    
    return card;
}

// ==================== Renderização ====================

function renderCars(cars) {
    const grid = el('cars-grid');
    const featuredGrid = el('featured-grid');
    
    if (!Array.isArray(cars) || cars.length === 0) {
        grid.innerHTML = '<div class="empty-state">Nenhum carro encontrado.</div>';
        featuredGrid.innerHTML = '';
        el('cars-count').textContent = '0 veículos';
        // Para o autoplay se não houver cards
        stopFeaturedAutoplay();
        return;
    }

    allCars = cars;
    
    // Filter cars by category
    let filtered = cars;
    if (currentFilter !== 'all') {
        filtered = cars.filter(c => c.category === currentFilter);
    }
    
    // Apply search
    const searchTerm = el('search-input').value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(c => 
            (c.make && c.make.toLowerCase().includes(searchTerm)) ||
            (c.model && c.model.toLowerCase().includes(searchTerm))
        );
    }

    // Featured cars - mostra todos os featured quando filtro é "all" e não há busca
    // Caso contrário, mostra apenas os featured que correspondem ao filtro/busca atual
    // Função auxiliar para verificar se um carro é featured (aceita boolean, string "true", ou 1)
    const isFeatured = (car) => {
        return car.featured === true || car.featured === 1 || car.featured === 'true' || car.featured === '1';
    };
    
    // Para o autoplay e limpa o estado do carrossel antes de renderizar
    stopFeaturedAutoplay();
    if (featuredGridEl) {
        featuredGridEl.dataset.originalCount = '0';
        featuredGridEl.dataset.loopWidth = '0';
        featuredGridEl.scrollLeft = 0;
    }
    
    let featured = [];
    if (currentFilter === 'all' && !searchTerm) {
        // Quando está em "TODOS" sem busca, mostra TODOS os featured de todos os carros
        // Usa o array original 'cars' para garantir que pega todos os dados atualizados
        featured = cars.filter(isFeatured);
    } else {
        // Quando há filtro de categoria ou busca, mostra apenas os featured que correspondem
        featured = filtered.filter(isFeatured);
    }
    
    // Limpa completamente o grid antes de adicionar novos cards
    featuredGrid.innerHTML = '';
    
    // Garante que o container tenha os estilos corretos para layout horizontal
    if (featuredGrid) {
        featuredGrid.style.display = 'flex';
        featuredGrid.style.flexDirection = 'row';
        featuredGrid.style.flexWrap = 'nowrap';
        featuredGrid.style.overflowX = 'auto';
        featuredGrid.style.overflowY = 'hidden';
    }
    
    if (featured.length > 0) {
        featured.forEach(c => {
            const card = createCarCard(c);
            // Garante que cards no carrossel tenham largura fixa
            if (featuredGrid && featuredGrid.id === 'featured-grid') {
                card.style.flexShrink = '0';
                card.style.flexGrow = '0';
                card.style.width = '360px';
                card.style.minWidth = '360px';
                card.style.maxWidth = '360px';
            }
            featuredGrid.appendChild(card);
        });
    } else {
        featuredGrid.innerHTML = '<div class="empty-state">Nenhum carro em destaque.</div>';
    }

    // All cars (excluding featured) para não duplicar na coleção
    const regular = filtered.filter(c => !c.featured);
    grid.innerHTML = '';
    if (regular.length > 0) {
        regular.forEach(c => grid.appendChild(createCarCard(c)));
    } else if (featured.length === 0) {
        grid.innerHTML = '<div class="empty-state">Nenhum carro encontrado.</div>';
    }

    // Contador reflete os itens exibidos na grade principal (inclui destaques)
    const collectionCount = regular.length;
    el('cars-count').textContent = `${collectionCount} veículo${collectionCount !== 1 ? 's' : ''}`;
    
    // Reconfigura o carrossel após renderizar os cards
    // Aguarda o próximo ciclo de renderização para garantir que o DOM foi atualizado
    if (featured.length > 0) {
        // Usa múltiplos requestAnimationFrame para garantir que o layout foi calculado
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (featuredGridEl && featuredGridEl.children.length > 0) {
                    setupFeaturedInfiniteLoop();
                    // Aguarda mais um frame antes de iniciar o autoplay
                    requestAnimationFrame(() => {
                        updateFeaturedCarouselButtons();
                        startFeaturedAutoplay();
                    });
                }
            });
        });
    } else {
        stopFeaturedAutoplay();
    }
}

async function loadCars() {
    const grid = el('cars-grid');
    const featuredGrid = el('featured-grid');
    grid.innerHTML = '<div class="small">Carregando...</div>';
    featuredGrid.innerHTML = '<div class="small">Carregando...</div>';
    
    // Para o autoplay durante o carregamento
    stopFeaturedAutoplay();
    
    try {
        const cars = await apiFetch(API_BASE);
        if (!Array.isArray(cars)) {
            throw new Error('Resposta inválida da API');
        }
        // renderCars já configura o carrossel internamente
        renderCars(cars);
    } catch (err) {
        const errorMsg = escapeHtml(err.message);
        grid.innerHTML = `<div class="message error">Erro: ${errorMsg}<br><small>Verifique se o Apache e MySQL estão rodando no XAMPP</small></div>`;
        featuredGrid.innerHTML = '';
        el('cars-count').textContent = 'Erro ao carregar';
        console.error('Erro ao carregar carros:', err);
        stopFeaturedAutoplay();
    }
}

// ==================== CRUD Operations ====================

async function onDelete(id) {
    if (!confirm('Confirmar exclusão do carro #' + id + '?')) return;
    try {
        await apiFetch(API_BASE + '?id=' + encodeURIComponent(id), { method: 'DELETE' });
        showMessage('Carro excluído', 'success');
        loadCars();
    } catch (err) {
        showMessage('Erro: ' + err.message, 'error');
    }
}

async function onEdit(id) {
    try {
        const car = await apiFetch(API_BASE + '?id=' + encodeURIComponent(id));
        form.id.value = car.id;
        form.make.value = car.make || '';
        form.model.value = car.model || '';
        form.year.value = car.year || '';
        form.price.value = car.price || '';
        form.category.value = car.category || 'luxury';
        form.featured.value = car.featured ? 'true' : 'false';
        form.description.value = car.description || '';
        // Se brand_logo for 'not image', mostra vazio no formulário
        form.brand_logo.value = (car.brand_logo && car.brand_logo !== 'not image') ? car.brand_logo : '';
        el('form-title').textContent = 'Editar carro #' + car.id;
        dialog.showModal();
    } catch (err) {
        showMessage('Erro ao carregar: ' + err.message, 'error');
    }
}

// ==================== Carrossel de Destaques ====================

function updateFeaturedCarouselButtons() {
    if (!featuredGridEl) return;
    const maxScrollLeft = Math.max(0, featuredGridEl.scrollWidth - featuredGridEl.clientWidth - 1);
    const hasOverflow = featuredGridEl.scrollWidth > featuredGridEl.clientWidth + 1;
    const atStart = featuredGridEl.scrollLeft <= 0;
    const atEnd = featuredGridEl.scrollLeft >= maxScrollLeft;
    if (featPrev) featPrev.disabled = !hasOverflow || atStart;
    if (featNext) featNext.disabled = !hasOverflow || atEnd;
}

function scrollFeaturedBy(delta) {
    if (!featuredGridEl) return;
    const amount = Math.max(200, Math.floor(featuredGridEl.clientWidth * 0.8));
    featuredGridEl.scrollBy({ left: delta * amount, behavior: 'smooth' });
    // Ajusta botões após a animação
    setTimeout(updateFeaturedCarouselButtons, 350);
}

function setupFeaturedInfiniteLoop() {
    if (!featuredGridEl) return;
    
    // Para o autoplay antes de reconfigurar
    stopFeaturedAutoplay();
    
    const savedOriginalCount = parseInt(featuredGridEl.dataset.originalCount || '0', 10);
    if (!Number.isNaN(savedOriginalCount) && savedOriginalCount > 0) {
        while (featuredGridEl.children.length > savedOriginalCount) {
            featuredGridEl.removeChild(featuredGridEl.lastElementChild);
        }
    }

    const originals = Array.from(featuredGridEl.children);
    featuredGridEl.dataset.originalCount = String(originals.length);
    featuredGridEl.dataset.loopWidth = '0';
    featuredGridEl.scrollLeft = 0;

    Array.from(featuredGridEl.querySelectorAll('.car-image')).forEach(elImg => {
        const list = (elImg.getAttribute('data-candidates') || '').split('|').filter(Boolean);
        // Não usar fallback padrão aqui — respeitar attribute exatamente como definido
        const fb = elImg.getAttribute('data-fallback');
        // Somente tenta carregar se houver candidatos ou um fallback explícito não vazio
        if (list.length > 0 || (fb && fb.trim() !== '')) {
            loadBestImage(elImg, list, fb);
        }
    });

    updateFeaturedCarouselButtons();
}

function driftStep(ts) {
    if (!featRunning || !featuredGridEl) return;
    if (!lastTs) lastTs = ts;
    const delta = Math.min(64, ts - lastTs); // limita salto ao retomar
    lastTs = ts;

    const inc = (DRIFT_PX_PER_SEC * delta) / 1000; // px/frame
    const loopWidth = parseFloat(featuredGridEl.dataset.loopWidth || '0');
    if (loopWidth > 0) {
        const twoW = loopWidth * 2;
        featuredGridEl.scrollLeft += inc;
        if (featuredGridEl.scrollLeft >= twoW) {
            featuredGridEl.scrollLeft -= loopWidth; // volta 1x largura mantendo continuidade
        }
        if (featuredGridEl.scrollLeft <= 0) {
            featuredGridEl.scrollLeft += loopWidth; // garante janela válida
        }
    }
    updateFeaturedCarouselButtons();
    featRafId = requestAnimationFrame(driftStep);
}

function startFeaturedAutoplay() {
    if (prefersReduced) return; // respeita acessibilidade
    if (featRunning) return;
    const loopWidth = parseFloat(featuredGridEl?.dataset.loopWidth || '0');
    if (!loopWidth) {
        featRunning = false;
        return;
    }
    featRunning = true;
    lastTs = 0;
    featRafId = requestAnimationFrame(driftStep);
}

function stopFeaturedAutoplay() {
    featRunning = false;
    if (featRafId) cancelAnimationFrame(featRafId);
    featRafId = null;
}

// ==================== Event Listeners ====================

// Event delegation para botões de editar e excluir (funciona com cards clonados)
function handleButtonClick(e) {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn = e.target.closest('.del-btn');
    
    if (editBtn && editBtn.dataset.id) {
        e.preventDefault();
        e.stopPropagation();
        onEdit(editBtn.dataset.id);
    } else if (delBtn && delBtn.dataset.id) {
        e.preventDefault();
        e.stopPropagation();
        onDelete(delBtn.dataset.id);
    }
}

// Configura event delegation nos containers
if (featuredGridEl) {
    featuredGridEl.addEventListener('click', handleButtonClick);
}
if (carsGridEl) {
    carsGridEl.addEventListener('click', handleButtonClick);
}

// Botão adicionar carro
document.getElementById('open-add').addEventListener('click', () => {
    form.reset();
    form.id.value = '';
    form.category.value = 'luxury';
    form.featured.value = 'false';
    el('form-title').textContent = 'Adicionar carro';
    dialog.showModal();
});

// Botão atualizar
document.getElementById('refresh').addEventListener('click', loadCars);

// Botões do dialog
document.getElementById('cancel').addEventListener('click', () => dialog.close());
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());

// Não fechar o dialog ao clicar no backdrop (overlay).
// Antes havia um listener que chamava `dialog.close()` quando o alvo era o próprio dialog.
// Removemos esse comportamento para que o modal só feche pelos controles explícitos (Salvar, Cancelar, X).

// Além disso, prevenir o evento `cancel` evita que a tecla ESC feche o modal.
dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        // Garante que sempre use os dados mais recentes de allCars
        // Se allCars estiver vazio ou desatualizado, recarrega
        if (!allCars || allCars.length === 0) {
            loadCars();
        } else {
            renderCars(allCars);
        }
    });
});

// Search
el('search-input').addEventListener('input', () => {
    renderCars(allCars);
});

// Form submit
form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = {
        make: form.make.value.trim(),
        model: form.model.value.trim(),
        year: form.year.value ? parseInt(form.year.value) : null,
        price: form.price.value ? parseFloat(form.price.value) : null,
        category: form.category.value || 'luxury',
        featured: form.featured.value === 'true',
        description: form.description.value.trim() || null
    };
    
    // Só inclui brand_logo se foi preenchido explicitamente
    // Se estiver vazio, não envia o campo (backend preserva o valor original)
    const brandLogoValue = form.brand_logo.value.trim();
    if (brandLogoValue) {
        data.brand_logo = brandLogoValue;
    }
    
    // Validação cliente: marca, modelo e ano são obrigatórios
    if (!data.make || !data.model || data.year == null || Number.isNaN(data.year)) {
        showMessage('Campos Marca, Modelo e Ano são obrigatórios', 'error');
        return;
    }
    
    try {
        if (form.id.value) {
            await apiFetch(API_BASE + '?id=' + encodeURIComponent(form.id.value), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showMessage('Carro atualizado', 'success');
        } else {
            await apiFetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showMessage('Carro criado', 'success');
        }
        dialog.close();
        loadCars();
    } catch (err) {
        showMessage('Erro: ' + err.message, 'error');
    }
});

// Navegação do carrossel
if (featPrev) featPrev.addEventListener('click', () => scrollFeaturedBy(-1));
if (featNext) featNext.addEventListener('click', () => scrollFeaturedBy(1));
if (featuredGridEl) featuredGridEl.addEventListener('scroll', updateFeaturedCarouselButtons);

// Pausa ao interagir com o carrossel
if (featuredGridEl) {
    featuredGridEl.addEventListener('mouseenter', stopFeaturedAutoplay);
    featuredGridEl.addEventListener('mouseleave', startFeaturedAutoplay);
}

// Pausa quando a aba fica oculta
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopFeaturedAutoplay(); else startFeaturedAutoplay();
});

// ==================== Inicialização ====================

// Aguarda o DOM estar completamente carregado antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadCars();
    });
} else {
    // DOM já está carregado
    loadCars();
}

