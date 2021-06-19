<template>
  <div class="opacity-container">
    <label class="text-500 text-size-xsm">Opacity:</label>

    <Slider :value="opacity" @change="onChange" />
  </div>
</template>

<script src="./script.js" />
