import { ebooks } from "./data.js";

/* ========================= */
/* INICIALIZAÇÃO */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
    criarNavbarScroll();
    renderDestaques();
    renderCatalogo();

    // Inicializar ícones do Lucide (se houver)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Configurar eventos dos botões de detalhes (serão adicionados após render)
    configurarBotoesDetalhes();
});

/* ========================= */
/* NAVBAR */
/* ========================= */

function criarNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("py-2");
            navbar.classList.remove("py-4");
        } else {
            navbar.classList.add("py-4");
            navbar.classList.remove("py-2");
        }
    });
}

/* ========================= */
/* CARDS DE EBOOK */
/* ========================= */

function criarCard(ebook) {
    // Escapar aspas da descrição longa para não quebrar o HTML
    const longDescEscaped = ebook.longDescription.replace(/"/g, '&quot;');
    return `
        <div class="bg-brand-black border border-white/10 rounded-xl p-4 hover:scale-105 transition">
            <img loading="lazy" src="${ebook.image}" alt="${ebook.title}" class="rounded mb-4">
            <h3 class="text-brand-white font-bold text-lg mb-2">${ebook.title}</h3>
            <p class="text-brand-gray text-sm mb-4">${ebook.description}</p>
            <p class="text-brand-gold font-bold mb-4">${ebook.price}</p>
            <button class="btn-detalhes-ebook w-full mb-2 flex items-center justify-center gap-2 bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition" 
                data-titulo="${ebook.title}" data-descricaolongaa="${longDescEscaped}">
                <i data-lucide="info"></i> Ver detalhes
            </button>
            <a href="${ebook.hotmartLink}" target="_blank" 
               class="block text-center bg-brand-gold text-black py-2 rounded font-bold hover:bg-brand-goldlight transition">
                Comprar
            </a>
        </div>
    `;
}

/* ========================= */
/* DESTAQUES (MAIS VENDIDOS) */
/* ========================= */

function renderDestaques() {
    const grid = document.getElementById("destaques-grid");
    if (!grid) return;

    const best = ebooks.filter(e => e.bestseller).slice(0, 3); // apenas 3 para a grade de 3 colunas
    grid.innerHTML = best.map(criarCard).join("");
}

/* ========================= */
/* CATÁLOGO COMPLETO */
/* ========================= */

function renderCatalogo() {
    const grid = document.getElementById("catalogo-grid");
    if (!grid) return;

    grid.innerHTML = ebooks.map(criarCard).join("");
}

/* ========================= */
/* MODAL DE DETALHES */
/* ========================= */

function configurarBotoesDetalhes() {
    // Adiciona evento a todos os botões existentes (inclusive os que serão criados)
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-detalhes-ebook');
        if (!btn) return;

        e.preventDefault();

        const titulo = btn.getAttribute('data-titulo');
        const descricaoLonga = btn.getAttribute('data-descricaolongaa') || 'Descrição detalhada em breve.';

        // Atualizar modal
        const modal = document.getElementById('modalDetalhesEbook');
        const tituloElem = document.getElementById('detalheTitulo');
        const descricaoElem = document.getElementById('detalheDescricao');

        if (modal && tituloElem && descricaoElem) {
            tituloElem.textContent = titulo;
            descricaoElem.textContent = descricaoLonga;
            modal.style.display = 'flex';
        }
    });

    // Fechar modal
    const fecharModal = document.getElementById('fecharModalDetalhes');
    if (fecharModal) {
        fecharModal.addEventListener('click', () => {
            document.getElementById('modalDetalhesEbook').style.display = 'none';
        });
    }

    // Fechar ao clicar fora
    const modal = document.getElementById('modalDetalhesEbook');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}
