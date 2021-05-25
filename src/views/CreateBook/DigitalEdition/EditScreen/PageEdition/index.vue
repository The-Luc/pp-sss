<template>
  <div class="page-edition">
    <div class="row digital-canvas">
      <canvas id="canvas"></canvas>
    </div>
    <div class="row digital-frame">
      <div class="container-digital-frame">
        <div class="item-digital-frame active"></div>
        <div class="name-frame">Frame 10</div>
      </div>
      <div class="container-digital-frame">
        <div class="item-digital-frame add-frame">
          <div class="add-digital-frame">
            <v-icon>add_circle_outline</v-icon>
            Add Frame
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
