<template>
  <nav class="navbar">
    <span class="navbar-brand">🛒 Formulário TecLoja</span>
  </nav>

  <div style="max-width: 600px; margin: 3rem auto; padding: 0 1rem;">
    <div class="glass-panel">
      <h2 style="margin-bottom: 2rem;">{{ id ? 'Editar Eletrônico' : 'Cadastrar Novo Eletrônico' }}</h2>

      <form @submit.prevent="salvar">
        <div class="form-group">
          <label class="form-label">Nome do Eletrônico</label>
          <input type="text" class="form-control" v-model="produto.nome" required @blur="erros.nome = !produto.nome">
          <span v-if="erros.nome" style="color: var(--danger-color); font-size: 0.8rem;">O nome é obrigatório.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Descrição Técnica</label>
          <textarea class="form-control" rows="3" v-model="produto.descricao"></textarea>
        </div>

        <div style="display: flex; gap: 1rem;">
          <div class="form-group" style="flex: 1;">
            <label class="form-label">Preço (R$)</label>
            <input type="number" step="0.01" class="form-control" v-model="produto.preco" required>
          </div>

          <div class="form-group" style="flex: 1;">
            <label class="form-label">Estoque Físico</label>
            <input type="number" class="form-control" v-model="produto.estoque" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Categoria (1=Smartphones, 2=Notebooks, 3=Acessórios)</label>
          <input type="number" class="form-control" v-model="produto.categoria_id" required>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <router-link to="/admin/produtos" class="btn btn-danger">Cancelar</router-link>
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">Salvar Alterações</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import type { Produto } from '../../models';

const router = useRouter();

// Define a prop recebida dinamicamente do roteador
const props = defineProps<{
  id?: string;
}>();

const produto = ref<Produto>({
  nome: '',
  descricao: '',
  preco: 0.01,
  estoque: 0,
  categoria_id: 1
});

const erros = ref({
  nome: false
});

// Validação reativa sem bibliotecas extras (Didático e eficiente)
const isFormValid = computed(() => {
  return produto.value.nome.trim().length >= 3 &&
         produto.value.preco > 0 &&
         produto.value.estoque >= 0 &&
         produto.value.categoria_id >= 1;
});

const carregarProdutoEdicao = async (id: number) => {
  try {
    const res = await api.get<Produto>(`/produtos/${id}`);
    produto.value = res.data;
  } catch (err) {
    alert("Falha ao obter produto.");
  }
};

const salvar = async () => {
  if (!isFormValid.value) return;

  try {
    if (props.id) {
      await api.put(`/produtos/${props.id}`, produto.value);
    } else {
      await api.post('/produtos', produto.value);
    }
    router.push('/admin/produtos');
  } catch (err: any) {
    alert("Erro ao salvar produto: " + err.response?.data?.message);
  }
};

onMounted(() => {
  if (props.id) {
    carregarProdutoEdicao(Number(props.id));
  }
});
</script>
