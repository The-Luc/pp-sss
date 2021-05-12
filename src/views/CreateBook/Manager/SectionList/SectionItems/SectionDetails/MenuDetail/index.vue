<template>
  <div class="menu-detail">
    <MoveSheet
      title="Move To"
      value="Choose a Section"
      :isShow="isShow"
      :sections="sections"
      @onChangeStatus="onChangeMenuMove"
    >
    </MoveSheet>
    <slot />
  </div>
</template>

<script src="./script.js" />
