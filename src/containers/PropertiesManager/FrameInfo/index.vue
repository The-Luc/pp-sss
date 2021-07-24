<template>
  <Properties title="Frame Information">
    <div class="frame-info-container">
      <InputTitle
        title-name="Frame Title:"
        :title-value="titleFrame"
        @change="onChangeTitle"
      />
      <div class="opts-container">
        <div class="frame-headline">Timing:</div>
        <div class="timing-opts">
          <div class="timning-play-in">
            <span class="opt-title">Play In:</span>
            <input
              class="frame-text-input"
              type="text"
              value="0.8 s"
              disabled
            />
          </div>

          <div class="timning-delay">
            <span class="opt-title">Delay:</span>
            <PpSelect
              :items="delayOpts"
              :selected-val="delayOpts[1]"
              @change="onChangeDelay"
            />
          </div>

          <div class="timning-play-out">
            <span class="opt-title">Play Out:</span>
            <input class="frame-text-input" type="text" value="0 s" disabled />
          </div>
        </div>
      </div>
    </div>
  </Properties>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
