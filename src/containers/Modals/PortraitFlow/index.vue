<template>
  <div id="portrait-folow">
    <CommonModal
      title="Portrait Flow"
      accept-text="Apply Portraits to Pages"
      container="#portrait-folow"
      width="1162"
      :is-open-modal="isOpen"
      :is-disable-accept="false"
      @cancel="onCancel"
      @accept="onAccept"
    >
      <div class="preview-container"></div>

      <v-tabs v-model="currentTab" vertical hide-slider>
        <div class="settings">
          <TabHeader title="Portrait Settings" />
          <TabHeader title="Text Settings" />
          <TabHeader title="Image Settings" />
          <TabHeader title="Flow Settings" />
        </div>

        <div class="save-settings">
          <v-btn class="btn save" @click="onSaveSettings">Save Settings</v-btn>
        </div>
      </v-tabs>

      <v-tabs-items v-model="currentTab">
        <v-tab-item>Portrait Settings Component</v-tab-item>
        <v-tab-item>Text Settings Component</v-tab-item>
        <v-tab-item>Image Settings Component</v-tab-item>
        <v-tab-item>Flow Settings Component</v-tab-item>
      </v-tabs-items>
    </CommonModal>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
