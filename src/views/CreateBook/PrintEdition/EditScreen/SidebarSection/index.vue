<template>
  <div class="col-2 sidebar-section">
    <div class="section-item active">
      <div class="section-header">
        <div class="header-color"></div>
        <v-icon class="header-arrow">arrow_drop_down</v-icon>
        <div class="header-name">Cover</div>
        <div class="header-quatity">(1)</div>
      </div>
      <div class="section-body">
        <div class="section-thumbnail">
          <div class="thumbnail-left"></div>
          <div class="thumbnail-right"></div>
        </div>
        <div class="section-number-page">
          <div class="number-page-left">Back Cover</div>
          <div class="number-page-right">Font Cover</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './index.scss';
export default {
  name: 'SidebarSection',
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style lang=""></style>
