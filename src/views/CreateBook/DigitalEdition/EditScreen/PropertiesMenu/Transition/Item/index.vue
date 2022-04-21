<template>
  <div class="transition-item">
    <the-header
      v-if="isHeaderDisplayed"
      :transition-index="transitionIndex"
      :is-expand="isExpand"
      @toggleExpand="onToggleExpand"
    ></the-header>

    <the-detail
      v-if="isExpand"
      :transition-index="transitionIndex"
      :transition="currentTransition"
      :direction="currentDirection"
      :duration="currentDuration"
      :is-setting-changed="isSettingChanged"
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
