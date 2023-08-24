import { Lema } from "./lema.js";
import { EstadoLetras } from "./estado-letras.js";

export class LemaView {
    private lemaAct: Lema;

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

        this.configurarMensagem();
        this.configurarRodadas();
        this.registrarEventos();
        this.iniciarRodada();
    }

    private configurarMensagem() {
        this.mensagem = document.getElementById('mensagemFinal') as HTMLParagraphElement;
        this.mensagemContainer = document.querySelector('.mensagem-container') as HTMLDivElement;
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

        this.mensagem.addEventListener('click', () => this.reiniciarJogo()); 
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
        this.mostrarMensagemFinal('green');
    }
    
    private jogadorPerdeu(): void {
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
}