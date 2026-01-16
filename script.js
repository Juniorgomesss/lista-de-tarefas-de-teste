// Função principal chamada pelo botão
function adicionarTarefa() {
    const input = document.getElementById('input-tarefa');
    const tarefa = input.value;

    if (tarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // Chama a função que cria o visual
    criarElementoNaTela(tarefa);

    // Salva no banco de dados
    salvarDados();

    input.value = '';
}

// Função NOVA que só cuida de criar o HTML (usada ao adicionar e ao carregar)
function criarElementoNaTela(textoDaTarefa) {
    const lista = document.getElementById('lista-tarefas');
    const novoItem = document.createElement('li');

    // 1. O TEXTO
    const textoTarefa = document.createElement('span');
    textoTarefa.innerText = textoDaTarefa;
    
    // Evento de EDITAR
    textoTarefa.addEventListener('click', function() {
        const novoTexto = prompt('Edite sua tarefa', textoTarefa.innerText);
        if (novoTexto !== null && novoTexto !== '') {
            textoTarefa.innerText = novoTexto;
            salvarDados(); // <--- SALVAR APÓS EDITAR
        }
    });

    // 2. O BOTÃO DE EXCLUIR
    const botaoExcluir = document.createElement('button');
    botaoExcluir.innerText = "❌"; 
    botaoExcluir.style.marginLeft = "10px"; 

    // Evento de EXCLUIR
    botaoExcluir.addEventListener('click', function() {
        novoItem.remove();
        salvarDados(); // <--- SALVAR APÓS EXCLUIR
    });

    // 3. MONTAR TUDO
    novoItem.appendChild(textoTarefa);
    novoItem.appendChild(botaoExcluir);
    lista.appendChild(novoItem);
}

// Função que salva tudo o que está na tela no LocalStorage
function salvarDados() {
    const listaDeItens = document.querySelectorAll('#lista-tarefas li span');
    const arrayDeTarefas = [];

    listaDeItens.forEach(function(item) {
        arrayDeTarefas.push(item.innerText);
    });

    localStorage.setItem('minhasTarefas', JSON.stringify(arrayDeTarefas));
}

// Função que carrega os dados quando a página abre
function carregarDados() {
    // Pega o texto da mochila
    const tarefasSalvas = localStorage.getItem('minhasTarefas');

    // Se tiver algo lá dentro...
    if (tarefasSalvas) {
        // Transforma de volta em Array
        const arrayDeTarefas = JSON.parse(tarefasSalvas);

        // Para cada tarefa salva, recria o elemento na tela
        arrayDeTarefas.forEach(function(tarefa) {
            criarElementoNaTela(tarefa);
        });
    }
}

// --- ESCUTADORES GLOBAIS ---

// Carregar os dados assim que o script rodar
carregarDados();

// Tecla Enter
const inputDoUsuario = document.getElementById('input-tarefa');
inputDoUsuario.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});