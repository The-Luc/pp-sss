<template>
  <div>
    <label class="text-500 text-size-xsm">Offset:</label>
    <Slider suffix=" pt" :max="50" :value="value" @change="onChange" />
  </div>
</template>
<script src="./script.js" />
