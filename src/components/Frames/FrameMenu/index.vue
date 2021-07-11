<template>
  <Menu
    v-if="isOpenMenu"
    nudge-width="308"
    :menu-x="menuX"
    :menu-y="menuY"
    :is-open="isOpenMenu"
    @onClickOutSideMenu="onClickOutSideMenu"
  >
    <div class="btn-group">
      <Button type="btn" class="btn btn-replace-layout" @click="onChangeLayout"
        >Change Layout</Button
      >
      <Button type="btn" class="btn btn-delete" @click="onDelete"
        >Delete</Button
      >
    </div>
  </Menu>
</template>

<script>
import Menu from '@/components/Menu';
import Button from '@/components/Buttons/Button';

export default {
  components: {
    Menu,
    Button
  },
  props: ['menuX', 'menuY', 'isOpen'],
  data() {
    return {
      isOpenMenu: false
    };
  },
  watch: {
    isOpen() {
      this.isOpenMenu = !this.isOpenMenu;
      console.log('click option ');
    }
  },
  methods: {
    onClickOutSideMenu() {
      this.$emit('onClose');
    },
    onChangeLayout() {
      this.$emit('onChangeLayout');
    },
    onDelete() {
      this.$emit('onDeleteFrame');
    }
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
