<template>
  <Properties title="Frame Information">
    <div class="frame-info-container">
      <InputTitle
        :key="componentKey"
        maxlength="50"
        title-name="Frame Title:"
        :title-value="frameTitle"
        @change="onChangeTitle"
      />
      <div class="opts-container">
        <div class="frame-headline">Timing:</div>
        <div class="timing-opts">
          <div class="timing-play-in">
            <span class="opt-title">Play In:</span>
            <input
              class="frame-text-input"
              type="text"
              :value="playInValue"
              disabled
            />
          </div>
          <div class="timing-delay">
            <span class="opt-title">Delay:</span>
            <pp-combobox
              :key="componentKey"
              :items="delayOpts"
              :selected-val="selectedDelay"
              :margin-menu="0"
              :nudge-width="90"
              :appended-icon="appendedIcon"
              @change="onChangeDelay"
            />
          </div>

          <div class="timing-play-out">
            <span class="opt-title">Play Out:</span>
            <input
              class="frame-text-input"
              type="text"
              :value="playOutValue"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  </Properties>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
