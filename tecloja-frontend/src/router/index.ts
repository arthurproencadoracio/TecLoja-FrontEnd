import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'Catalogo',
    component: () => import('../views/Catalogo.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: () => import('../views/Carrinho.vue'),
  },
  {
    path: '/admin/produtos',
    name: 'AdminProdutos',
    component: () => import('../views/admin/AdminProdutos.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/produtos/novo',
    name: 'NovoProduto',
    component: () => import('../views/admin/ProdutoForm.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/produtos/editar/:id',
    name: 'EditarProduto',
    component: () => import('../views/admin/ProdutoForm.vue'),
    props: true,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (to.path.startsWith('/admin')) {
    if (!isAuthenticated.value) {
      next({ name: 'Login' });
    } else if (!isAdmin.value) {
      alert("Acesso restrito. Somente administradores!");
      next({ name: 'Catalogo' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
