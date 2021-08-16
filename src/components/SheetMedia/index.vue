<template>
  <div class="sheet-media-container">
    <Draggable :sort="false" @choose="onChoose" @unchoose="onUnchoose">
      <div v-for="(item, i) in media" :key="i" class="media-item">
        <v-icon class="media-icon" @click="onShowRemoveModal(item)">
          delete_forever
        </v-icon>
        <img :src="item.thumbUrl" alt="" />
        <div v-show="item.inProject" class="indicator">In Project</div>
      </div>
    </Draggable>
    <ModalRemovePhoto
      :open="showRemoveModal"
      @remove="onRemove"
      @cancel="onCancel"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
