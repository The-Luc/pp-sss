<template>
  <v-dialog
    id="crop-control"
    v-model="open"
    content-class="modal-crop-control"
    persistent
  >
    <div class="header">
      Crop Photo
    </div>

    <div class="body">
      <clipper-fixed
        ref="clipper"
        bg-color="transparent"
        :rotate="rotate"
        :scale="scale"
        :src="src"
        :ratio="ratio"
        :area="area"
        :handle-zoom-event="handleZoomEvent"
        class="clipper"
      >
        <div slot="placeholder">No image</div>
      </clipper-fixed>
      <div class="controls">
        <Control
          title="Zoom"
          :value="scale * 100"
          :max="400"
          @change="onZoom"
        />
        <Control
          title="Rotate"
          :value="rotate"
          :min="-180"
          :max="180"
          @change="onRotate"
        />
      </div>
    </div>
    <div class="footer">
      <PpButton is-active class="pp-btn cancel-btn" @click="onCancel">
        Cancel
      </PpButton>
      <PpButton is-active class="pp-btn" @click="onCrop">
        Done
      </PpButton>
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
