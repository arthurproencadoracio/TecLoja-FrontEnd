import router from './index'; // Importa a instância ativa
import { useAuth } from '../composables/useAuth';

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Verifica se o destino começa com o caminho administrativo
  if (to.path.startsWith('/admin')) {
    if (!isAuthenticated.value) {
      // Redireciona para o login se não autenticado
      next({ name: 'Login' });
    } else if (!isAdmin.value) {
      // Barra o acesso se logado mas sem permissão de admin
      alert("Acesso restrito. Somente administradores!");
      next({ name: 'Catalogo' });
    } else {
      next(); // Permite transição livre
    }
  } else {
    next(); // Transição livre
  }
});
