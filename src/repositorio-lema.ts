import { estatisticasLema } from "./estatisticas-lema.js";

export class repositorioLema {
    public carregarEstatisticasSalvas(): estatisticasLema {
        const estatisticasJSON = localStorage.getItem('estatisticas');
        if (estatisticasJSON) {
            return JSON.parse(estatisticasJSON);
        } else {
            return {
                jogosJogados: 0,
                jogosGanhos: 0,
                porcentagemVitoria: 0,
                sequenciaVitoria: 0,
                melhorSequencia: 0,
                historico: [0, 0, 0, 0, 0, 0],
            };
        }
    }

    public salvarEstatisticas(estatisticas: estatisticasLema) {
        localStorage.setItem('estatisticas', JSON.stringify(estatisticas));
    }
}