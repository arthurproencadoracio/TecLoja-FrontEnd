<template>
  <div class="login-container" style="max-width: 400px; margin: 4rem auto; padding: 2rem;">
    <div class="glass-panel">
      <h2 style="margin-bottom: 2rem;">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Usuário</label>
          <input type="text" class="form-control" v-model="username" required />
        </div>
        <div class="form-group">
          <label class="form-label">Senha</label>
          <input type="password" class="form-control" v-model="password" required />
        </div>
        <p v-if="error" style="color: var(--danger-color);">{{ error }}</p>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Entrar</button>
      </form>
      <router-link to="/" style="display: block; text-align: center; margin-top: 1rem;">Voltar ao Catálogo</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const auth = useAuth();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    await auth.login(username.value, password.value);
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
