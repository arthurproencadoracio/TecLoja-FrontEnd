import { ref, computed } from 'vue';
import api from '../services/api';
import { CartItem, Produto } from '../models';
import { useAuth } from './useAuth';

// Estado global do carrinho
const itens = ref<CartItem[]>([]);

export function useCart() {
  const auth = useAuth();

  // Getters Computados Reativos (Memoized)
  const totalItens = computed(() => itens.value.reduce((acc, item) => acc + item.quantidade, 0));
  
  const valorTotal = computed(() => itens.value.reduce((acc, item) => acc + (item.preco * item.quantidade), 0));
  
  const cartItens = computed(() => itens.value);

  const adicionar = (produto: Produto) => {
    if (!produto.id) return;
    
    const itemExistente = itens.value.find(i => i.produto_id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      itens.value.push({
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1
      });
    }
  };

  const remover = (produtoId: number) => {
    itens.value = itens.value.filter(i => i.produto_id !== produtoId);
  };

  const limpar = () => {
    itens.value = [];
  };

  // Realiza o checkout integrando diretamente à nossa API FastAPI
  const finalizarPedido = async () => {
    if (!auth.isAuthenticated.value) {
      throw new Error("Você precisa estar autenticado para finalizar a compra.");
    }

    // Estrutura o DTO idêntico ao esperado pelo Schema Pydantic v2 do backend
    const pedidoForm = {
      cliente_id: 1, // ID fixado do seeder 'Maria Silva'
      itens: itens.value.map(i => ({
        produto_id: i.produto_id,
        quantidade: i.quantidade
      }))
    };

    await api.post('/pedidos', pedidoForm);
    limpar(); // Esvazia o carrinho apenas em caso de sucesso transacional na API
  };

  return {
    cartItens,
    totalItens,
    valorTotal,
    adicionar,
    remover,
    limpar,
    finalizarPedido
  };
}
