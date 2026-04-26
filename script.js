// HELPERS

// Essa função auxilia na seleção de UM elemeto da DOM 
// (equivalente a document.querySelector()).
function qs(selector, root = document) {
    // root permite limitar a busca dentro de um elemento específico.
    return root.querySelector(selector);
};

// Função auxiliar que permite a seleção de vários elementos
// querySelectorAll = retorna a lista
// Array.from = transforma em lista
function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
};

// ---------- MENU HAMBURGUER -----------

// Selecionando o botão do menu (abre/fecha)
const menuBtn = qs("#menuBtn");

// Seleciona o conteiner do menu
const menu = qs("#menu");

// Seleciona todos os links de dentro do menu
const navLinks = qsa(".nav__link");

// Função responsável pela abertura e fechamento
// do menu
function setMenuOpen(isOpen) {
    // Adiciona e remove a classe "is-open"
    menu.classList.toggle("is-open", isOpen);

    // Indica o menu expandido
    menuBtn.setAttribute("aria-expanded", String(isOpen));

    //Atualiza o texto acessível do botão
    menuBtn.setAttribute(
        "aria-label", 
        isOpen ? "Fechar menu" : "Abrir menu" );
};

// Adicionando o evento de click no botão
menuBtn.addEventListener("click", () => {
    // Verifica se o menu já está aberto
    const isOpen = menu.classList.contains("is-open");
    // Altera o estado do menu
    setMenuOpen(!isOpen);
});

// Fecha o menu quando o usuário clica em um link
navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
});

// --------------- MOSTRAR/OCULTAR DETALHES ------------

// Controla a visibilidade
const toggleInfoBtn = qs("#toggleInfoBtn");

// Área de detalhes que será exibida e ocultada
const infoBox = qs("#infoBox");

function setInfoOpen(isOpen) {
    // hidden = true (esconde)
    // hidden = false (mostra)
    infoBox.hidden = !isOpen;

    // Altera o atributo de acessibilidade
    toggleInfoBtn.setAttribute("aria-expanded", String(isOpen));

    // Atualiza o texto do botão
    toggleInfoBtn.textContent = isOpen ?
    "Ocultar detalhes" : "Mostrar detalhes";
};
// Evento de clique no botão
toggleInfoBtn.addEventListener("click", () => {
    // Se estava oculto, passa a estar visível
    setInfoOpen(infoBox.hidden);
});

// ------------- TROCAR DE TEXTO ----------------

const changeTextBtn = qs("#changeTextBtn");
const changeTextTarget = qs("#changeTextTarget");

let change = false;

changeTextBtn.addEventListener("click", () => {
    // inverte o valor da própria variável
    change = !change;

    // se for verdadeiro, a primeira opção é chamada
    // se for falso, a segundo opção é chamada
    changeTextTarget.textContent = change ?
    "Texto alterado via JavaScript" : "Texto original do card.";
});

// -------- AREA EM DESTAQUE COM CLIQUE -------

// Botão que ativa o destaque
const highlightBtn = qs("#highlightBtn");

// Elemento que recberá o destaque
const highlightBox = qs("#highlightBox");

// Evento de clique
highlightBtn.addEventListener("click", () => {
    // Altera a classe CSS
    const isHighlighted = highlightBox.classList.toggle("is-highlighted");
    // Atualiza o atributo de acessibilidade
    highlightBtn.setAttribute("aria-pressed", String(isHighlighted));
});

// ---------- MODAL ---------------

// Botões e Elementos do Modal
const openModalBtn = qs("#openModalBtn");
const modalOverlay = qs("#modalOverlay");
const modal = qs("#modal");
const closeModalBtn = qs("#closeModalBtn");
const confirmBtn = qs("#confirmBtn");
const cancelBtn = qs("#cancelBtn");


// Guarda o elemento que estava em foco
let lastFocusedElement = null;

// Função para encontrar elementos focáveis
function getFocusableElments(container) {

    const selectors = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textare:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ];

    return qsa(selectors.join(","), container).filter((el) => !el.hidden);
};

// Função de abrir o Modal
function openModal() {

    // salvar o Elemento tinha foco antes de abrir o modal
    // Estamos guarando na varivel o Elemento que esta focado no momento 
    lastFocusedElement = document.activeElement;

    // Mostrar o Overlay (fundo escuro atras do modal)
    // hidden = false torna o elemento visivel
    modalOverlay.hidden = false;

    // Move o foco do teclado para o modal
    //Isso garante  que o foco esteja dentro do modal para navegação com o tab
    modal.focus();

    // Adiciona um listener global para o evento "keydown"
    // Este listener vai "prender" o foco dentro do modal
    // Quando usuario aperta o tab, o foco não sai do modal
    document.addEventListener("keydown", trapFocushandler);
};

function closeModal() {

    // Esconde o overlay (fundo escuro);
    // hidden = true torna o elemento invisivel 
    modalOverlay.hidden = true;

    // Remover o evento global do "keydown"
    // Para que o focus trapping para de funcionar quando o modal fechar
    document.removeEventListener("keydown", trapFocushandler);

    // Retorna o foco para o elemento que ja estava focado antes de abrir o modal
    // verifiando se existe ainda tem o método focus()
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    };
};

// função serve para prrender o foco dentro do modal (focus trap)
// impede que o ususario navegue fora do modal com o tab
// O parametro 'e' é um objeto dentro fo evento keydown
function trapFocushandler(e) {

    // Se precisonar o ESC, fecha o modal imediatamente 
    if (e.key === 'Escape') {
        closeModal();
        return;
    };

    // So nos interessa a tecla  tab (para navegação)
    // ignorar as outras teclas 
    if (e.key !== "Tab") return;

    // Obter a lisa de elementos focaveis dentro do modal
    const focusables = getFocusableElments(modal);

    // Se não houver  elementos focaveis, ele não faz nada
    if (focusables.length === 0) return;

    // Idenfica o primeiro e ultimo elemento focaveis 
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Se estiver no primeiro elemento e precionar Shift+Tab (navegação reversa)
    // Move o foco para o ultimo elemento
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefautlt(); // Impede  comportamento padrão 
        last.focus(); // move ára o ultimo elemento
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefautlt();// Impede  comportamento padrão 
        first.focus();// mover o focus para o primeiro elemento
    };

    // caso o contrario, permit navegação normal entre os elementos focaveis
};

// Eventos do Modal 
// Tem um evento de clicar no batão para abrir o modal
openModalBtn.addEventListener("click", openModal);

// Tem o evento de ao clicar mp botão fechar o modal
closeModalBtn.addEventListener("click", closeModal);

// Evento de quando clica no X (fechar) dentro do modal, ele fecha o modal
cancelBtn.addEventListener("click", closeModal);

// Evento de clique no botão confirma dentro do modal 
// Mostra o alerta de confirmação e depois fecha o modal
confirmBtn.addEventListener("click", () => {
    alert("Confirmado ! (exemplo de ação do Modal)");
    closeModal();
});

// Evento de clique no Overlay ( fundo escuro atras do modal)
//Permitir fechar o modall clicando fora dele 
modalOverlay.addEventListener("click", (e) => {
    // verifica se o clique foi exatamente no overlay e não outros elementos 
    // e.target é o elemento clicado 
    // se for igual modalOverlay, ele fecha o modal
    if (e.target === modalOverlay) closeModal();
});


// ------------ TAB (ABAS) ------------

// Selecionar o container das tabs usando o atributo data-tabs
// Permitir identificar sem depender de classes especificas 
// ex: <div class="tabs" data-tabs>....</div>
const tabsRoot = qs("[data-tabs]");

// Só executa se o container existir ( evitar erros se removeram do html)
if (tabsRoot) {

    // Seleciona todos os botões de tab ( pelo role="tab" para acessibilidade)
    const tabs = qsa("[role='tab']", tabsRoot);

    // Selecionar todos os paineis de conteudo (role="tabpanel")
    const panels = qsa("[role='tabpanel']", tabsRoot);

    // Função principal : ativa uma aba especifica e desativa as autras
    //Parâmetro 'tabToActivate': elemento button da aba a ser ativada 
    function activateTab(tabToActivate) {
        tabs.forEach((tab) => {

            // verifica se este botão é o queremos ativar
            const isActive = tab === tabToActivate;

            // muda a Classe css para destacar visualmente a aba ativa 
            tab.classList.toggle("is-active", isActive);

            // Atributo  ARIA para acessibilidade: indica qual aba está selecionada
            // aria-selected="true" na aba ativa, "false " nas outras
            tab.setAttribute("aria-selected", String(isActive));
        });

        panels.forEach((panel) => {
            // Cada aba aponta para o seu painel via atributo aria-controls
            // ex: aria-controls="panel-2" significa que controla o elemento com o id="panel-2"
            const idDoPainel = tabToActivate.getAttribute("aria-controls");

            // Mostrar apenas o painel cujo o ID correspondente ao aria-controls da aba ativa
            // hidden-true esconde, hidden - false mostra
            panel.hidden = panel.id !== idDoPainel;
        });

    };

    // adiciona o evento de clique em cada aba
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            activateTab(tab);
        });
    });


    tabsRoot.addEventListener("keydown", (e) => {
        // Ignora se não setas
        if(!["ArrowLeft", "ArrowRight"].includes(e.key)) return;

        // Encontrando o indice da aba ativa
        const activeIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");

        const direction = e.key === "ArrowRight" ? 1 : -1

        // Calcula o próximo indice
        let nextIndex = activeIndex + direction;

        // se passar do início, voltará para a última aba
        if (nextIndex < 0) nextIndex = tabs.length -1;

        // Se passar do final, volta para a primeira aba
        if (nextIndex >= tabs.length) nextIndex = 0;

        // Move o foco do teclado para a próxima aba
        tabs[nextIndex].focus();

        // Ativa a próxima aba (e troca o painel)
        activateTab(tabs[nextIndex]);
    });
};

// ------------ CARROSSEL -------------

// Seleciona o container do carrossel usando 
// o data-carousel
const carouselRoot = qs("[data-carousel]");

// Se existir o carrossel
if (carouselRoot) {

    const slides = qsa(".slide", carouselRoot);
    const prevBtn = qs("[data-prev]", carouselRoot);
    const nextBtn = qs("[data-next]", carouselRoot);
    const dots = qsa("[data-dot]", carouselRoot);
    const currentE1 = qs("[data-current]", carouselRoot);
    const totalE1 = qs("[data-total]", carouselRoot);

    let index = 0;

    totalE1.textContent = String(slides.length);

    // função para renderizar nosso carrossel.
    function renderCarousel() {
        // Mostra apenas o slide do indice, escondendo
        // os outros
        slides.forEach((slide, i) => {
            // Será true apenas para o slide ativo
            const isActive = i === index;

            // serve para esconder e mostrar os slides
            slide.hidden = !isActive;

            // classe CSS para destacar o slide ativo
            slide.classList.toggle("is-active", isActive);
        });

        // Atualizar as bolinhas do carrossel
        dots.forEach((dot, i) => {

            // ativa apenas a bolinha do slide atual
            const isActive = i === index;

            // classe do CSS para mostrar a bolinha ativa
            dot.classList.toggle("is-active", isActive);

            // Acessibilidade
            dot.setAttribute("aria-pressed", String(isActive));
        });

        // Atualizando o contador de slides
        currentE1.textContent = String(index+1);
    };

    // função para exibir o proximo slide
    function next() {
        // Soma 1 e utiliza o módulo (%) para voltar ao 0
        index = (index + 1) % slides.length;
        renderCarousel();
    };

    function prev() {
        index = (index - 1 + slides.length) % slides.length;
        renderCarousel();
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Clique nas bolinhas do carrossel
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {

            const target = Number(dot.getAttribute("data-dot"));

            if (!Number.isNaN(target)) {
                index = target;
                renderCarousel();
            };
        });
    });
    // Render inicial: garante que só 1 slide apareça ao carregar
    renderCarousel();
};

// -------------- REQUISICAO + RENDERIZAÇÃO --------------
const loadUsersBtn = qs("#loadUsersBtn");
const clearUsersBtn = qs("#clearUsersBtn");
const apiStatus = qs("#apiStatus");
const usersList = qs("#usersList");

function clearUsersUI() {
    usersList.innerHTML = "";
    apiStatus.textContent = "";
};

function renderUsers(users) {
    usersList.innerHTML = "";

    // Para cada usuário, cria um <li> e coloca em lista
    users.forEach((user) => {
        const li = document.createElement("li");

        li.innerHTML = `
        <strong>${user.name}</strong><br>
        <span class="muted">${user.email}</span>
        `;

        usersList.appendChild(li);
    });
};

async function loadUsers() {
    try {
        // Reposta rápida pro usuário
        apiStatus.textContent = "Carregando usuários..."
        loadUsersBtn.disabled = true;

        // Requisição da API
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        };

        // Conversão para o JSON(array de usuários)
        const users = await response.json();

        // Renderiza na tela
        renderUsers(users);

        //Mensagem final:
        apiStatus.textContent = `"Carregado com sucesso: ${users.length} usuários"`;

    } catch (error) {
        apiStatus.textContent = "Falha ao carregar os usuários. Tente novamente.";
        console.error(error);
    } finally {
        // Reabilitar o botão
        loadUsersBtn.disabled = false;
    }
};

loadUsersBtn.addEventListener("click", loadUsers);
clearUsersBtn.addEventListener("click", clearUsersUI);

// ---------- VOLTAR AO TOPO ---------------

const backToTopBtn = qs("#backToTopBtn");

// Ao clicar, faz a escrolagem da pagina até o topo
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0, //posição do topo
        behavior: "smooth" //efeito de rolagem suave
    });
});