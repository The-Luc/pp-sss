<template>
  <div class="details">
    <div class="group">
      <the-transition
        :selected-transition="transition"
        @transitionChange="onTransitionChange"
      ></the-transition>

      <the-preview
        :transition-index="transitionIndex"
        :transition="transition"
        :direction="direction"
        :duration="duration"
      ></the-preview>
    </div>

    <div v-if="isTransitionChanged" class="group">
      <the-transition-target
        @targetChange="onTargetChange"
      ></the-transition-target>

      <the-transition-application
        @transitionApply="onTransitionApply"
      ></the-transition-application>
    </div>

    <div class="group">
      <the-direction
        :selected-direction="direction"
        :disabled="isDirectionDisabled"
        @directionChange="onDirectionChange"
      ></the-direction>

      <the-duration
        :selected-duration="duration"
        :disabled="isDurationDisabled"
        @durationChange="onDurationChange"
      ></the-duration>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
