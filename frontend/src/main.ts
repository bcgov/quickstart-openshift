/**
 * Vue3 Main script
 */

// Load vue core
import { createApp } from 'vue';
import router from './router';
import store from './store';

// @ts-ignore
// Load Vuetify
import vuetify from './plugins/vuetify';

// Load Layout vue.
import App from './App.vue';

/** Register Vue */
const vue = createApp(App);
vue.use(router);
vue.use(store);
vue.use(vuetify);

// Run!
router.isReady().then(() => {
  vue.mount('#app');
});
export default vue;
