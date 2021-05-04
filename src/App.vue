<template>
  <v-app>
    <ModalManager />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import ModalManager from "./components/ModalManager";
export default {
  components: {
    ModalManager
  }
};
</script>
