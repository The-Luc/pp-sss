<template>
  <div class="d-flex flex-column flip-container">
    <span class="properties-title" :class="{ disabled: disabled }">Flip:</span>

    <div class="d-flex">
      <flip-control
        :disabled="disabled"
        @click="onClickHorizontal"
      ></flip-control>

      <flip-control
        :is-horizontal="false"
        :disabled="disabled"
        @click="onClickVertical"
      ></flip-control>
    </div>
  </div>
</template>

<script src="./script.js" />
