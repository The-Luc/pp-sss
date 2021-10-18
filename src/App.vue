<template>
  <v-app>
    <notifications
      group="foo"
      position="top left"
      style="margin:5px"
      :max="5"
    />
    <ModalManager />
    <v-main>
      <v-overlay :value="!isVisited && isPrompt"></v-overlay>

      <HeaderControl />
      <router-view></router-view>
    </v-main>
    <loading v-show="isLoading"></loading>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useAppCommon } from '@/hooks/common';

import ModalManager from '@/containers/ModalManager';
import HeaderControl from '@/views/CreateBook/HeadControl';
import Loading from '@/components/Modals/Loading';
import { GETTERS as APP_GETTER } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { ACTIONS } from '@/store/modules/book/const';

export default {
  components: {
    ModalManager,
    HeaderControl,
    Loading
  },
  setup() {
    const { getAppDetail, isLoading } = useAppCommon();
    return {
      getAppDetail,
      isLoading
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
        this.getBook({ bookId: to.params.bookId });
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
