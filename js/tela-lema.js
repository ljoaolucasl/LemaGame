import { Lema } from "./lema.js";
import { EstadoLetras } from "./estado-letras.js";
export class LemaView {
    constructor() {
        this.lemaAct = new Lema();
        this.configurarMensagem();
        this.configurarRodadas();
        this.registrarEventos();
        this.iniciarRodada();
    }
    configurarMensagem() {
        this.mensagem = document.getElementById('mensagemFinal');
        this.mensagemContainer = document.querySelector('.mensagem-container');
    }
    configurarRodadas() {
        this.rodada1 = document.getElementById('rodada1');
        this.rodada2 = document.getElementById('rodada2');
        this.rodada3 = document.getElementById('rodada3');
        this.rodada4 = document.getElementById('rodada4');
        this.rodada5 = document.getElementById('rodada5');
        this.rodada6 = document.getElementById('rodada6');
        this.rodadas = [this.rodada1, this.rodada2, this.rodada3, this.rodada4, this.rodada5, this.rodada6];
    }
    registrarEventos() {
        this.teclado = document.getElementById('teclado');
        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));
        for (let botao of botoesTeclado) {
            if (botao.textContent == 'Enter') {
                botao.addEventListener('click', (sender) => this.confirmarPalavra(sender));
            }
            else if (botao.textContent == 'Del') {
                botao.addEventListener('click', (sender) => this.apagarLetra(sender));
            }
            else {
                botao.addEventListener('click', (sender) => this.inserirLetra(sender));
            }
        }
        this.mensagem.addEventListener('click', () => this.reiniciarJogo());
    }
    confirmarPalavra(sender) {
        this.lemaAct.palavraEscolhida = this.obterPalavraCompleta();
        if (this.lemaAct.verificaSePalavraCompleta())
            this.finalizarRodada();
    }
    inserirLetra(sender) {
        const botao = sender.target;
        for (let espaco of this.rodadas[this.lemaAct.rodada].children) {
            if (espaco.textContent == '') {
                espaco.textContent = botao.textContent;
                return;
            }
        }
    }
    apagarLetra(sender) {
        const botao = sender.target;
        for (let espaco of Array.from(this.rodadas[this.lemaAct.rodada].children).reverse()) {
            if (espaco.textContent != '') {
                espaco.textContent = '';
                return;
            }
        }
    }
    obterPalavraCompleta() {
        return Array.from(this.rodadas[this.lemaAct.rodada].children)
            .map(letra => letra.textContent)
            .join('');
    }
    finalizarRodada() {
        this.colorirConformeAvaliacaoLetras();
        if (this.lemaAct.verificaSeJogadorGanhou()) {
            this.jogadorGanhou();
            return;
        }
        else if (this.lemaAct.verificaSeJogadorPerdeu()) {
            this.jogadorPerdeu();
            return;
        }
        this.lemaAct.rodadaFinalizada();
        this.iniciarRodada();
    }
    iniciarRodada() {
        for (let i = 0; i < 5; i++) {
            let linha = this.rodadas[this.lemaAct.rodada].children;
            Array.from(linha).forEach(letra => letra.style.backgroundColor = '#60475c');
        }
    }
    colorirConformeAvaliacaoLetras() {
        let estadoLetras = this.lemaAct.obterEstadoLetras();
        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));
        for (let i = 0; i < estadoLetras.length; i++) {
            let letra = this.rodadas[this.lemaAct.rodada].children[i];
            let botaoTeclado = botoesTeclado.find(l => l.textContent == letra.textContent);
            switch (estadoLetras[i]) {
                case EstadoLetras.ExistePosicaoCorreta:
                    letra.style.backgroundColor = 'green';
                    letra.textContent = this.lemaAct.PalavraSecreta[i];
                    botaoTeclado.style.backgroundColor = 'green';
                    break;
                case EstadoLetras.Existe:
                    letra.style.backgroundColor = 'yellow';
                    if (botaoTeclado.style.backgroundColor != 'green')
                        botaoTeclado.style.backgroundColor = 'yellow';
                    break;
                case EstadoLetras.NaoExiste:
                    letra.style.backgroundColor = '#382732';
                    botaoTeclado.style.backgroundColor = '#382732';
                    break;
            }
        }
    }
    jogadorGanhou() {
        this.mostrarMensagemFinal('green');
    }
    jogadorPerdeu() {
        this.mostrarMensagemFinal('red');
    }
    mostrarMensagemFinal(cor) {
        this.mensagem.textContent = this.lemaAct.MensagemFinal;
        this.mensagemContainer.classList.add('show-element');
        this.mensagem.style.backgroundColor = cor;
        this.teclado.style.pointerEvents = 'none';
    }
    reiniciarJogo() {
        this.lemaAct = new Lema();
        this.mensagemContainer.classList.remove('show-element');
        this.rodadas.forEach(rodada => {
            Array.from(rodada.children).forEach(letra => {
                letra.textContent = '';
                letra.style.backgroundColor = '';
            });
        });
        this.teclado.style.pointerEvents = 'auto';
        this.iniciarRodada();
    }
}
//# sourceMappingURL=tela-lema.js.map