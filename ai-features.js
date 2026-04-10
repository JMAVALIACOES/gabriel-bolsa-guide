// Funcionalidades Avançadas de IA
// Análise inteligente, recomendações e insights

class AIFeatures {
  constructor() {
    this.assistant = window.aiAssistant;
  }

  // 1. Analisar Cálculo de Investimento
  async analyzeInvestment(buyPrice, sellPrice, quantity) {
    const profit = (sellPrice - buyPrice) * quantity;
    const percentage = ((sellPrice - buyPrice) / buyPrice * 100).toFixed(2);

    const prompt = `Analise este investimento e forneça insights detalhados:

DADOS DO INVESTIMENTO:
- Preço de Compra: R$ ${buyPrice}
- Preço de Venda: R$ ${sellPrice}
- Quantidade: ${quantity} ações
- Lucro/Prejuízo: R$ ${profit.toFixed(2)}
- Retorno: ${percentage}%

Por favor, forneça:
1. Análise do resultado (bom, regular, ruim?)
2. Comparação com benchmarks (Ibovespa, S&P 500)
3. Dicas para melhorar próximos investimentos
4. Próximos passos recomendados
5. Riscos a considerar`;

    return this.assistant.sendMessage(prompt);
  }

  // 2. Explicar Termo Financeiro
  async explainFinancialTerm(term) {
    const prompt = `Explique o termo financeiro "${term}" de forma clara e didática:

1. Definição simples
2. Exemplo prático do mercado brasileiro
3. Por que é importante para investidores
4. Como usar esse conceito na prática
5. Erros comuns ao usar esse termo`;

    return this.assistant.sendMessage(prompt);
  }

  // 3. Gerar Recomendações Personalizadas
  async getPersonalizedRecommendations(userProfile) {
    const prompt = `Com base no perfil de investidor ${userProfile.type}, forneça recomendações personalizadas:

PERFIL DO USUÁRIO:
- Tipo: ${userProfile.type}
- Experiência: ${userProfile.experience || 'Não informada'}
- Tempo disponível: ${userProfile.timePerWeek || '5'} horas/semana
- Seções estudadas: ${userProfile.completedSections?.join(', ') || 'Nenhuma'}
- Objetivo: ${userProfile.goal || 'Não informado'}

Recomende:
1. Próximas seções para estudar (em ordem de importância)
2. Estratégias de investimento adequadas
3. Riscos específicos a evitar
4. Recursos úteis (livros, cursos, ferramentas)
5. Cronograma sugerido para os próximos 3 meses`;

    return this.assistant.sendMessage(prompt, userProfile);
  }

  // 4. Gerar Plano de Estudo Personalizado
  async generateStudyPlan(userProfile) {
    const prompt = `Crie um plano de estudo personalizado e realista para um investidor ${userProfile.type}:

CONTEXTO:
- Perfil: ${userProfile.type}
- Experiência: ${userProfile.experience || 'Iniciante'}
- Tempo/semana: ${userProfile.timePerWeek || '5'} horas
- Objetivo: Aprender sobre investimentos em bolsa

Forneça:
1. Sequência de aprendizado (semana por semana, próximas 12 semanas)
2. Tempo estimado para cada tópico
3. Recursos recomendados para cada etapa
4. Marcos de progresso e como medir sucesso
5. Dicas para manter a motivação
6. Próximos passos após completar o plano`;

    return this.assistant.sendMessage(prompt, userProfile);
  }

  // 5. Análise de Notícia/Evento de Mercado
  async analyzeMarketNews(newsTitle, newsContent) {
    const prompt = `Analise este evento/notícia de mercado e seu impacto para investidores:

NOTÍCIA:
Título: "${newsTitle}"
Conteúdo: "${newsContent}"

Forneça:
1. Resumo do que aconteceu
2. Por que é importante para a bolsa
3. Impacto esperado (curto e longo prazo)
4. Setores mais afetados
5. Oportunidades de investimento
6. Riscos a considerar
7. Recomendação de ação (comprar, vender, aguardar)`;

    return this.assistant.sendMessage(prompt);
  }

  // 6. Comparar Duas Ações
  async compareStocks(stock1, stock2) {
    const prompt = `Compare essas duas ações para um investidor brasileiro:

AÇÃO 1: ${stock1}
AÇÃO 2: ${stock2}

Forneça uma análise comparativa:
1. Setor de atuação
2. Histórico de dividendos
3. Volatilidade esperada
4. Risco vs. Retorno
5. Qual é melhor para cada perfil (conservador, moderado, agressivo)
6. Recomendação final com justificativa`;

    return this.assistant.sendMessage(prompt);
  }

  // 7. Gerar Estratégia de Investimento
  async generateStrategy(investmentAmount, timeHorizon, riskProfile) {
    const prompt = `Crie uma estratégia de investimento personalizada:

PARÂMETROS:
- Valor a investir: R$ ${investmentAmount}
- Horizonte: ${timeHorizon} anos
- Perfil de risco: ${riskProfile}

Estratégia completa:
1. Alocação de ativos (% em ações, renda fixa, fundos, etc)
2. Ações recomendadas (3-5 opções)
3. Fundos recomendados
4. Renda fixa (tesouro direto, CDB, etc)
5. Cronograma de investimento (como distribuir o valor)
6. Rebalanceamento (quando e como)
7. Monitoramento (métricas a acompanhar)
8. Ajustes conforme mercado muda`;

    return this.assistant.sendMessage(prompt);
  }

  // 8. Responder Dúvida Específica
  async answerQuestion(question, context = null) {
    let prompt = question;
    
    if (context) {
      prompt = `Contexto: ${context}\n\nPergunta: ${question}`;
    }

    return this.assistant.sendMessage(prompt);
  }

  // 9. Gerar Resumo de Seção
  async summarizeSection(sectionName, content) {
    const prompt = `Crie um resumo executivo desta seção de estudo:

SEÇÃO: ${sectionName}
CONTEÚDO: ${content}

Resumo deve incluir:
1. Pontos-chave (máx 5)
2. Conceitos essenciais
3. Aplicação prática
4. Próximos passos
5. Recursos para aprofundar`;

    return this.assistant.sendMessage(prompt);
  }

  // 10. Avaliar Conhecimento
  async evaluateKnowledge(topic, userAnswers) {
    const prompt = `Avalie o conhecimento do usuário sobre ${topic}:

RESPOSTAS DO USUÁRIO:
${userAnswers.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Forneça:
1. Pontuação (0-100)
2. Áreas fortes
3. Áreas a melhorar
4. Recomendações de estudo
5. Próximo tópico sugerido`;

    return this.assistant.sendMessage(prompt);
  }
}

// Exportar globalmente
window.AIFeatures = AIFeatures;
window.aiFeatures = new AIFeatures();

// Funções auxiliares rápidas
window.analyzeInvestment = (buyPrice, sellPrice, quantity) => {
  return window.aiFeatures.analyzeInvestment(buyPrice, sellPrice, quantity);
};

window.explainTerm = (term) => {
  return window.aiFeatures.explainFinancialTerm(term);
};

window.getRecommendations = (userProfile) => {
  return window.aiFeatures.getPersonalizedRecommendations(userProfile);
};

window.generateStudyPlan = (userProfile) => {
  return window.aiFeatures.generateStudyPlan(userProfile);
};

window.analyzeNews = (title, content) => {
  return window.aiFeatures.analyzeMarketNews(title, content);
};

window.compareStocks = (stock1, stock2) => {
  return window.aiFeatures.compareStocks(stock1, stock2);
};

window.generateStrategy = (amount, horizon, risk) => {
  return window.aiFeatures.generateStrategy(amount, horizon, risk);
};

window.askAI = (question, context) => {
  return window.aiFeatures.answerQuestion(question, context);
};
