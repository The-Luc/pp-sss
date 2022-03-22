<template>
  <Modal title="Save Layout" width="560" :is-close-out-side="false">
    <div class="modal-save-digital-frames">
      <template v-if="isChooseType">
        <PpButton is-active @click="onSelectedFrame">
          Save Selected Frame
        </PpButton>
        <PpButton is-active @click="onChooseFrames">
          Save Multiple Frames (Up to 4)
        </PpButton>
      </template>

      <name-saved-layout v-else-if="isNameLayout" @save="saveLayout" />

      <choose-frames
        v-else
        :frame-ids="frameIds"
        @onChooseFrames="onSelectMultiFrames"
      />

      <PpButton is-active class="btn-cancel" @click="onCancel">
        Cancel
      </PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
