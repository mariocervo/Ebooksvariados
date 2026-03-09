import { categories, ebooks, testimonials } from "./data.js";

/* ========================= */
/* INICIALIZAÇÃO */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {

criarNavbarScroll();
renderDestaques();
renderCatalogo();
renderDepoimentos();
iniciarSistemaAvaliacoes();
iniciarComentarios();

});

/* ========================= */
/* NAVBAR */
/* ========================= */

function criarNavbarScroll(){

const navbar = document.getElementById("navbar");

if(!navbar) return;

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

navbar.classList.add("py-2");
navbar.classList.remove("py-4");

}else{

navbar.classList.add("py-4");
navbar.classList.remove("py-2");

}

});

}

/* ========================= */
/* CARDS DE EBOOK */
/* ========================= */

function criarCard(ebook){

return `
<div class="ebook-card">

<img loading="lazy" src="${ebook.image}" alt="${ebook.title}">

<h3>${ebook.title}</h3>

<p>${ebook.description}</p>

<span>${ebook.price}</span>

<a href="${ebook.hotmartLink}" target="_blank">Comprar</a>

</div>
`;

}

/* ========================= */
/* DESTAQUES */
/* ========================= */

function renderDestaques(){

const grid = document.getElementById("destaques-grid");

if(!grid) return;

const best = ebooks.filter(e => e.bestseller);

grid.innerHTML = best.map(criarCard).join("");

}

/* ========================= */
/* CATÁLOGO */
/* ========================= */

function renderCatalogo(categoria="todos"){

const grid = document.getElementById("catalogo-grid");

if(!grid) return;

let lista = ebooks;

if(categoria !== "todos"){

lista = ebooks.filter(e => e.category === categoria);

}

grid.innerHTML = lista.map(criarCard).join("");

}

/* ========================= */
/* DEPOIMENTOS */
/* ========================= */

function renderDepoimentos(){

const grid = document.getElementById("depoimentos-grid");

if(!grid) return;

grid.innerHTML = testimonials.map(t => `

<div class="depoimento">
<h4>${t.name}</h4>
<p>${t.text}</p>
⭐ ${t.rating}
</div>

`).join("");

}

/* ========================= */
/* SISTEMA DE AVALIAÇÕES */
/* ========================= */

function iniciarSistemaAvaliacoes(){

const modal = document.getElementById("reviewModal");
const open = document.getElementById("openReview");
const send = document.getElementById("enviarReview");

let rating = 0;

if(open){

open.onclick = () => {

modal.style.display="flex";

};

}

document.querySelectorAll(".stars span").forEach(star => {

star.onclick = () => {

rating = star.dataset.star;

};

});

if(send){

send.onclick = () => {

const nome = document.getElementById("nome").value;
const comentario = document.getElementById("comentario").value;

let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

reviews.push({nome, comentario, rating});

localStorage.setItem("reviews", JSON.stringify(reviews));

alert("Avaliação enviada!");

modal.style.display="none";

};

}

}

/* ========================= */
/* COMENTÁRIOS */
/* ========================= */

function iniciarComentarios(){

const modal = document.getElementById("modalAvaliar");
const btn = document.getElementById("btnAvaliar");
const enviar = document.getElementById("enviarComentario");

let nota = 0;

if(btn){

btn.onclick = () => {

modal.style.display="flex";

};

}

document.querySelectorAll(".stars span").forEach(star => {

star.onclick = () => {

nota = star.dataset.star;

};

});

if(enviar){

enviar.onclick = () => {

const nome = document.getElementById("nomeUsuario").value;
const texto = document.getElementById("comentarioUsuario").value;

let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

comentarios.push({
nome,
texto,
nota,
aprovado:false
});

localStorage.setItem("comentarios", JSON.stringify(comentarios));

alert("Comentário enviado!");

modal.style.display="none";

};

}

carregarComentarios();

}

/* ========================= */
/* CARREGAR COMENTÁRIOS */
/* ========================= */

function carregarComentarios(){

let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

const container = document.getElementById("depoimentos-grid");

if(!container) return;

comentarios.forEach(c => {

if(c.aprovado){

const div = document.createElement("div");

div.innerHTML = `
<h4>${c.nome}</h4>
<p>${c.texto}</p>
⭐ ${c.nota}
`;

container.appendChild(div);

}

});

}