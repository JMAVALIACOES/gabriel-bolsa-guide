// Widget de Chat Flutuante com IA
// Cria um chat flutuante na página

class AIChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.createWidget();
  }

  createWidget() {
    // Criar container principal
    const container = document.createElement('div');
    container.id = 'ai-chat-widget';
    container.className = 'ai-chat-widget';
    container.innerHTML = `
      <!-- Botão flutuante -->
      <button id="ai-chat-toggle" class="ai-chat-toggle" title="Assistente IA Gabriel">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="ai-chat-badge">IA</span>
      </button>

      <!-- Janela do chat -->
      <div id="ai-chat-window" class="ai-chat-window hidden">
        <div class="ai-chat-header">
          <h3>Gabriel IA</h3>
          <button id="ai-chat-close" class="ai-chat-close">✕</button>
        </div>

        <div id="ai-chat-messages" class="ai-chat-messages">
          <div class="ai-message">
            <div class="ai-message-content">
              Olá! 👋 Sou Gabriel IA, seu assistente de investimentos. Como posso ajudá-lo?
            </div>
          </div>
        </div>

        <div class="ai-chat-input-area">
          <input 
            type="text" 
            id="ai-chat-input" 
            class="ai-chat-input" 
            placeholder="Faça uma pergunta..."
            autocomplete="off"
          >
          <button id="ai-chat-send" class="ai-chat-send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <div class="ai-chat-footer">
          <small>Powered by GPT-3.5 Turbo</small>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Adicionar estilos
    this.addStyles();

    // Adicionar event listeners
    this.setupEventListeners();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Widget de Chat IA */
      .ai-chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      /* Botão Flutuante */
      .ai-chat-toggle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        position: relative;
      }

      .ai-chat-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .ai-chat-toggle:active {
        transform: scale(0.95);
      }

      .ai-chat-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        border: 2px solid white;
      }

      /* Janela do Chat */
      .ai-chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      }

      .ai-chat-window.hidden {
        display: none;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Header do Chat */
      .ai-chat-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .ai-chat-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .ai-chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Área de Mensagens */
      .ai-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f8f9fa;
      }

      .ai-message,
      .user-message {
        display: flex;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ai-message {
        justify-content: flex-start;
      }

      .user-message {
        justify-content: flex-end;
      }

      .ai-message-content,
      .user-message-content {
        max-width: 70%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .ai-message-content {
        background: white;
        color: #333;
        border: 1px solid #e0e0e0;
      }

      .user-message-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .ai-message-loading {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .ai-message-loading span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #667eea;
        animation: bounce 1.4s infinite;
      }

      .ai-message-loading span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .ai-message-loading span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes bounce {
        0%, 80%, 100% {
          opacity: 0.5;
          transform: translateY(0);
        }
        40% {
          opacity: 1;
          transform: translateY(-10px);
        }
      }

      /* Área de Input */
      .ai-chat-input-area {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid #e0e0e0;
        background: white;
      }

      .ai-chat-input {
        flex: 1;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 8px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .ai-chat-input:focus {
        border-color: #667eea;
      }

      .ai-chat-send {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }

      .ai-chat-send:hover {
        transform: scale(1.05);
      }

      .ai-chat-send:active {
        transform: scale(0.95);
      }

      /* Footer */
      .ai-chat-footer {
        padding: 8px 12px;
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #e0e0e0;
      }

      /* Responsivo */
      @media (max-width: 480px) {
        .ai-chat-window {
          width: calc(100vw - 32px);
          height: 70vh;
          bottom: 80px;
          right: 16px;
          left: 16px;
        }

        .ai-message-content,
        .user-message-content {
          max-width: 85%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    const toggle = document.getElementById('ai-chat-toggle');
    const close = document.getElementById('ai-chat-close');
    const send = document.getElementById('ai-chat-send');
    const input = document.getElementById('ai-chat-input');
    const window = document.getElementById('ai-chat-window');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    document.getElementById('ai-chat-window').classList.remove('hidden');
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('ai-chat-window').classList.add('hidden');
  }

  async sendMessage() {
    const input = document.getElementById('ai-chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Adicionar mensagem do usuário
    this.addMessage(message, 'user');
    input.value = '';

    // Mostrar indicador de carregamento
    this.addMessage('', 'loading');

    // Enviar para IA
    const response = await window.aiAssistant.sendMessage(message);

    // Remover indicador de carregamento
    this.removeLastMessage();

    // Adicionar resposta
    if (response.success) {
      this.addMessage(response.message, 'ai');
    } else {
      this.addMessage(`Erro: ${response.error}`, 'ai');
    }
  }

  addMessage(content, type = 'ai') {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageDiv = document.createElement('div');

    if (type === 'loading') {
      messageDiv.className = 'ai-message';
      messageDiv.innerHTML = `
        <div class="ai-message-content">
          <div class="ai-message-loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
    } else {
      messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';
      const contentDiv = document.createElement('div');
      contentDiv.className = type === 'user' ? 'user-message-content' : 'ai-message-content';
      contentDiv.textContent = content;
      messageDiv.appendChild(contentDiv);
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.messages.push({ type, content });
  }

  removeLastMessage() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (messagesContainer.lastChild) {
      messagesContainer.removeChild(messagesContainer.lastChild);
      this.messages.pop();
    }
  }
}

// Inicializar widget quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.aiChatWidget = new AIChatWidget();
});
