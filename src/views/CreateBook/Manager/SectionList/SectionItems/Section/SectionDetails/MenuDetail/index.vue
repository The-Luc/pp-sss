<template>
  <div class="menu-detail">
    <MoveSheet
      v-click-outside="onCloseMenuMove"
      title="Move To"
      value="Choose a Section"
      :is-show="isShow"
      :sections="sections"
      :sheet-id="sheetId"
      :section-id="sectionId"
      @onChangeStatus="onChangeMenuMove"
    >
    </MoveSheet>
    <slot />
  </div>
</template>

<script src="./script.js" />
