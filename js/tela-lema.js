import { Lema } from "./lema.js";
import { EstadoLetras } from "./estado-letras.js";
import { repositorioLema } from "./repositorio-lema.js";
export class LemaView {
    constructor() {
        this.lemaAct = new Lema();
        this.lemaHistorico = new repositorioLema();
        this.estatisticas = this.lemaHistorico.carregarEstatisticasSalvas();
        this.configurarJanelaEstatisticas();
        this.configurarBotaoAbrirEstatisticas();
        this.configurarMensagem();
        this.configurarRodadas();
        this.registrarEventos();
        this.iniciarRodada();
    }
    configurarJanelaEstatisticas() {
        this.jogosJogados = document.getElementById('jogosJogados');
        this.jogosGanhos = document.getElementById('jogosGanhos');
        this.porcentagemVitoria = document.getElementById('porcentagemVitoria');
        this.sequenciaVitoria = document.getElementById('sequenciaVitorias');
        this.melhorSequencia = document.getElementById('melhorSequencia');
        this.grafico = document.getElementById('grafico');
    }
    abrirEstatisticas() {
        this.carregarEstatisticas();
        this.janelaEstatisticas.style.display = 'block';
    }
    fecharEstatisticas() {
        this.janelaEstatisticas.style.display = 'none';
    }
    configurarBotaoAbrirEstatisticas() {
        this.btnAbrirEstatisticas = document.getElementById('btnAbrirEstatisticas');
        this.janelaEstatisticas = document.getElementById('janelaEstatisticas');
        this.btnAbrirEstatisticas.addEventListener('click', () => {
            this.abrirEstatisticas();
        });
        const closeBtn = this.janelaEstatisticas.querySelector('#btnFechar');
        closeBtn.addEventListener('click', () => {
            this.fecharEstatisticas();
        });
    }
    configurarMensagem() {
        this.mensagem = document.getElementById('mensagemFinal');
        this.mensagemContainer = document.querySelector('.mensagem-container');
        this.mensagem.addEventListener('click', () => this.reiniciarJogo());
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
        var _a, _b;
        this.teclado = document.getElementById('teclado');
        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));
        for (let botao of botoesTeclado) {
            if ((_a = botao.textContent) === null || _a === void 0 ? void 0 : _a.includes('subdirectory_arrow_left')) {
                botao.addEventListener('click', (sender) => this.confirmarPalavra(sender));
            }
            else if ((_b = botao.textContent) === null || _b === void 0 ? void 0 : _b.includes('backspace')) {
                botao.addEventListener('click', (sender) => this.apagarLetra(sender));
            }
            else {
                botao.addEventListener('click', (sender) => this.inserirLetra(sender));
            }
        }
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
                    letra.style.backgroundColor = '#349b18';
                    letra.textContent = this.lemaAct.PalavraSecreta[i];
                    botaoTeclado.style.backgroundColor = '#349b18';
                    break;
                case EstadoLetras.Existe:
                    letra.style.backgroundColor = '#a77f06';
                    if (botaoTeclado.style.backgroundColor != '#349b18')
                        botaoTeclado.style.backgroundColor = '#a77f06';
                    break;
                case EstadoLetras.NaoExiste:
                    letra.style.backgroundColor = '#211b1f';
                    botaoTeclado.style.backgroundColor = '#211b1f';
                    break;
            }
        }
    }
    jogadorGanhou() {
        this.atualizarHistorico(true);
        this.mostrarMensagemFinal('green');
    }
    jogadorPerdeu() {
        this.atualizarHistorico(false);
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
        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));
        botoesTeclado.forEach(botoes => {
            botoes.style.backgroundColor = '#382732';
        });
        this.teclado.style.pointerEvents = 'auto';
        this.iniciarRodada();
    }
    carregarEstatisticas() {
        this.jogosJogados.textContent = this.estatisticas.jogosJogados.toString();
        this.jogosGanhos.textContent = this.estatisticas.jogosGanhos.toString();
        this.porcentagemVitoria.textContent = this.estatisticas.porcentagemVitoria.toString() + '%';
        this.sequenciaVitoria.textContent = this.estatisticas.sequenciaVitoria.toString();
        this.melhorSequencia.textContent = this.estatisticas.melhorSequencia.toString();
        this.atualizarBarrasGrafico();
    }
    atualizarBarrasGrafico() {
        for (let i = 0; i < this.rodadas.length; i++) {
            const barraElement = document.getElementById(`barraRodada${i + 1}`);
            const largura = (this.estatisticas.historico[i] || 0.1) * 10;
            barraElement.children[1].style.width = `${largura}%`;
            barraElement.children[1].textContent = this.estatisticas.historico[i].toString();
        }
        const barraPerdaElement = document.getElementById('barraPerda');
        const larguraPerda = (this.estatisticas.historico[this.estatisticas.historico.length - 1]) * 10;
        barraPerdaElement.children[1].style.width = `${larguraPerda}%`;
        barraPerdaElement.children[1].textContent = this.estatisticas.historico[this.estatisticas.historico.length - 1].toString();
    }
    atualizarHistorico(jogadorGanhou) {
        this.estatisticas.jogosJogados++;
        this.estatisticas.jogosGanhos += jogadorGanhou ? 1 : 0;
        this.estatisticas.porcentagemVitoria = Math.floor((this.estatisticas.jogosGanhos / this.estatisticas.jogosJogados) * 100);
        if (jogadorGanhou) {
            this.estatisticas.sequenciaVitoria += 1;
            this.estatisticas.historico[this.lemaAct.rodada]++;
        }
        else {
            this.estatisticas.sequenciaVitoria = 0;
            this.estatisticas.historico[this.estatisticas.historico.length - 1]++;
        }
        this.estatisticas.melhorSequencia = this.estatisticas.sequenciaVitoria > this.estatisticas.melhorSequencia ? this.estatisticas.sequenciaVitoria : this.estatisticas.melhorSequencia;
        this.lemaHistorico.salvarEstatisticas(this.estatisticas);
    }
}
//# sourceMappingURL=tela-lema.js.map