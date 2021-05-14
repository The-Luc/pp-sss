<template>
  <div class="book book-control">
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.PRINT) > -1"
      type="btn"
      link-to="/edit/print"
      @click="onChangeView(screen.PRINT)"
    >
      Print Edition
    </PpButton>
    <LineVertical />
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.MANAGER) > -1"
      type="btn"
      link-to="/edit/manager"
      @click="onChangeView(screen.MANAGER)"
    >
      Manager
    </PpButton>
    <LineVertical />
    <PpButton
      v-if="screen"
      :is-active="path.indexOf(screen.DIGITAL) > -1"
      type="btn"
      link-to="/edit/digital"
      @click="onChangeView(screen.DIGITAL)"
    >
      Digital Edition
    </PpButton>
  </div>
</template>

<script src="./script.js" />
