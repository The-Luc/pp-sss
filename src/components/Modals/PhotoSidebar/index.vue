<template>
  <div class="sidebar-photo">
    <PhotoContent
      :show-autoflow="isShowAutoflow"
      :media-type="mediaType"
      :disabled-autoflow="disabledAutoflow"
      @click="closePhotoContent"
      @addPhoto="openModalAddPhoto"
      @autoflow="autoflowPhotos"
    >
      <div
        v-show="isShowAutoflow"
        ref="mediaContainer"
        class="sheet-media-container"
      >
        <Draggable :sort="false" @choose="onChoose" @unchoose="onUnchoose">
          <div
            v-for="(item, idx) in media"
            :key="`${item.id}-${idx}`"
            class="media-item"
          >
            <v-icon class="media-icon" @click="onShowRemoveModal(item)">
              delete_forever
            </v-icon>
            <v-icon v-if="isVideo(item.type)" class="type-icon">
              videocam
            </v-icon>
            <v-icon v-if="isComposition(item.type)" class="type-icon">
              collections_bookmark
            </v-icon>
            <img :src="item.thumbUrl" alt="thumbnail" />
            <div v-show="item.inProject" class="indicator">In Project</div>
          </div>
        </Draggable>
      </div>
    </PhotoContent>

    <ModalRemovePhoto
      :modal-type="mediaType"
      :delete-type="deleteType"
      :open="showRemoveModal"
      @remove="onRemove"
      @cancel="onCancel"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
