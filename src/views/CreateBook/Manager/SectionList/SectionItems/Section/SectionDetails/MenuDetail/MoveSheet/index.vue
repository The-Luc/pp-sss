<template>
  <div class="menu-item mb-2">
    <label class="text-300 text-size-sm text-line-14">{{ title }}:</label>
    <div class="d-flex mb-2 align-center title" @click="onChangeStatus">
      <img :src="arrowDown" class="arrow-down" alt="arrown-down" />
      <span class="text-500 text-size-md d-block">{{ value }}</span>
    </div>
    <div v-if="isShow" class="menu-move-sheet">
      <div
        v-for="section in sections"
        :key="section.id"
        class="menu-move-sheet-item"
        @click="onMoveSheet(section.id)"
      >
        <div
          class="menu-move-sheet-color"
          :style="{ 'background-color': section.color }"
        ></div>
        <div class="text-500 menu-move-sheet-title">
          {{ section.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
