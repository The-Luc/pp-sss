<template>
  <v-app>
    <ModalManager />
    <v-main>
      <v-overlay :value="isPrompt"></v-overlay>

      <HeaderControl />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

import ModalManager from '@/containers/ModalManager';
import HeaderControl from '@/views/CreateBook/HeadControl';
import { GETTERS as APP_GETTER } from '@/store/modules/app/const';

export default {
  components: {
    ModalManager,
    HeaderControl
  },
  computed: {
    ...mapGetters({
      isPrompt: APP_GETTER.IS_PROMPT
    })
  }
};
</script>
