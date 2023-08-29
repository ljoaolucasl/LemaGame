import { IEstatisticasLema } from "../models/estatisticas-lema";

export class RepositorioLema {
    public carregarEstatisticasSalvas(): IEstatisticasLema {
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

    public salvarEstatisticas(estatisticas: IEstatisticasLema) {
        localStorage.setItem('estatisticas', JSON.stringify(estatisticas));
    }
}