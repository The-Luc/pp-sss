<template>
  <div class="themes-container">
    <PpToolPopover title="Themes">
      <div class="pp-selected-theme">
        <div class="pp-selected-theme--header">
          <span class="pp-selected-theme--header--selected-title"
            >Selected Theme:</span
          >
          <PpSelect :items="items" />
        </div>
      </div>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
