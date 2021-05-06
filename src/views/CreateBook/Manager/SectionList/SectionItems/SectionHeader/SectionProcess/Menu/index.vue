<template>
  <v-row justify="space-around">
    <v-menu bottom content-class="my-menu">
      <template #activator="{ on }">
        <img src="@/assets/icons/more.svg" v-on="on" />
      </template>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-row>
</template>
<script>
export default {
  props: {
    sectionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' }
      ]
    };
  }
};
</script>
<style lang="scss">
.my-menu {
  margin-top: 25px;
  contain: initial;
  width: 180px;
  overflow: visible;
}
.my-menu::before {
  position: absolute;
  content: '';
  top: 0;
  left: 50%;
  transform: translateY(-100%);
  width: 10px;
  height: 13px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid #fff;
}
</style>
