<template>
  <Menu
    v-if="isOpenMenu"
    nudge-width="308"
    :content-class="'pp-menu point-down-menu'"
    :menu-x="menuX"
    :menu-y="menuY"
    :is-open="isOpenMenu"
    @onClickOutSideMenu="onClickOutSideMenu"
  >
    <div class="btn-group">
      <v-btn type="btn" class="btn btn-replace-layout" @click="onReplaceLayout"
        >Change Layout</v-btn
      >
      <v-btn type="btn" class="btn btn-delete" @click="onDelete">Delete</v-btn>
    </div>
  </Menu>
</template>

<script>
import Menu from '@/components/Menu';

export default {
  components: {
    Menu
  },
  props: {
    menuX: {
      type: Number,
      default: 0
    },
    menuY: {
      type: Number,
      default: 0
    },
    isOpen: Boolean
  },
  data() {
    return {
      isOpenMenu: false
    };
  },
  watch: {
    isOpen() {
      this.isOpenMenu = !this.isOpenMenu;
    }
  },
  methods: {
    onClickOutSideMenu() {
      this.$emit('onClose');
    },
    onReplaceLayout() {
      this.$emit('onReplaceLayout');
    },
    onDelete() {
      this.$emit('onDeleteFrame');
    }
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
