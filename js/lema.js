import { EstadoLetras } from "./estado-letras.js";
export class Lema {
    constructor() {
        this.jogosJogados = 0;
        this.jogosGanhos = 0;
        this.porcentagemVitoria = 0;
        this.sequenciaVitoria = 0;
        this.melhorSequencia = 0;
        this.historico = [0, 0, 0, 0, 0, 0];
        this.palavraSecreta = '';
        this.mensagemFinal = '';
        this.rodada = 0;
        this.palavraEscolhida = '';
        this.iniciarJogo();
    }
    get MensagemFinal() {
        return this.mensagemFinal;
    }
    get PalavraSecreta() {
        return this.palavraSecreta;
    }
    iniciarJogo() {
        this.gerarPalavraAleatoria();
    }
    gerarPalavraAleatoria() {
        const palavrasSecretas = [
            "ácido", "adiar", "ímpar", "algar", "amado", "amigo", "anexo", "anuir", "aonde", "apelo",
            "aquém", "argil", "arroz", "assar", "atrás", "ávido", "azeri", "babar", "bagre", "banho",
            "barco", "bicho", "bolor", "brasa", "brava", "brisa", "bruto", "bulir", "caixa", "cansa",
            "chato", "chave", "chefe", "choro", "chulo", "claro", "cobre", "corte", "curar", "deixo",
            "dizer", "dogma", "dores", "duque", "enfim", "estou", "exame", "falar", "fardo", "farto",
            "fatal", "feliz", "ficar", "fogue", "força", "forno", "fraco", "fugir", "fundo", "fúria",
            "gaita", "gasto", "geada", "gelar", "gosto", "grito", "gueto", "honra", "humor", "idade",
            "ideia", "ídolo", "igual", "imune", "índio", "íngua", "irado", "isola", "janta", "jovem",
            "juizo", "largo", "laser", "leite", "lento", "lerdo", "levar", "lidar", "lindo", "lírio",
            "longe", "luzes", "magro", "maior", "malte", "mamar", "manto", "marca", "matar", "meigo",
            "meios", "melão", "mesmo", "metro", "mimos", "moeda", "moita", "molho", "morno", "morro",
            "motim", "muito", "mural", "naipe", "nasci", "natal", "naval", "ninar", "nível", "nobre",
            "noite", "norte", "nuvem", "oeste", "ombro", "ordem", "órgão", "ósseo", "ossos", "outro",
            "ouvir", "palma", "pardo", "passe", "pátio", "peito", "pêlos", "perdo", "períl", "perto",
            "pezar", "piano", "picar", "pilar", "pingo", "pione", "pista", "poder", "porém", "prado",
            "prato", "prazo", "preço", "prima", "primo", "pular", "quero", "quota", "raiva", "rampa",
            "rango", "reais", "reino", "rezar", "risco", "roçar", "rosto", "roubo", "russo", "saber",
            "sacar", "salto", "samba", "santo", "selar", "selos", "senso", "serão", "serra", "servo",
            "sexta", "sinal", "sobra", "sobre", "sócio", "sorte", "subir", "sujei", "sujos", "talão",
            "talha", "tanga", "tarde", "tempo", "tenho", "terço", "terra", "tesão", "tocar", "lacre",
            "laico", "lamba", "lambo", "largo", "larva", "lasca", "laser", "laura", "lavra", "leigo",
            "leite", "leito", "leiva", "lenho", "lento", "leque", "lerdo", "lesão", "lesma", "levar",
            "libra", "limbo", "lindo", "líneo", "lírio", "lisar", "lista", "livro", "logar", "lombo",
            "lotes", "louca", "louco", "louro", "lugar", "luzes", "macio", "maçom", "maior", "malha",
            "malte", "mamar", "mamãe", "manto", "março", "maria", "marra", "marta", "matar", "medir",
            "meigo", "meios", "melão", "menta", "menti", "mesmo", "metro", "miado", "mídia", "mielo",
            "mielo", "milho", "mimos", "minar", "minha", "miolo", "mirar", "missa", "mitos", "moeda",
            "moído", "moita", "molde", "molho", "monar", "monja", "moral", "morar", "morda", "morfo",
            "morte", "mosca", "mosco", "motim", "motor", "mudar", "muito", "mular", "mulas", "múmia",
            "mural", "extra", "falar", "falta", "fardo", "farol", "farto", "fatal", "feixe", "festa",
            "feudo", "fezes", "fiapo", "fibra", "ficha", "fidel", "filão", "filho", "firma", "fisco",
            "fisga", "fluir", "força", "forma", "forte", "fraco", "frade", "friso", "frito", "fugaz",
            "fugir", "fundo", "furor", "furto", "fuzil", "gabar", "gaita", "galho", "ganho", "garoa",
            "garra", "garro", "garvo", "gasto", "gaupe", "gazua", "geada", "gemer", "germe", "gigas",
            "girar", "gizar", "globo", "gosto", "grãos", "graça", "grava", "grito", "grude", "haver",
            "haver", "hiato", "hidra", "hífen", "hímel", "horas", "hotel", "humor", "ideal", "ídolo",
            "igual", "ileso", "imune", "irado", "isola", "jarra", "jaula", "jegue", "jeito", "jogar",
            "jovem", "juíza", "juizo", "julho", "junho", "jurar", "justa"
        ];
        const numeroAleatorio = Math.floor(Math.random() * palavrasSecretas.length);
        this.palavraSecreta = palavrasSecretas[numeroAleatorio].toUpperCase();
    }
    rodadaFinalizada() {
        this.rodada++;
    }
    obterEstadoLetras() {
        const estadoLetras = [];
        const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for (let i = 0; i < this.palavraEscolhida.length; i++) {
            if (this.compararStringSemAcento(this.palavraEscolhida[i], this.palavraSecreta[i])) {
                estadoLetras[i] = EstadoLetras.ExistePosicaoCorreta;
            }
            else if (normalize(this.palavraSecreta).includes(this.palavraEscolhida[i])) {
                estadoLetras[i] = EstadoLetras.Existe;
            }
            else {
                estadoLetras[i] = EstadoLetras.NaoExiste;
            }
        }
        return estadoLetras;
    }
    verificaSePalavraCompleta() {
        return this.palavraEscolhida.length == 5;
    }
    verificaSeJogadorGanhou() {
        if (this.compararStringSemAcento(this.palavraEscolhida, this.palavraSecreta)) {
            this.mensagemFinal = "Parabéns, você acertou! Click 'aqui' para Jogar Novamente!";
            return true;
        }
        return false;
    }
    verificaSeJogadorPerdeu() {
        if (this.rodada == 5) {
            this.mensagemFinal = `A palavra secreta era '${this.palavraSecreta}'. Click 'aqui' para Jogar Novamente!`;
            return true;
        }
        return false;
    }
    avisoPalavraIncompleta() {
        return 'Palavra incompleta';
    }
    compararStringSemAcento(letra1, letra2) {
        const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalize(letra1).toUpperCase() === normalize(letra2).toUpperCase();
    }
    atualizarHistorico(jogadorGanhou) {
        this.jogosJogados++;
        this.jogosGanhos += jogadorGanhou ? 1 : 0;
        this.porcentagemVitoria = (this.jogosGanhos / this.jogosJogados) * 100;
        if (jogadorGanhou) {
            this.sequenciaVitoria += 1;
        }
        else {
            this.sequenciaVitoria = 0;
        }
        this.melhorSequencia = this.sequenciaVitoria > this.melhorSequencia ? this.sequenciaVitoria : this.melhorSequencia;
        this.historico[this.rodada]++;
    }
}
//# sourceMappingURL=lema.js.map