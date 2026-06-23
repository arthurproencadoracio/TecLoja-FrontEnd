import { ref, computed } from 'vue';
import axios from 'axios';
import { UsuarioLogado } from '../models';

const API_URL = 'https://tecloja-api.render.com/api/auth';

// Estado persistido na memória global do módulo (Single Source of Truth)
const usuario = ref<UsuarioLogado | null>(null);

// Inicializa a sessão lendo do localStorage do navegador
const tokenSalvo = localStorage.getItem('tecloja_user');
if (tokenSalvo) {
  usuario.value = JSON.parse(tokenSalvo);
}

export function useAuth() {
  
  // Getters computados reativos
  const currentUser = computed(() => usuario.value);
  const isAuthenticated = computed(() => !!usuario.value);
  const isAdmin = computed(() => usuario.value?.papel === 'ROLE_ADMIN');

  const login = async (username: string, password: str) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const dados: UsuarioLogado = response.data;
      
      usuario.value = dados;
      localStorage.setItem('tecloja_user', JSON.stringify(dados));
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Erro ao realizar autenticação.");
    }
  };

  const logout = () => {
    usuario.value = null;
    localStorage.removeItem('tecloja_user');
  };

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
}
