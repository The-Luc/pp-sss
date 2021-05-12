<template>
  <div class="book book-control">
    <PpButton
      :is-active="currentView === bookViewType.PRINT"
      type="btn"
      link-to="/edit/print"
      @click="onChangeView(bookViewType.PRINT)"
    >
      Print Edition
    </PpButton>
    <LineVertical />
    <PpButton
      :is-active="currentView === bookViewType.MANAGER"
      type="btn"
      link-to="/edit/manager"
      @click="onChangeView(bookViewType.MANAGER)"
    >
      Manager
    </PpButton>
    <LineVertical />
    <PpButton
      :is-active="currentView === bookViewType.DIGITAL"
      type="btn"
      link-to="/edit/digital"
      @click="onChangeView(bookViewType.DIGITAL)"
    >
      Digital Edition
    </PpButton>
  </div>
</template>

<script src="./script.js" />
