import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css'; // Carregará o layout de estilos premium

const app = createApp(App);

app.use(router); // Habilita o Vue Router na aplicação

app.mount('#app');
