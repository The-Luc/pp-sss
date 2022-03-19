<template>
  <div class="modal-choosing-frames">
    <div class="container-input">
      <div class="input-title">
        Select the frames you would like to save (max. of 4):
      </div>
      <div class="checkbox-container">
        <div v-for="(id, index) in frameIds" :key="id" class="checkbox">
          <v-checkbox
            v-model="selectedFrames"
            :label="`Frame ${index + 1}`"
            :value="id"
            color="#307490"
            :ripple="false"
            dense
            hide-details
          ></v-checkbox>
        </div>
      </div>
    </div>
    <div class="container-btn">
      <PpButton
        is-active
        class="btn-first"
        :is-disabled="isDisabledNextBtn"
        @click="onNext"
        >Next</PpButton
      >
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
