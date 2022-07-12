<template>
  <Modal :is-close-out-side="false" :title="header" width="550">
    <div class="confirm-action">
      <div class="text">
        NOTE: Content that has been added to the {{ currEditor }} layout has
        been mapped to the {{ otherEditor }} layout. If you apply this layout to
        both the print and digital editions it will overwrite this content. To
        preserve this content, apply the layout to the {{ currEditor }} edition
        only.
      </div>
      <div
        :class="[
          'img-container',
          { 'one-image': isSingleImg, frame: !isDigital }
        ]"
      >
        <img
          v-for="url in imgUrls"
          :key="url"
          class="preview-thumb"
          :src="url"
          alt="preview thumbnail"
        />
      </div>
      <p v-if="isSingleImg" class="img-title img-title--digital">
        {{ !isDigital ? 'Frame 1' : 'Single Page' }}
      </p>
      <div v-else class="img-title img-title--print">
        <p>Left Page</p>
        <p>Right Page</p>
      </div>
      <div class="btn-container">
        <button class="btn btn-action btn-action--blue" @click="onFirstAction">
          {{ firstActionButton }}
        </button>
        <button class="btn btn-action btn-action--gray" @click="onSecondAction">
          {{ secondActionButton }}
        </button>
        <button class="btn btn-cancel" @click="onCancel">
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
