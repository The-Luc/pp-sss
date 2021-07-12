<template>
  <div class="frames-container">
    <FrameMenu
      :is-open="isOpenMenu"
      :menu-x="menuX"
      :menu-y="menuY"
      @onClose="onCloseMenu"
      @onReplaceLayout="onReplaceLayout"
      @onDeleteFrame="onDeleteFrame"
    />
    <Draggable
      v-model="frameList"
      class="row frame-row"
      ghost-class="ghost"
      drag-class="drag-item"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
      @unchoose="onUnchoose"
    >
      <div
        v-for="({ id, frame }, index) in frameList"
        :key="id"
        :ref="`frame-${id}`"
        class="frame-container"
        @click="onFrameClick(id)"
      >
        <div
          class="frame-item"
          :class="{
            active: id === activeFrameId,
            'drag-target': id === dragTargetId
          }"
        >
          <img
            v-if="id === activeFrameId && !isOpenMenu && !frame.fromLayout"
            class="frame-item-option"
            src="@/assets/icons/three-dots.svg"
            alt="option button"
            @click="onOptionClick($event, id)"
          />
          <img
            v-if="frame.previewImageUrl"
            :src="frame.previewImageUrl"
            alt="frame thumbnail"
            class="frame-image"
          />
        </div>
        <div class="frame-name">Frame {{ index + 1 }}</div>
      </div>
      <EmptyFrame v-if="showAddFrame" @click="addFrame" />
    </Draggable>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
