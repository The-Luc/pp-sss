<template>
  <div class="book book-control">
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.PRINT) > -1"
      type="btn"
      :link-to="{ name: routeName.PRINT }"
      @click="onChangeView(screen.PRINT, routeName.PRINT)"
    >
      Print Edition
    </PpButton>
    <LineVertical />
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.MANAGER) > -1"
      type="btn"
      :link-to="{ name: routeName.MANAGER }"
      @click="onChangeView(screen.MANAGER, routeName.MANAGER)"
    >
      Manager
    </PpButton>
    <LineVertical />
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.DIGITAL) > -1"
      type="btn"
      :link-to="{ name: routeName.DIGITAL }"
      @click="onChangeView(screen.DIGITAL, routeName.DIGITAL)"
    >
      Digital Edition
    </PpButton>
  </div>
</template>

<script src="./script.js" />
