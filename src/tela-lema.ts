import { Lema } from "./lema.js";
import { EstadoLetras } from "./estado-letras.js";
import { repositorioLema } from "./repositorio-lema.js";
import { estatisticasLema } from "./estatisticas-lema.js";

export class LemaView {
    private lemaAct: Lema;
    private lemaHistorico: repositorioLema;

    private btnAbrirEstatisticas: HTMLButtonElement;
    private janelaEstatisticas: HTMLElement;

    private jogosJogados: HTMLSpanElement;
    private jogosGanhos: HTMLSpanElement;
    private porcentagemVitoria: HTMLSpanElement;
    private sequenciaVitoria: HTMLSpanElement;
    private melhorSequencia: HTMLSpanElement;
    private grafico: HTMLDivElement;

    private estatisticas: estatisticasLema;

    private mensagem: HTMLParagraphElement;
        
    private mensagemContainer: HTMLDivElement;

    private rodada1: HTMLDivElement;
    private rodada2: HTMLDivElement;
    private rodada3: HTMLDivElement;
    private rodada4: HTMLDivElement;
    private rodada5: HTMLDivElement;
    private rodada6: HTMLDivElement;

    private rodadas: HTMLDivElement[];

    private teclado: HTMLDivElement;

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

    private configurarJanelaEstatisticas() {
        this.jogosJogados = document.getElementById('jogosJogados') as HTMLSpanElement;
        this.jogosGanhos = document.getElementById('jogosGanhos') as HTMLSpanElement;
        this.porcentagemVitoria = document.getElementById('porcentagemVitoria') as HTMLSpanElement;
        this.sequenciaVitoria = document.getElementById('sequenciaVitorias') as HTMLSpanElement;
        this.melhorSequencia = document.getElementById('melhorSequencia') as HTMLSpanElement;
        this.grafico = document.getElementById('grafico') as HTMLDivElement;
    }

    private abrirEstatisticas() {
        this.carregarEstatisticas();
        this.janelaEstatisticas.style.display = 'block';
    }

    private fecharEstatisticas() {
        this.janelaEstatisticas.style.display = 'none';
    }

    private configurarBotaoAbrirEstatisticas() {
        this.btnAbrirEstatisticas = document.getElementById('btnAbrirEstatisticas') as HTMLButtonElement;
        this.janelaEstatisticas = document.getElementById('janelaEstatisticas') as HTMLElement;

        this.btnAbrirEstatisticas.addEventListener('click', () => {
            this.abrirEstatisticas();
        });

        const closeBtn = this.janelaEstatisticas.querySelector('#btnFechar') as HTMLButtonElement;
        closeBtn.addEventListener('click', () => {
            this.fecharEstatisticas();
        });
    }

    private configurarMensagem() {
        this.mensagem = document.getElementById('mensagemFinal') as HTMLParagraphElement;
        this.mensagemContainer = document.querySelector('.mensagem-container') as HTMLDivElement;

        this.mensagem.addEventListener('click', () => this.reiniciarJogo()); 
    }

    private configurarRodadas() {
        this.rodada1 = document.getElementById('rodada1') as HTMLDivElement;
        this.rodada2 = document.getElementById('rodada2') as HTMLDivElement;
        this.rodada3 = document.getElementById('rodada3') as HTMLDivElement;
        this.rodada4 = document.getElementById('rodada4') as HTMLDivElement;
        this.rodada5 = document.getElementById('rodada5') as HTMLDivElement;
        this.rodada6 = document.getElementById('rodada6') as HTMLDivElement;

        this.rodadas = [this.rodada1, this.rodada2, this.rodada3, this.rodada4, this.rodada5, this.rodada6];
    }

    private registrarEventos() {
        this.teclado = document.getElementById('teclado') as HTMLDivElement;

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
    }

    private confirmarPalavra(sender: Event) {
        this.lemaAct.palavraEscolhida = this.obterPalavraCompleta();
        
        if (this.lemaAct.verificaSePalavraCompleta())
            this.finalizarRodada();
    }

    private inserirLetra(sender: Event) {
        const botao = sender.target as HTMLButtonElement;
        
        for (let espaco of this.rodadas[this.lemaAct.rodada].children) {
            if (espaco.textContent == '') {
                espaco.textContent = botao.textContent;
                return;
            }
        }
    }

    private apagarLetra(sender: Event) {
        const botao = sender.target as HTMLButtonElement;
        
        for (let espaco of Array.from(this.rodadas[this.lemaAct.rodada].children).reverse()) {
            if (espaco.textContent != '') {
                espaco.textContent = '';
                return;
            }
        }
    }

    private obterPalavraCompleta(): string {
        return Array.from(this.rodadas[this.lemaAct.rodada].children)
            .map(letra => letra.textContent)
            .join('');
    }

    private finalizarRodada(): void {
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

    private iniciarRodada() {
        for (let i = 0; i < 5; i++) {
            let linha = this.rodadas[this.lemaAct.rodada].children;
            Array.from(linha).forEach(letra => (letra as HTMLSpanElement).style.backgroundColor = '#60475c')
        }
    }

    private colorirConformeAvaliacaoLetras(): void {
        let estadoLetras: EstadoLetras[] = this.lemaAct.obterEstadoLetras();

        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));

        for (let i = 0; i < estadoLetras.length; i++) {
            let letra = this.rodadas[this.lemaAct.rodada].children[i] as HTMLSpanElement;
            let botaoTeclado = botoesTeclado.find(l => l.textContent == letra.textContent) as HTMLButtonElement;

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

    private jogadorGanhou(): void {
        this.atualizarHistorico(true);
        this.mostrarMensagemFinal('green');
    }
    
    private jogadorPerdeu(): void {
        this.atualizarHistorico(false);
        this.mostrarMensagemFinal('red');
    }

    private mostrarMensagemFinal(cor: string) {
        this.mensagem.textContent = this.lemaAct.MensagemFinal;
        this.mensagemContainer.classList.add('show-element');
        this.mensagem.style.backgroundColor = cor;
        this.teclado.style.pointerEvents = 'none';
    }

    private reiniciarJogo() {
        this.lemaAct = new Lema();
        
        this.mensagemContainer.classList.remove('show-element');

        this.rodadas.forEach(rodada => {
            Array.from(rodada.children).forEach(letra => {
                letra.textContent = '';
                (letra as HTMLSpanElement).style.backgroundColor = '';
            });
        });

        const botoesTeclado = Array.from(this.teclado.querySelectorAll('.key'));

        botoesTeclado.forEach(botoes => {
            (botoes as HTMLButtonElement).style.backgroundColor = '#382732';
        });

        this.teclado.style.pointerEvents = 'auto';

        this.iniciarRodada();
    }

    private carregarEstatisticas() {
        this.jogosJogados.textContent = this.estatisticas.jogosJogados.toString();
        this.jogosGanhos.textContent = this.estatisticas.jogosGanhos.toString();
        this.porcentagemVitoria.textContent = this.estatisticas.porcentagemVitoria.toString() + '%';
        this.sequenciaVitoria.textContent = this.estatisticas.sequenciaVitoria.toString();
        this.melhorSequencia.textContent = this.estatisticas.melhorSequencia.toString();
        this.atualizarBarrasGrafico();
    }

    private atualizarBarrasGrafico() {
        for (let i = 0; i < this.rodadas.length; i++) {
            const barraElement = document.getElementById(`barraRodada${i + 1}`) as HTMLDivElement;
            const largura = (this.estatisticas.historico[i] || 0.1) * 10;
            (barraElement.children[1] as HTMLParagraphElement).style.width = `${largura}%`;
            barraElement.children[1].textContent = this.estatisticas.historico[i].toString();
        }

        const barraPerdaElement = document.getElementById('barraPerda') as HTMLDivElement;
        const larguraPerda = (this.estatisticas.historico[this.estatisticas.historico.length - 1]) * 10;
        (barraPerdaElement.children[1] as HTMLParagraphElement).style.width = `${larguraPerda}%`;
        barraPerdaElement.children[1].textContent = this.estatisticas.historico[this.estatisticas.historico.length - 1].toString();
    }

    public atualizarHistorico(jogadorGanhou: boolean) {
        this.estatisticas.jogosJogados++;
        this.estatisticas.jogosGanhos += jogadorGanhou ? 1 : 0;
        this.estatisticas.porcentagemVitoria = (this.estatisticas.jogosGanhos / this.estatisticas.jogosJogados) * 100;
        if (jogadorGanhou){
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