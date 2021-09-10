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
        handle=".frame-item"
        :move="onMove"
        @choose="onChoose"
        @start="drag = true"
        @end="onEnd"
        @unchoose="onUnchoose"
      >
        <!--<template v-for="({ id, frame }, index) in frames">-->
        <!--<template v-for="index in frames.length * 2">
          <div
            v-if="index > 0 && index % 2 === 0"
            :key="`transaction-${index}`"
            class="transition"
            :class="{ active: false }"
            @click="toggleTransitionPopup"
          >
            <v-icon>auto_awesome_motion</v-icon>
          </div>
          <frame
            v-if="index % 2 !== 0"
            :id="getFrame(index).id"
            :key="index"
            :ref="`frame-${getFrame(index).id}`"
            :index="getIndex(index)"
            :preview-image-url="getFrame(index).frame.previewImageUrl"
            :is-package-layout="getFrame(index).frame.fromLayout"
            :active-id="activeFrameId"
            :drag-target-id="dragTargetId"
            :active-transition-index="transitionIndex"
            :is-frame-menu-displayed="isOpenMenu"
            @click="onFrameClick"
            @toggleTransition="toggleTransitionPopup"
            @toggleMenu="onOptionClick"
          ></frame>
        </template>-->
        <frame
          v-for="({ id, frame }, index) in frames"
          :id="id"
          :key="id"
          :ref="`frame-${id}`"
          :index="index"
          :preview-image-url="frame.previewImageUrl"
          :is-package-layout="frame.fromLayout"
          :active-id="activeFrameId"
          :drag-target-id="dragTargetId"
          :active-transition-index="transitionIndex"
          :is-frame-menu-displayed="isOpenMenu"
          @click="onFrameClick"
          @toggleTransition="toggleTransitionPopup"
          @toggleMenu="onOptionClick"
        ></frame>
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
