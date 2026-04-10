// Configuração do Supabase
// Project ID: mmssdzjrwrhootmccnyq
// Organization: ARGUS (Free Plan)

const SUPABASE_CONFIG = {
  PROJECT_ID: 'mmssdzjrwrhootmccnyq',
  PROJECT_URL: 'https://mmssdzjrwrhootmccnyq.supabase.co',
  API_URL: 'https://mmssdzjrwrhootmccnyq.supabase.co',
  // Nota: As chaves de API devem ser obtidas do Supabase Dashboard
  // Settings > API Keys > Project API keys
  // ANON_KEY: 'eyJ...', // Chave pública para uso no frontend
  // SERVICE_ROLE_KEY: 'eyJ...', // Chave privada (não usar no frontend)
};

// Função para inicializar o Supabase
async function initSupabase() {
  // Importar a biblioteca Supabase
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
  
  // Criar cliente Supabase
  const supabase = createClient(
    SUPABASE_CONFIG.PROJECT_URL,
    SUPABASE_CONFIG.ANON_KEY
  );
  
  return supabase;
}

// Funções de Autenticação
const Auth = {
  // Login com Email/Senha
  async loginWithEmail(email, password) {
    const supabase = await initSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Signup com Email/Senha
  async signupWithEmail(email, password, name) {
    const supabase = await initSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  },

  // Login com Google
  async loginWithGoogle() {
    const supabase = await initSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  // Logout
  async logout() {
    const supabase = await initSupabase();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Obter usuário atual
  async getCurrentUser() {
    const supabase = await initSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Obter sessão
  async getSession() {
    const supabase = await initSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
};

// Funções de Progresso do Usuário
const UserProgress = {
  // Salvar progresso em uma seção
  async saveProgress(userId, sectionName, timeSpent = 0, completed = false) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        section_name: sectionName,
        time_spent_seconds: timeSpent,
        completed,
        last_accessed: new Date().toISOString(),
      }, {
        onConflict: 'user_id,section_name',
      });
    return { data, error };
  },

  // Obter progresso do usuário
  async getProgress(userId) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  // Obter progresso de uma seção específica
  async getSectionProgress(userId, sectionName) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('section_name', sectionName)
      .single();
    return { data, error };
  },
};

// Funções de Atividades
const UserActivities = {
  // Registrar atividade
  async logActivity(userId, activityType, activityData = {}) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
      });
    return { data, error };
  },

  // Obter atividades do usuário
  async getActivities(userId, limit = 100) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },
};

// Funções de Cálculos Salvos
const SavedCalculations = {
  // Salvar cálculo
  async saveCalculation(userId, calculationType, calculationData, result) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert({
        user_id: userId,
        calculation_type: calculationType,
        calculation_data: calculationData,
        result,
      });
    return { data, error };
  },

  // Obter cálculos salvos
  async getCalculations(userId) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('saved_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

// Funções de Quizzes
const Quizzes = {
  // Salvar resultado do quiz
  async saveQuizResult(userId, quizName, answers, result, score = null) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('completed_quizzes')
      .insert({
        user_id: userId,
        quiz_name: quizName,
        answers,
        result,
        score,
      });
    return { data, error };
  },

  // Obter resultados dos quizzes
  async getQuizResults(userId) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('completed_quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Obter resultado de um quiz específico
  async getQuizResult(userId, quizName) {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('completed_quizzes')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_name', quizName)
      .order('created_at', { ascending: false })
      .limit(1);
    return { data, error };
  },
};

// Exportar para uso global
window.SupabaseConfig = SUPABASE_CONFIG;
window.Auth = Auth;
window.UserProgress = UserProgress;
window.UserActivities = UserActivities;
window.SavedCalculations = SavedCalculations;
window.Quizzes = Quizzes;
