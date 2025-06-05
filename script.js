// Arrays para armazenar usuários e seções
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
let professores = JSON.parse(localStorage.getItem('professores')) || [];
let secoes = JSON.parse(localStorage.getItem('secoes')) || [];

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('alunos', JSON.stringify(alunos));
    localStorage.setItem('professores', JSON.stringify(professores));
    localStorage.setItem('secoes', JSON.stringify(secoes));
}

// --------- LOGIN E CADASTRO ALUNO ---------
function cadastrarAluno() {
    const rm = document.getElementById('rmAluno').value;
    const email = document.getElementById('emailAluno').value;
    const login = document.getElementById('loginNovoAluno').value;
    const senha = document.getElementById('senhaNovoAluno').value;
    const ano = document.getElementById('anoAluno').value;

    if (rm.length !== 4) {
        alert("RM deve ter 4 dígitos.");
        return;
    }

    if (alunos.find(a => a.login === login)) {
        alert("Login já existe.");
        return;
    }

    alunos.push({ rm, email, login, senha, ano });
    salvarDados();
    alert("Aluno cadastrado!");
}

function loginAluno() {
    const login = document.getElementById('loginAluno').value;
    const senha = document.getElementById('senhaAluno').value;

    const aluno = alunos.find(a => a.login === login && a.senha === senha);
    if (aluno) {
        localStorage.setItem('usuarioLogado', JSON.stringify({ tipo: 'aluno', ...aluno }));
        window.location.href = 'aluno.html';
    } else {
        alert("Login ou senha inválidos.");
    }
}

// --------- LOGIN E CADASTRO PROFESSOR ---------
function cadastrarProfessor() {
    const email = document.getElementById('emailProf').value;
    const login = document.getElementById('loginNovoProf').value;
    const senha = document.getElementById('senhaNovoProf').value;
    const materia = document.getElementById('materiaProf').value;

    if (professores.find(p => p.login === login)) {
        alert("Login já existe.");
        return;
    }

    professores.push({ email, login, senha, materia });
    salvarDados();
    alert("Professor cadastrado!");
}

function loginProfessor() {
    const login = document.getElementById('loginProf').value;
    const senha = document.getElementById('senhaProf').value;

    const prof = professores.find(p => p.login === login && p.senha === senha);
    if (prof) {
        localStorage.setItem('usuarioLogado', JSON.stringify({ tipo: 'professor', ...prof }));
        window.location.href = 'professor.html';
    } else {
        alert("Login ou senha inválidos.");
    }
}

// --------- PERFIL E NAVBAR ---------
window.onload = function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerText = `Logado como: ${usuario.login}`;
        }
    }

    if (window.location.pathname.includes('professor.html')) {
        carregarSecoesProfessor();
    }
    if (window.location.pathname.includes('materia.html')) {
        carregarMateria();
    }
}
function Sair() {
    logout();
}

function abrirPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const info = document.getElementById('infoPerfil');
    const perfil = document.getElementById('perfil');

    let html = `<h2>Perfil</h2>`;
    for (let key in usuario) {
        if (key !== 'tipo') {
            html += `<p><strong>${key}:</strong> ${usuario[key]}</p>`;
        }
    }
    html += `<button onclick="logout()">Sair</button>`;

    info.innerHTML = html;
    perfil.style.display = 'flex';
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// --------- ALUNO: ENTRAR NA MATÉRIA ---------
function entrarMateria(materia) {
    localStorage.setItem('materiaAtual', materia);
    window.location.href = 'materia.html';
}

// --------- PROFESSOR: ADICIONAR SEÇÃO ---------
function adicionarSecao() {
    const nome = document.getElementById('nomeSecao').value;
    const conteudo = document.getElementById('conteudoSecao').value; // Novo campo para conteúdo
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!nome || !conteudo) {
        alert("Digite um nome e um conteúdo para a seção.");
        return;
    }

    secoes.push({ nome, conteudo, materia: usuario.materia });
    salvarDados();
    alert("Seção adicionada!");
    carregarSecoesProfessor();
}

function carregarSecoesProfessor() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const container = document.getElementById('cardsSecoes');
    if (!container) return;

    const minhasSecoes = secoes.filter(s => s.materia === usuario.materia);

    container.innerHTML = '';
    minhasSecoes.forEach(s => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<div class="title">${s.nome}</div>`;
        container.appendChild(div);
    });
}

// --------- MATÉRIA: CARREGAR CONTEÚDO ---------
function carregarMateria() {
    const materia = localStorage.getItem('materiaAtual');
    let titulo = '';
    let sessoesFixas = [];

    switch (materia) {
        case 'portugues':
            titulo = 'Língua Portuguesa';
            sessoesFixas = ['Gramática', 'Ortografia', 'Interpretação de Texto'];
            break;
        case 'matematica':
            titulo = 'Matemática';
            sessoesFixas = ['Números e Operações', 'Geometria', 'Álgebra'];
            break;
        case 'fisica':
            titulo = 'Física';
            sessoesFixas = ['Mecânica', 'Termodinâmica', 'Eletromagnetismo'];
            break;
        case 'geografia':
            titulo = 'Geografia';
            sessoesFixas = ['Geografia Física', 'Geografia Humana', 'Cartografia'];
            break;
        case 'biologia':
            titulo = 'Biologia';
            sessoesFixas = ['Genética', 'Ecologia', 'Anatomia'];
            break;
        case 'quimica':
            titulo = 'Química';
            sessoesFixas = ['Química Orgânica', 'Química Inorgânica', 'Físico-Química'];
            break;
        default:
            titulo = 'Matéria Desconhecida';
            sessoesFixas = [];
    }

    document.getElementById('tituloMateria').innerText = titulo;

    const sessoesMateria = secoes.filter(s => s.materia === materia);

    let conteudo = '';
    sessoesMateria.forEach(secao => {
        conteudo += `
            <div class="card" onclick="exibirConteudo('${secao.nome}', '${secao.conteudo}')">
                <div class="title">${secao.nome}</div>
            </div>`;
    });

    document.getElementById('sessoes').innerHTML = conteudo;
    }

    function exibirConteudo(nome, conteudo) {
        alert(`Título: ${nome}\nConteúdo: ${conteudo}`);
    }

// --------- FECHAR PERFIL ---------
window.addEventListener('click', function (e) {
    const perfil = document.getElementById('perfil');
    if (perfil && perfil.style.display === 'flex' && e.target === perfil) {
        perfil.style.display = 'none';
    }
});
function exibirConteudo(nome, conteudo) {
    const modal = document.getElementById('conteudoModal');
    const titulo = document.getElementById('modalTitulo');
    const texto = document.getElementById('modalConteudo');

    titulo.innerText = nome;
    texto.innerText = conteudo;

    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('conteudoModal');
    modal.style.display = 'none';
}
