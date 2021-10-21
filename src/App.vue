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
      <v-overlay :value="isPrompt"></v-overlay>

      <HeaderControl />
      <router-view></router-view>
    </v-main>
    <loading v-show="isLoading"></loading>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

import ModalManager from '@/containers/ModalManager';
import HeaderControl from '@/views/CreateBook/HeadControl';
import Loading from '@/components/Modals/Loading';
import { GETTERS as APP_GETTER } from '@/store/modules/app/const';
import { useAppCommon } from './hooks';

export default {
  components: {
    ModalManager,
    HeaderControl,
    Loading
  },
  setup() {
    const { isLoading } = useAppCommon();
    return {
      isLoading
    };
  },
  computed: {
    ...mapGetters({
      isPrompt: APP_GETTER.IS_PROMPT
    })
  }
};
</script>
