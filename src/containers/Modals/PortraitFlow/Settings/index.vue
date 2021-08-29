<template>
  <v-tabs vertical hide-slider @change="onTabChange">
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
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
