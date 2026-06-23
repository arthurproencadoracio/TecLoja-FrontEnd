<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-brand">🛒 TecLoja</router-link>
  </nav>
  <div style="padding: 2rem 5%;">
    <h2 style="margin-bottom: 2rem;">Carrinho de Compras</h2>
    <div v-if="cart.cartItens.value.length === 0" class="glass-panel" style="text-align: center; padding: 3rem;">
      <p>Seu carrinho está vazio.</p>
      <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Ver Catálogo</router-link>
    </div>
    <div v-else>
      <div class="glass-panel" v-for="item in cart.cartItens.value" :key="item.produto_id" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <strong>{{ item.nome }}</strong><br />
          <span>R$ {{ item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }} x {{ item.quantidade }}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn btn-primary" style="padding: 0.25rem 0.75rem;" @click="cart.remover(item.produto_id)">-</button>
          <span>{{ item.quantidade }}</span>
          <button class="btn btn-primary" style="padding: 0.25rem 0.75rem;" @click="cart.adicionar({ id: item.produto_id, nome: item.nome, preco: item.preco } as any)">+</button>
        </div>
      </div>
      <div class="glass-panel" style="text-align: right; margin-top: 1rem;">
        <h3>Total: R$ {{ cart.valorTotal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</h3>
        <button class="btn btn-primary" @click="cart.finalizarPedido()">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart';

const cart = useCart();
</script>
