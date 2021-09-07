<template>
  <div class="frames-container">
    <frame-menu
      :is-open="isOpenMenu"
      :menu-x="menuX"
      :menu-y="menuY"
      @onClose="onCloseMenu"
      @onReplaceLayout="onReplaceLayout"
      @onDeleteFrame="onDeleteFrame"
    ></frame-menu>

    <div class="row frame-row">
      <draggable
        v-model="frames"
        class="row frame-row actual"
        ghost-class="ghost"
        drag-class="drag-item"
        :move="onMove"
        @choose="onChoose"
        @start="drag = true"
        @end="onEnd"
        @unchoose="onUnchoose"
      >
        <div
          v-for="({ id, frame }, index) in frames"
          :key="id"
          :ref="`frame-${id}`"
          class="frame-container"
          @click="onFrameClick(id)"
        >
          <div
            v-if="index > 0"
            class="transition"
            :class="{ active: isTransitionIconActive(index) }"
            @click="onTransitionClick($event, index - 1)"
          >
            <v-icon>auto_awesome_motion</v-icon>
          </div>

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
      </draggable>

      <empty-frame v-if="showAddFrame" @click="addFrame"></empty-frame>
    </div>

    <transition-properties
      v-if="transitionIndex > -1"
      :index="transitionIndex"
      :top="transitionY"
      :left="transitionX"
      @onClose="closeTransitionMenu"
    ></transition-properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
