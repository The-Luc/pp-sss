<template>
  <v-app>
    <ModalManager />
    <v-main>
      <v-overlay :value="!isVisited && isPrompt"></v-overlay>

      <HeaderControl />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useAppCommon } from '@/hooks/common';

import ModalManager from '@/containers/ModalManager';
import HeaderControl from '@/views/CreateBook/HeadControl';
import { GETTERS as APP_GETTER } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { ACTIONS } from '@/store/modules/book/const';

export default {
  components: {
    ModalManager,
    HeaderControl
  },
  setup() {
    const { getAppDetail } = useAppCommon();
    return {
      getAppDetail
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      isPrompt: APP_GETTER.IS_PROMPT
    }),
    isVisited() {
      return this.pageSelected?.isVisited || false;
    }
  },
  watch: {
    $route(to) {
      if (to.name && to.name !== 'login') {
        this.getBook(to.params.bookId);
      }
    }
  },
  methods: {
    ...mapActions({
      getBook: ACTIONS.GET_BOOK
    })
  }
};
</script>
