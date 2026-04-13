# 🥤 Máquina de Refrigerantes

Projeto desenvolvido para a disciplina **SCC0219 - Introdução ao Desenvolvimento Web**. A aplicação simula uma máquina de venda de refrigerantes interativa.

## 🌐 Demonstração

Pode testar a máquina aqui:
👉 [https://demily-silva.github.io/maquina-refrigerante/](https://demily-silva.github.io/maquina-refrigerante/)

---

## 🚀 Funcionamento da Máquina

O sistema foi projetado para simular o comportamento de uma *Máquina de Refrigerantes* real, operando através do seguinte fluxo lógico:

1. **Carregamento Assíncrono:** Ao abrir a página, o JavaScript realiza uma requisição para um Web Service externo (Fetch API). Os dados dos produtos, como nomes, preços e imagens, são carregados dinamicamente na vitrine, garantindo que o estoque visual esteja sempre sincronizado com o servidor.
2. **Seleção de Produto:** O usuário inicia a compra escolhendo um item através dos botões na vitrine. O sistema destaca o produto selecionado e utiliza o visor para informar o valor que deve ser pago.
3. **Processamento de Créditos:** A máquina aceita moedas de R$ 0,25, R$ 0,50 e R$ 1,00. No computador, o pagamento é feito via **Drag and Drop** (arrastar e soltar), enquanto em dispositivos móveis o sistema habilita automaticamente a inserção por **clique**, garantindo que a experiência seja fluida em qualquer tela.
4. **Validação e Entrega:** O código monitora o saldo em tempo real. Quando o valor inserido atinge ou ultrapassa o preço do refrigerante, a máquina libera o item com uma animação de queda no dispenser, exibe a mensagem de confirmação e calcula o troco automaticamente.
5. **Retirada e Reset:** Para finalizar o ciclo, o usuário deve clicar no produto entregue. Esta ação "limpa" o dispenser, reseta o saldo e libera a máquina para uma nova transação, impedindo erros de operação durante a compra.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica e API de Drag and Drop.
- **CSS3:** Estilização avançada, Flexbox, Grid Layout, Animações e Media Queries.
- **JavaScript:** Lógica de estado, manipulação assíncrona (Async/Await) e eventos.

---

## 📂 Estrutura de Arquivos

- `index.html`: Estrutura base da máquina e elementos de interface.
- `style.css`: Toda a identidade visual, posicionamento e regras de responsividade.
- `script.js`: Toda a inteligência da aplicação (Fetch API, lógica financeira e eventos).
- `img/`: Pasta contendo o cenário da lanchonete.

---

## ✍️ Autoria

- **Demily Rodrigues** 
- Aluna do ICMC-USP - São Carlos.
