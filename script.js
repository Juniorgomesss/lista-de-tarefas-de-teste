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

// --- API DE COTAÇÃO ---
// A palavra 'async' avisa que essa função tem partes que demoram (ir na internet)
async function buscarCotacao() {
    try{
// 1. Chamar o garçom (fetch) e esperar (await) ele voltar com a resposta
        const resposta = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
        
        // 2. Transformar a resposta (que vem em texto) em JSON (Objeto JS)
        const dados = await resposta.json();

        // 3. Pegar os valores que queremos
        // A API devolve algo como: dados.USDBRL.high (Valor alto do dia)
        const dolar = dados.USDBRL.high;
        const euro = dados.EURBRL.high;

        // 4. Jogar na tela (arredondando para 2 casas decimais)
        // O parseFloat transforma texto em número para podermos usar o .toFixed(2)
        document.getElementById('valor-dolar').innerText = parseFloat(dolar).toFixed(2);
        document.getElementById('valor-euro').innerText = parseFloat(euro).toFixed(2);

        console.log("Cotações atualizadas!");

    } catch (erro) {
        // Se a internet cair ou o site estiver fora do ar, avisa no console
        console.error("Erro ao buscar cotação:", erro);
        document.getElementById('info-cotacao').innerText = "Erro ao carregar cotações";
    }
}

// Chamar a função assim que o código carregar
buscarCotacao();
