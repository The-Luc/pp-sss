<template>
  <div class="opacity-container">
    <label class="text-500 text-size-xsm">Opacity:</label>

    <Slider :value="opacity" :disabled="disabled" @change="onChange" />
  </div>
</template>

<script src="./script.js" />
