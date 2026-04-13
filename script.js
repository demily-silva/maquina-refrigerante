// Variáveis de estado da máquina
let saldoAtual = 0.00;           // Acumula o valor das moedas inseridas
let produtoSelecionado = null;   // Armazena o objeto {nome, preco, imagem} do item escolhido
let aguardandoRetirada = false;  // Trava para impedir novas ações enquanto o produto está no dispenser

// ==========================================
// FUNÇÕES DE FEEDBACK VISUAL (UX)
// Melhoram a experiência do usuário indicando erros ou ações necessárias
// ==========================================

// Faz o texto do visor piscar em vermelho para indicar erro ou ação inválida
function piscarVisorVermelho() {
    const textoVisor = document.getElementById('texto-visor');
    if (textoVisor) {
        textoVisor.classList.add('texto-erro');
        setTimeout(() => textoVisor.classList.remove('texto-erro'), 150);
        setTimeout(() => textoVisor.classList.add('texto-erro'), 300);
        setTimeout(() => textoVisor.classList.remove('texto-erro'), 450);
    }
}

// Faz o texto "RETIRE AQUI" piscar no dispenser
function piscarRetireAqui() {
    const dispenser = document.getElementById('dispenser');
    dispenser.classList.add('alerta');
    // Para a animação depois de 600 milissegundos
    setTimeout(() => dispenser.classList.remove('alerta'), 600);
}


// ==========================================
// CARREGAR PRODUTOS DA API
// ==========================================
async function carregarRefri() {
    try {
        // Busca os dados no servidor remoto
        const response = await fetch('https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a');
        const data = await response.json();
        
        const vitrine = document.getElementById('vitrine');
        vitrine.innerHTML = "";  // Limpa a vitrine antes de inserir novos itens

        // Mapeia os dados da API para criar os elementos HTML de cada bebida
        data.record.bebidas.forEach((bebida, index) => {
            vitrine.innerHTML += `
                <div class="item" id="produto-${index}">
                    <img src="${bebida.imagem}" alt="${bebida.sabor}" style="max-height: 75px;" draggable="false">
                    <p style="font-size: 14px; margin: 2px 0;">${bebida.sabor}</p>
                    <button style="font-size: 13px; width: 100%;" onclick="selecionarProduto('${bebida.sabor}', ${bebida.preco}, '${bebida.imagem}', 'produto-${index}')">
                        R$ ${bebida.preco.toFixed(2)}
                    </button>
                </div>
            `;
        });
    } catch (erro) {
        // Se a API falhar, mostra uma mensagem na vitrine em vez de deixar em branco
        document.getElementById('vitrine').innerHTML = "<p style='color: white; padding: 20px;'>Erro ao carregar os produtos. Tente novamente mais tarde.</p>";
        console.error("Erro na API:", erro);
    }
}



// ==========================================
// LÓGICA DE SELEÇÃO DE PRODUTO
// ==========================================
function selecionarProduto(nome, preco, imagem, idHtml) {
    // Bloqueia nova seleção se já houver um produto liberado para retirada, forçando o usuário a retirar o produto antes de escolher outro
    if (aguardandoRetirada) {
        piscarRetireAqui(); 
        return; 
    }

    // Impede a troca de produto se o usuário já começou a colocar dinheiro
    if (saldoAtual > 0 && produtoSelecionado && produtoSelecionado.nome !== nome) {
        piscarVisorVermelho(); 
        return; 
    }

    // Efeito Visual: Remove destaque de todos e aplica apenas ao selecionado
    document.querySelectorAll('.item').forEach(el => el.classList.remove('destaque'));
    if (idHtml) {
        document.getElementById(idHtml).classList.add('destaque');
    }

    // Memoriza a escolha
    produtoSelecionado = { nome: nome, preco: preco, imagem: imagem };
    atualizarVisor();
}

// Atualiza a tela do visor
function atualizarVisor() {
    const visor = document.getElementById('visor');
    
    if (produtoSelecionado) {
        let falta = produtoSelecionado.preco - saldoAtual;
        // Se ainda não pagou tudo, mostra o quanto resta
        if (falta > 0) {
            visor.innerHTML = `
                <p id="texto-visor" style="font-size: 16px; text-align: center; width: 100%; line-height: 1.5;">
                    ${produtoSelecionado.nome}<br>
                    FALTA: <span style="color: #ff4444;">R$ ${falta.toFixed(2)}</span>
                </p>`;
        }
    } else {
        // Mensagem padrão de espera sem produto selecionado
        visor.innerHTML = `
            <p id="texto-visor" style="font-size: 16px; text-align: center; width: 100%; line-height: 1.5; color: #FFD700; transition: color 0.1s;">
                ESCOLHA UM<br>PRODUTO
            </p>`;
    }
}


// ==========================================
// LÓGICA DE INSERIR MOEDAS 
// ==========================================

// Quando o usuário começa a arrastar a moeda
function drag(event) {
    let valorDaMoeda = event.target.getAttribute("data-valor");
    // Armazena o valor da moeda no 'transfer' do navegador
    event.dataTransfer.setData("dinheiro", valorDaMoeda);
}

// Necessário para permitir que o elemento seja solto (Drop)
function allowDrop(event) {
    event.preventDefault();
}

// Quando a moeda é solta na fenda (entradaMoedas)
function drop(event) {
    event.preventDefault();
    
    // Se o refri já desceu, pisca o "Retire Aqui" impedindo mais moedas
    if (aguardandoRetirada) {
        piscarRetireAqui();
        return; 
    }
    
    // Obriga a escolha do produto antes de aceitar dinheiro
    if (!produtoSelecionado) {
        piscarVisorVermelho();
        return; 
    }
    
    // Recupera o valor que foi "transferido" no início do arrasto
    let valorRecebido = parseFloat(event.dataTransfer.getData("dinheiro"));
    saldoAtual += valorRecebido;
    
    // Verifica se o valor total já é suficiente para liberar o produto
    if (saldoAtual >= produtoSelecionado.preco) {
        let troco = saldoAtual - produtoSelecionado.preco;
        entregarProduto(produtoSelecionado.imagem, troco);
    } else {
        atualizarVisor();  // atualiza o saldo restante no visor
    }
}


// ==========================================
// FINALIZAÇÃO DA VENDA E LIBERAÇÃO
// ==========================================
function entregarProduto(imagemUrl, troco) {
    aguardandoRetirada = true; 

    const dispenser = document.getElementById('dispenser');
    const visor = document.getElementById('visor');

    // Cria a imagem do produto no dispenser com animação de queda
    dispenser.innerHTML = `
        <img src="${imagemUrl}" 
             style=" height: 80px; animation: cair 0.5s ease-in; cursor: pointer;  top: 35px;" 
             onclick="retirarProduto()"
             title="Clique para pegar a bebida!">
    `;

    // Lógica de cálculo e exibição de troco
    let mensagemTroco = troco > 0 ? `TROCO: R$ ${troco.toFixed(2)}` : `SEM TROCO`;
    
    // Exibe mensagem de sucesso
    visor.innerHTML = `
        <p id="texto-visor" style="font-size: 16px; text-align: center; width: 100%; line-height: 1.5; color: #00ff00;">
            ${produtoSelecionado.nome} LIBERADO!<br>
            ${mensagemTroco}
        </p>
    `;
}


// Reseta a máquina para uma nova venda após o usuário retirar o item
function retirarProduto() {
    const dispenser = document.getElementById('dispenser');
    dispenser.innerHTML = ""; 

    // Reseta as variáveis de estado
    saldoAtual = 0.00;
    produtoSelecionado = null;
    aguardandoRetirada = false; 
    
    // Remove a borda verde do produto que estava selecionado
    document.querySelectorAll('.item').forEach(el => el.classList.remove('destaque'));

    atualizarVisor();  // Volta o visor para a mensagem inicial
}

// ==========================================
// SUPORTE PARA CELULAR (TOQUE/CLIQUE)
// ==========================================
function cliqueMoeda(valor) {
    // A TRAVA MÁGICA: Se a tela for maior que 650px (computador), ignora o clique!
    // Isso obriga a professora a usar o Drag and Drop no PC.
    if (window.innerWidth > 650) {
        return; 
    }

    if (aguardandoRetirada) {
        piscarRetireAqui();
        return; 
    }
    if (!produtoSelecionado) {
        piscarVisorVermelho();
        return; 
    }
    
    saldoAtual += valor;
    
    if (saldoAtual >= produtoSelecionado.preco) {
        let troco = saldoAtual - produtoSelecionado.preco;
        entregarProduto(produtoSelecionado.imagem, troco);
    } else {
        atualizarVisor();
    }
}

// Chamadas iniciais para preparar a interface
carregarRefri();
atualizarVisor();
