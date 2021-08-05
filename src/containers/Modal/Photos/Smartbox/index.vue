<template>
  <div class="smartbox-container">
    <GotIt
      v-if="!isPhotoVisited"
      :title="promptTitle"
      :message="promptMsg"
      @click="onClickGotIt"
    />
    <div class="header">
      <div class="keyword-title">Showing results for:</div>
      <div class="keyword-content">
        <Tags key-word="keyword" />
      </div>
    </div>
    <div class="content">
      content
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
