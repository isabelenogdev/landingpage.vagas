// =========================================
// ESTÁGIO+ - SCRIPT.JS
// =========================================

// ---------- CONFIGURAÇÕES ----------

const STORAGE_KEY = "estagioPlus_vagas";

let vagas = [];
let vagaSelecionada = null;


// ---------- ELEMENTOS DO DOM ----------

const vacancyForm = document.getElementById("vacancyForm");
const vacancyTableBody = document.getElementById("vacancyTableBody");

const vacancyModal = document.getElementById("vacancyModal");
const applicationForm = document.getElementById("applicationForm");

const modalJobTitle = document.getElementById("modalJobTitle");
const modalCompanyName = document.getElementById("modalCompanyName");


// ---------- VAGAS INICIAIS ----------

const vagasIniciais = [
    {
        id: 1,
        empresa: "Tech Solutions",
        vaga: "Estagiário de Desenvolvimento",
        area: "Tecnologia",
        localizacao: "Fortaleza - CE",
        modalidade: "Híbrido",
        bolsa: "R$ 1.200,00",
        cargaHoraria: "30h semanais",
        descricao: "Auxiliar no desenvolvimento e manutenção de sistemas web.",
        requisitos: "Conhecimentos básicos em HTML, CSS e JavaScript.",
        email: "rh@techsolutions.com"
    },
    {
        id: 2,
        empresa: "Agência Criativa",
        vaga: "Estagiário de Design",
        area: "Design",
        localizacao: "Fortaleza - CE",
        modalidade: "Presencial",
        bolsa: "R$ 900,00",
        cargaHoraria: "20h semanais",
        descricao: "Apoiar a criação de peças gráficas e conteúdos para redes sociais.",
        requisitos: "Conhecimento básico em ferramentas de edição.",
        email: "vagas@agenciacriativa.com"
    },
    {
        id: 3,
        empresa: "Grupo Nordeste",
        vaga: "Estagiário Administrativo",
        area: "Administração",
        localizacao: "Fortaleza - CE",
        modalidade: "Presencial",
        bolsa: "R$ 1.000,00",
        cargaHoraria: "30h semanais",
        descricao: "Auxiliar nas atividades administrativas e organização de documentos.",
        requisitos: "Boa comunicação e conhecimento básico em informática.",
        email: "rh@gruponordeste.com"
    }
];


// ---------- INICIALIZAÇÃO ----------

document.addEventListener("DOMContentLoaded", () => {
    carregarVagas();
    atualizarEstatisticas();
    exibirVagas();

    configurarEventos();
});


// ---------- EVENTOS ----------

function configurarEventos() {

    // Formulário de cadastro de vaga
    if (vacancyForm) {
        vacancyForm.addEventListener("submit", cadastrarVaga);
    }

    // Formulário de candidatura
    if (applicationForm) {
        applicationForm.addEventListener("submit", enviarCandidatura);
    }

    // Fechar modal clicando fora
    if (vacancyModal) {
        vacancyModal.addEventListener("click", (event) => {

            if (event.target === vacancyModal) {
                fecharModal();
            }

            if (event.target.classList.contains("modal-overlay")) {
                fecharModal();
            }
        });
    }

    // Tecla ESC fecha o modal
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharModal();
        }
    });
}


// ---------- LOCAL STORAGE ----------

function carregarVagas() {

    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
        try {
            vagas = JSON.parse(dadosSalvos);
        } catch (erro) {
            console.error("Erro ao carregar vagas:", erro);
            vagas = [...vagasIniciais];
            salvarVagas();
        }
    } else {
        vagas = [...vagasIniciais];
        salvarVagas();
    }
}


function salvarVagas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vagas));
}


// ---------- CADASTRAR VAGA ----------

function cadastrarVaga(event) {

    event.preventDefault();

    const empresa = document.getElementById("empresa").value.trim();
    const vaga = document.getElementById("vaga").value.trim();
    const area = document.getElementById("area").value;
    const localizacao = document.getElementById("localizacao").value.trim();
    const modalidade = document.getElementById("modalidade").value;
    const bolsa = document.getElementById("bolsa").value.trim();
    const cargaHoraria = document.getElementById("cargaHoraria").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const requisitos = document.getElementById("requisitos").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validação
    if (
        !empresa ||
        !vaga ||
        !area ||
        !localizacao ||
        !modalidade ||
        !bolsa ||
        !cargaHoraria ||
        !descricao ||
        !requisitos ||
        !email
    ) {
        mostrarMensagem(
            "Preencha todos os campos obrigatórios.",
            "erro"
        );

        return;
    }

    // Validação simples de e-mail
    if (!validarEmail(email)) {

        mostrarMensagem(
            "Digite um e-mail válido.",
            "erro"
        );

        return;
    }

    // Criação da nova vaga
    const novaVaga = {

        id: Date.now(),

        empresa: empresa,

        vaga: vaga,

        area: area,

        localizacao: localizacao,

        modalidade: modalidade,

        bolsa: bolsa,

        cargaHoraria: cargaHoraria,

        descricao: descricao,

        requisitos: requisitos,

        email: email
    };

    // Adiciona a vaga no início da lista
    vagas.unshift(novaVaga);

    // Salva no navegador
    salvarVagas();

    // Atualiza a página
    exibirVagas();

    atualizarEstatisticas();

    // Limpa o formulário
    vacancyForm.reset();

    // Mensagem de sucesso
    mostrarMensagem(
        "Vaga publicada com sucesso!",
        "sucesso"
    );

    // Rola para a seção de vagas
    setTimeout(() => {

        const secaoVagas = document.getElementById("vagas");

        if (secaoVagas) {
            secaoVagas.scrollIntoView({
                behavior: "smooth"
            });
        }

    }, 800);
}


// ---------- EXIBIR VAGAS ----------

function exibirVagas() {

    if (!vacancyTableBody) {
        return;
    }

    vacancyTableBody.innerHTML = "";

    if (vagas.length === 0) {

        vacancyTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-10">
                    <div class="empty-icon">
                        <i class="fa-solid fa-briefcase"></i>
                    </div>

                    <p class="text-slate-500">
                        Nenhuma vaga disponível no momento.
                    </p>
                </td>
            </tr>
        `;

        return;
    }

    vagas.forEach((vaga) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>
                <strong>${escaparHTML(vaga.empresa)}</strong>
            </td>

            <td>
                ${escaparHTML(vaga.vaga)}
            </td>

            <td>
                ${escaparHTML(vaga.area)}
            </td>

            <td>
                ${escaparHTML(vaga.localizacao)}
            </td>

            <td>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    ${escaparHTML(vaga.modalidade)}
                </span>
            </td>

            <td>
                ${escaparHTML(vaga.bolsa)}
            </td>

            <td>
                <button
                    type="button"
                    class="apply-button"
                    onclick="abrirModal(${vaga.id})"
                >
                    Candidatar-se
                </button>
            </td>
        `;

        vacancyTableBody.appendChild(linha);
    });
}


// ---------- ABRIR MODAL ----------

function abrirModal(id) {

    const vaga = vagas.find(item => item.id === id);

    if (!vaga) {
        return;
    }

    vagaSelecionada = vaga;

    if (modalJobTitle) {
        modalJobTitle.textContent = vaga.vaga;
    }

    if (modalCompanyName) {
        modalCompanyName.textContent = vaga.empresa;
    }

    if (vacancyModal) {

        vacancyModal.classList.add("active");

        document.body.style.overflow = "hidden";
    }
}


// ---------- FECHAR MODAL ----------

function fecharModal() {

    if (!vacancyModal) {
        return;
    }

    vacancyModal.classList.remove("active");

    document.body.style.overflow = "";

    vagaSelecionada = null;

    if (applicationForm) {
        applicationForm.reset();
    }
}


// ---------- ENVIAR CANDIDATURA ----------

function enviarCandidatura(event) {

    event.preventDefault();

    if (!vagaSelecionada) {
        return;
    }

    const nome = document.getElementById("candidateName").value.trim();

    const email = document.getElementById("candidateEmail").value.trim();

    const telefoneElement = document.getElementById("candidatePhone");

    const telefone = telefoneElement
        ? telefoneElement.value.trim()
        : "";

    if (!nome || !email) {

        alert("Preencha seu nome e e-mail.");

        return;
    }

    if (!validarEmail(email)) {

        alert("Digite um e-mail válido.");

        return;
    }

    /*
       Como este projeto não possui backend,
       a candidatura é apenas simulada.
    */

    const candidatura = {

        id: Date.now(),

        vagaId: vagaSelecionada.id,

        vaga: vagaSelecionada.vaga,

        empresa: vagaSelecionada.empresa,

        candidato: nome,

        email: email,

        telefone: telefone,

        data: new Date().toISOString()
    };

    console.log("Candidatura realizada:", candidatura);

    alert(
        `Candidatura enviada com sucesso!\n\n` +
        `Vaga: ${vagaSelecionada.vaga}\n` +
        `Empresa: ${vagaSelecionada.empresa}`
    );

    fecharModal();
}


// ---------- ESTATÍSTICAS ----------

function atualizarEstatisticas() {

    const vagasDisponiveis =
        document.getElementById("vagasDisponiveis");

    const empresasCadastradas =
        document.getElementById("empresasCadastradas");

    const areasAtuacao =
        document.getElementById("areasAtuacao");

    if (vagasDisponiveis) {
        vagasDisponiveis.textContent = vagas.length;
    }

    if (empresasCadastradas) {

        const empresas = new Set(
            vagas.map(vaga => vaga.empresa)
        );

        empresasCadastradas.textContent = empresas.size;
    }

    if (areasAtuacao) {

        const areas = new Set(
            vagas.map(vaga => vaga.area)
        );

        areasAtuacao.textContent = areas.size;
    }
}


// ---------- VALIDAR E-MAIL ----------

function validarEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}


// ---------- MENSAGENS ----------

function mostrarMensagem(texto, tipo) {

    const mensagemSucesso =
        document.getElementById("successMessage");

    const mensagemErro =
        document.getElementById("errorMessage");

    if (mensagemSucesso) {
        mensagemSucesso.style.display = "none";
    }

    if (mensagemErro) {
        mensagemErro.style.display = "none";
    }

    if (tipo === "sucesso" && mensagemSucesso) {

        mensagemSucesso.textContent = texto;

        mensagemSucesso.style.display = "block";

        setTimeout(() => {
            mensagemSucesso.style.display = "none";
        }, 5000);
    }

    if (tipo === "erro" && mensagemErro) {

        mensagemErro.textContent = texto;

        mensagemErro.style.display = "block";

        setTimeout(() => {
            mensagemErro.style.display = "none";
        }, 5000);
    }
}


// ---------- LIMPAR VAGAS ----------

function limparVagas() {

    const confirmar = confirm(
        "Tem certeza que deseja apagar todas as vagas?"
    );

    if (!confirmar) {
        return;
    }

    vagas = [];

    salvarVagas();

    exibirVagas();

    atualizarEstatisticas();
}


// ---------- RESTAURAR VAGAS DE EXEMPLO ----------

function restaurarVagasIniciais() {

    const confirmar = confirm(
        "Deseja restaurar as vagas de exemplo?"
    );

    if (!confirmar) {
        return;
    }

    vagas = [...vagasIniciais];

    salvarVagas();

    exibirVagas();

    atualizarEstatisticas();
}


// ---------- PROTEÇÃO CONTRA HTML ----------

function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ---------- MÁSCARA DE TELEFONE ----------

const telefoneInput =
    document.getElementById("candidatePhone");

if (telefoneInput) {

    telefoneInput.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "");

        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }

        if (valor.length <= 10) {

            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                "($1) $2-$3"
            );

        } else {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{0,4})$/,
                "($1) $2-$3"
            );
        }

        this.value = valor;
    });
}


// ---------- MENU MOBILE ----------

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("hidden");

    });
}


// ---------- EXPORTAÇÃO GLOBAL ----------
// Permite que os botões HTML chamem essas funções.

window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.limparVagas = limparVagas;
window.restaurarVagasIniciais = restaurarVagasIniciais;
