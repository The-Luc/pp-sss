<template>
  <div class="menu-detail">
    <Item
      title="Move To"
      value="Choose a Section"
      @click.native="isShow = !isShow"
    >
      <div v-if="isShow" class="menu-move-sheet">
        <div class="menu-move-sheet-item">
          <div
            class="menu-move-sheet-color"
            :style="{ 'background-color': 'red' }"
          ></div>
          <div class="text-500 menu-move-sheet-title">
            Administration & Staff
          </div>
        </div>
        <div class="menu-move-sheet-item">
          <div
            class="menu-move-sheet-color"
            :style="{ 'background-color': 'red' }"
          ></div>
          <div class="text-500 menu-move-sheet-title">
            Administration & Staff
          </div>
        </div>
        <div class="menu-move-sheet-item">
          <div
            class="menu-move-sheet-color"
            :style="{ 'background-color': 'red' }"
          ></div>
          <div class="text-500 menu-move-sheet-title">
            Administration & Staff
          </div>
        </div>
        <div class="menu-move-sheet-item">
          <div
            class="menu-move-sheet-color"
            :style="{ 'background-color': 'red' }"
          ></div>
          <div class="text-500 menu-move-sheet-title">
            Administration & Staff
          </div>
        </div>
        <div class="menu-move-sheet-item">
          <div
            class="menu-move-sheet-color"
            :style="{ 'background-color': 'red' }"
          ></div>
          <div class="text-500 menu-move-sheet-title">
            Administration & Staff
          </div>
        </div>
      </div>
    </Item>
    <slot />
  </div>
</template>

<script src="./script.js" />
