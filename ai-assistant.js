// Módulo de Assistente IA com OpenRouter + GPT-3.5 Turbo
// Documentação: https://openrouter.ai/docs

class AIAssistant {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.model = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
    this.baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.conversationHistory = [];
    this.isLoading = false;
  }

  // Sistema de prompts para contexto financeiro
  getSystemPrompt() {
    return `Você é um assistente IA especializado em educação financeira e investimentos em bolsa de valores. 
    
Seu nome é "Gabriel IA" e você trabalha no Guia Gabriel da Bolsa.

Características:
- Explique conceitos de forma clara e acessível
- Use exemplos práticos do mercado brasileiro
- Seja sempre educacional e não recomende ações específicas
- Respeite a legislação brasileira (LGPD, CVM)
- Adapte respostas ao perfil do usuário (conservador, moderado, agressivo)
- Use dados reais quando possível
- Cite fontes confiáveis (B3, CVM, Banco Central)

Contexto do Guia Gabriel da Bolsa:
- Seções: O Básico, Passo a Passo, 3 Formas, Avançado, Impostos, Simuladores, Ferramentas, Dicas, Cursos, Recursos, Glossário
- Público: Iniciantes a investidores avançados
- Objetivo: Educação financeira de qualidade

Responda em português brasileiro, de forma amigável e profissional.`;
  }

  // Enviar mensagem para GPT-3.5 via OpenRouter
  async sendMessage(userMessage, userProfile = null) {
    if (!this.apiKey) {
      console.error('Chave OpenRouter não configurada');
      return {
        error: 'Assistente IA não configurado. Por favor, configure a chave OpenRouter.',
      };
    }

    this.isLoading = true;

    try {
      // Adicionar contexto do perfil do usuário se disponível
      let contextMessage = userMessage;
      if (userProfile) {
        contextMessage = `[Perfil do usuário: ${userProfile.type}]\n${userMessage}`;
      }

      // Adicionar mensagem do usuário ao histórico
      this.conversationHistory.push({
        role: 'user',
        content: contextMessage,
      });

      // Manter apenas as últimas 10 mensagens para economizar tokens
      const messages = this.conversationHistory.slice(-10);

      // Fazer requisição para OpenRouter
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Gabriel da Bolsa',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro OpenRouter:', error);
        return {
          error: `Erro na IA: ${error.error?.message || 'Erro desconhecido'}`,
        };
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Adicionar resposta ao histórico
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      // Registrar atividade no Supabase
      if (window.UserActivities) {
        const user = await window.Auth.getCurrentUser();
        if (user) {
          await window.UserActivities.logActivity(user.id, 'ai_chat', {
            question: userMessage,
            model: this.model,
          });
        }
      }

      return {
        success: true,
        message: assistantMessage,
        tokens: {
          prompt: data.usage.prompt_tokens,
          completion: data.usage.completion_tokens,
          total: data.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('Erro ao chamar OpenRouter:', error);
      return {
        error: `Erro ao conectar com IA: ${error.message}`,
      };
    } finally {
      this.isLoading = false;
    }
  }

  // Analisar um cálculo de investimento
  async analyzeCalculation(calculationData) {
    const prompt = `Analise este cálculo de investimento e forneça insights:

Preço de Compra: R$ ${calculationData.buyPrice}
Preço de Venda: R$ ${calculationData.sellPrice}
Quantidade: ${calculationData.quantity} ações
Lucro/Prejuízo: R$ ${calculationData.profit}
Percentual: ${calculationData.percentage}%

Forneça:
1. Análise do resultado
2. Comparação com benchmarks
3. Dicas para melhorar
4. Próximos passos sugeridos`;

    return this.sendMessage(prompt);
  }

  // Explicar um termo financeiro
  async explainTerm(term) {
    const prompt = `Explique o termo financeiro "${term}" de forma clara e com exemplos práticos do mercado brasileiro.`;
    return this.sendMessage(prompt);
  }

  // Gerar recomendações personalizadas
  async getRecommendations(userProfile) {
    const prompt = `Com base no perfil de investidor ${userProfile.type}, recomende:
1. Próximas seções para estudar
2. Estratégias adequadas
3. Riscos a evitar
4. Recursos úteis

Considere que o usuário já estudou: ${userProfile.completedSections?.join(', ') || 'Nenhuma seção ainda'}`;

    return this.sendMessage(prompt, userProfile);
  }

  // Gerar plano de estudo personalizado
  async generateStudyPlan(userProfile) {
    const prompt = `Crie um plano de estudo personalizado para um investidor ${userProfile.type}:

Objetivo: Aprender sobre investimentos em bolsa
Tempo disponível: ${userProfile.timePerWeek || '5'} horas por semana
Experiência: ${userProfile.experience || 'Iniciante'}

Forneça:
1. Sequência de aprendizado
2. Tempo estimado para cada etapa
3. Recursos recomendados
4. Marcos de progresso`;

    return this.sendMessage(prompt, userProfile);
  }

  // Limpar histórico de conversa
  clearHistory() {
    this.conversationHistory = [];
  }

  // Obter histórico
  getHistory() {
    return this.conversationHistory;
  }

  // Salvar conversa no Supabase
  async saveConversation(userId, title = null) {
    if (!window.UserActivities) return null;

    const conversationData = {
      title: title || `Conversa com IA - ${new Date().toLocaleString('pt-BR')}`,
      messages: this.conversationHistory,
      messageCount: this.conversationHistory.length,
    };

    return window.UserActivities.logActivity(userId, 'ai_conversation_saved', conversationData);
  }
}

// Exportar globalmente
window.AIAssistant = AIAssistant;
window.aiAssistant = new AIAssistant();

// Função auxiliar para usar a IA
window.askAI = async (question, userProfile = null) => {
  return window.aiAssistant.sendMessage(question, userProfile);
};
