export class repositorioLema {
    carregarEstatisticasSalvas() {
        const estatisticasJSON = localStorage.getItem('estatisticas');
        if (estatisticasJSON) {
            return JSON.parse(estatisticasJSON);
        }
        else {
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
    salvarEstatisticas(estatisticas) {
        localStorage.setItem('estatisticas', JSON.stringify(estatisticas));
    }
}
//# sourceMappingURL=repositorio-lema.js.map