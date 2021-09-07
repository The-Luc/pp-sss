<template>
  <div class="transition-item">
    <the-header
      v-if="isHeaderDisplayed"
      :first-frame="firstFrame"
      :second-frame="secondFrame"
      :is-expand="isExpand"
      @toggleExpand="onToggleExpand"
    ></the-header>

    <the-detail
      v-if="isExpand"
      :transition="currentTransition"
      :direction="currentDirection"
      :duration="currentDuration"
      :is-transition-changed="isTransitionChanged"
      @transitionChange="onTransitionChange"
      @directionChange="onDirectionChange"
      @durationChange="onDurationChange"
      @targetChange="onTargetChange"
      @transitionApply="onTransitionApply"
    ></the-detail>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
