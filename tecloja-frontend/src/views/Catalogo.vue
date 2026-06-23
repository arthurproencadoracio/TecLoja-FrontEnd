<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-brand">🛒 TecLoja 02</router-link>
    <ul class="navbar-menu">
      <li><router-link to="/" class="navbar-link active">Catálogo</router-link></li>
      <li><router-link to="/carrinho" class="navbar-link">Carrinho ({{ cart.totalItens.value }})</router-link></li>
      
      <li v-if="auth.isAdmin.value"><router-link to="/admin/produtos" class="navbar-link">Painel Admin</router-link></li>
      
      <li v-if="!auth.isAuthenticated.value"><router-link to="/login" class="btn btn-primary">Login</router-link></li>
      <li v-else>
        <span style="margin-right: 15px; color: var(--text-secondary);">Olá, {{ auth.currentUser.value?.username }}</span>
        <button class="btn btn-danger" @click="auth.logout()">Sair</button>
      </li>
    </ul>
  </nav>

  <div style="padding: 2rem 5%;">
    <!-- Filtros de Pesquisa -->
    <div class="glass-panel" style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
      <input type="text" class="form-control" style="flex: 2; min-width: 250px;" 
             placeholder="Busque eletrônicos premium..." v-model="busca" @input="pesquisar">
    </div>

    <!-- Grid de Produtos -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
      <div class="glass-panel" v-for="p in produtos" :key="p.id">
        <div style="height: 150px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <span style="font-size: 3rem;">💻</span>
        </div>
        <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">{{ p.nome }}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; min-height: 40px; margin-bottom: 1rem;">{{ p.descricao }}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">
            R$ {{ p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
          </span>
          <span :style="{ color: p.estoque > 0 ? 'var(--success-color)' : 'var(--danger-color)' }" style="font-size: 0.875rem; font-weight: 600;">
            {{ p.estoque > 0 ? p.estoque + ' em estoque' : 'Esgotado' }}
          </span>
        </div>

        <button class="btn btn-primary" style="width: 100%; justify-content: center;" 
                :disabled="p.estoque <= 0" @click="cart.adicionar(p)">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { Produto } from '../models';
import { useCart } from '../composables/useCart';
import { useAuth } from '../composables/useAuth';

const cart = useCart();
const auth = useAuth();

const produtos = ref<Produto[]>([]);
const busca = ref('');

const carregarProdutos = async () => {
  try {
    const res = await api.get<Produto[]>('/produtos');
    produtos.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar catálogo", err);
  }
};

const pesquisar = async () => {
  if (!busca.value.trim()) {
    carregarProdutos();
    return;
  }
  try {
    const res = await api.get<Produto[]>(`/produtos/pesquisa/?nome=${busca.value}`);
    produtos.value = res.data;
  } catch (err) {
    console.error("Erro na busca", err);
  }
};

onMounted(carregarProdutos);
</script>
