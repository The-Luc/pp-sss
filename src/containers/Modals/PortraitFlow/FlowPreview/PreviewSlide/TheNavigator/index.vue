<template>
  <div
    class="slide-navigator"
    :class="{ digital: isDigital, disabled: disabled }"
  >
    <move-control
      is-back-control
      :disabled="!isPosibleToBack"
      @click="onBack"
    ></move-control>

    <div class="paging">
      <i
        v-for="(page, index) in pages"
        :ref="`page${isActivated(index) ? 'Selected' : ''}`"
        :key="index"
        class="material-icons item"
        :data-test="index"
        :data-test2="index === currentPageIndex"
        :class="{ active: isActivated(index) }"
        @click="onSelected(index)"
      >
        circle
      </i>
    </div>

    <move-control
      :is-back-control="false"
      :disabled="!isPosibleToNext"
      @click="onNext"
    ></move-control>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
