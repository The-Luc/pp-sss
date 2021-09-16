<template>
  <div id="save-settings">
    <common-modal
      title="Save Portrait Settings"
      width="559"
      container="#save-settings"
      :is-open-modal="isOpenModal"
      :is-theme-used="true"
      :is-close-out-side="false"
      :is-footer-displayed="false"
      :is-close-icon-displayed="false"
    >
      <div class="save-settings-body">
        <div class="style-name">
          <label>Add a name for these settings:</label>
          <input v-model="settingName" maxlength="50" type="text" />
        </div>
      </div>
      <div class="save-settings-footer">
        <pp-button class="pp-btn-save" is-active @click="onSaveSettings">
          Save Settings
        </pp-button>
        <pp-button class="pp-btn-cancel" @click="onCancel">
          Cancel
        </pp-button>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
