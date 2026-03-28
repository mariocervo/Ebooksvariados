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

    // Configurar eventos dos botões de compartilhamento (serão adicionados após render)
    configurarBotoesCompartilhar();
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
    // Adiciona um ID único ao card para link direto (ex: #ebook-1)
    return `
        <div id="ebook-${ebook.id}" class="bg-brand-black border border-white/10 rounded-xl p-4 hover:scale-105 transition">
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
            <!-- NOVO BOTÃO COMPARTILHAR -->
            <button class="btn-compartilhar-ebook w-full mt-2 flex items-center justify-center gap-2 bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition"
                data-id="${ebook.id}" data-titulo="${ebook.title}" data-descricao="${ebook.description}" data-imagem="${ebook.image}">
                <i data-lucide="share-2"></i> Compartilhar
            </button>
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

/* ========================= */
/* MODAL DE COMPARTILHAR */
/* ========================= */

// URL base do site (para compartilhamento)
const SITE_URL = 'https://mariocervo.github.io/Ebooksvariados/';

// Referências aos elementos do modal de compartilhar
const modalCompartilhar = document.getElementById('modalCompartilharEbook');
const fecharModalCompartilhar = document.getElementById('fecharModalCompartilhar');
const compartilharImagem = document.getElementById('compartilharImagem');
const compartilharTitulo = document.getElementById('compartilharTitulo');
const compartilharMensagemPreview = document.getElementById('compartilharMensagemPreview');

// Função para abrir modal de compartilhamento
function abrirCompartilhar(titulo, descricao, imagem, id) {
    if (!modalCompartilhar) return;

    // Preencher dados
    compartilharImagem.src = imagem;
    compartilharTitulo.textContent = titulo;

    // Construir link do ebook (âncora para o card)
    const link = SITE_URL + '#ebook-' + id;

    // Montar mensagem de prévia
    const mensagem = `Olá! Estou compartilhando este eBook escrito pelo Professor Mario G. S. de Carvalho. ${titulo} - ${descricao} Acesse pelo link: ${link}`;
    compartilharMensagemPreview.textContent = mensagem;

    // Armazenar dados para os botões de rede
    modalCompartilhar.dataset.titulo = titulo;
    modalCompartilhar.dataset.descricao = descricao;
    modalCompartilhar.dataset.imagem = imagem;
    modalCompartilhar.dataset.link = link;

    modalCompartilhar.style.display = 'flex';
}

// Função para compartilhar via rede específica
function compartilhar(rede) {
    const titulo = modalCompartilhar.dataset.titulo || '';
    const descricao = modalCompartilhar.dataset.descricao || '';
    const link = modalCompartilhar.dataset.link || '';

    const texto = `Olá! Estou compartilhando este eBook escrito pelo Professor Mario G. S. de Carvalho. ${titulo} - ${descricao} Acesse pelo link: ${link}`;
    const textoEncoded = encodeURIComponent(texto);
    const linkEncoded = encodeURIComponent(link);

    let url = '';

    switch (rede) {
        case 'whatsapp':
            url = `https://wa.me/?text=${textoEncoded}`;
            break;
        case 'gmail':
            url = `mailto:?subject=${encodeURIComponent('Compartilhamento de eBook')}&body=${textoEncoded}`;
            break;
        case 'instagram':
            // Instagram não suporta texto pré-preenchido via URL, abre a página inicial
            url = 'https://www.instagram.com/';
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${linkEncoded}&quote=${textoEncoded}`;
            break;
        case 'telegram':
            url = `https://t.me/share/url?url=${linkEncoded}&text=${textoEncoded}`;
            break;
        default:
            return;
    }

    window.open(url, '_blank');
}

// Configurar eventos dos botões de compartilhar
function configurarBotoesCompartilhar() {
    // Evento para abrir modal ao clicar em "Compartilhar"
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-compartilhar-ebook');
        if (!btn) return;

        e.preventDefault();

        const id = btn.getAttribute('data-id');
        const titulo = btn.getAttribute('data-titulo');
        const descricao = btn.getAttribute('data-descricao');
        const imagem = btn.getAttribute('data-imagem');

        abrirCompartilhar(titulo, descricao, imagem, id);
    });

    // Evento para fechar modal de compartilhar
    if (fecharModalCompartilhar) {
        fecharModalCompartilhar.addEventListener('click', () => {
            modalCompartilhar.style.display = 'none';
        });
    }

    // Fechar ao clicar fora
    if (modalCompartilhar) {
        modalCompartilhar.addEventListener('click', (e) => {
            if (e.target === modalCompartilhar) {
                modalCompartilhar.style.display = 'none';
            }
        });
    }

    // Eventos para botões de redes dentro do modal
    document.querySelectorAll('.btn-compartilhar-rede').forEach(btn => {
        btn.addEventListener('click', () => {
            const rede = btn.getAttribute('data-rede');
            compartilhar(rede);
        });
    });
}

// Renderizar cursos (se houver container, senão cria)
function renderCursos() {
    // ... (código existente, não alterado)
}

// Renderizar artigos (similar)
function renderArtigos() {
    // ... (código existente, não alterado)
}
