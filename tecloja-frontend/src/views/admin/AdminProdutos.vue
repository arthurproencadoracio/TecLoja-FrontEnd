<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-brand">🛒 TecLoja Admin</router-link>
    <router-link to="/" class="btn btn-danger">Sair do Painel</router-link>
  </nav>

  <div style="padding: 2rem 5%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h2>Gestão de Produtos do Catálogo</h2>
      <router-link to="/admin/produtos/novo" class="btn btn-primary">+ Cadastrar Novo Eletrônico</router-link>
    </div>

    <div class="glass-panel" style="overflow-x: auto; padding: 0;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.1);">
            <th style="padding: 1rem;">ID</th>
            <th style="padding: 1rem;">Nome</th>
            <th style="padding: 1rem;">Estoque</th>
            <th style="padding: 1rem;">Preço</th>
            <th style="padding: 1rem; text-align: center;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtos" :key="p.id" style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 1rem;">{{ p.id }}</td>
            <td style="padding: 1rem; font-weight: 600;">{{ p.nome }}</td>
            <td style="padding: 1rem;">{{ p.estoque }} unid.</td>
            <td style="padding: 1rem; color: var(--accent-color); font-weight: 700;">
              R$ {{ p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </td>
            <td style="padding: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
              <router-link :to="'/admin/produtos/editar/' + p.id" class="btn btn-primary" style="padding: 0.5rem 1rem;">Editar</router-link>
              <button class="btn btn-danger" style="padding: 0.5rem 1rem;" @click="deletar(p.id!)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import { Produto } from '../../models';

const produtos = ref<Produto[]>([]);

const carregarProdutos = async () => {
  const res = await api.get<Produto[]>('/produtos');
  produtos.value = res.data;
};

const deletar = async (id: number) => {
  if (confirm("Deseja realmente remover este eletrônico do catálogo?")) {
    try {
      await api.delete(`/produtos/${id}`);
      produtos.value = produtos.value.filter(p => p.id !== id);
    } catch (err: any) {
      alert("Falha ao apagar produto: " + err.response?.data?.detail);
    }
  }
};

onMounted(carregarProdutos);
</script>
