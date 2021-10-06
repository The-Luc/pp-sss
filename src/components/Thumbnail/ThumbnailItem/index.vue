<template>
  <div
    class="thumbnail-view-item"
    :class="[displayCssClass, ...customCssClass]"
  >
    <div class="thumbnail-view-container">
      <Header
        v-if="!isEditor"
        :name="name"
        :color="color"
        :custom-css-class="customCssClass"
        :total-item="totalItem"
        :is-toggle-content-available="isEditor"
        :is-more-activated="isMoreActivated"
        :is-admin="isAdmin"
        @toggleMenu="toggleMenu"
      />

      <Content
        :to-link="toLink"
        :sheet-type="sheetType"
        :thumbnail-url="thumbnailUrl"
        :custom-css-class="customCssClass"
        :is-active="isActive"
        :is-edit-icon-displayed="!isEditor"
        @select="onSelect"
      />

      <Footer
        :link-type="linkType"
        :page-names="pageNames"
        :custom-css-class="customCssClass"
        :is-link-icon-displayed="!isEditor"
        :is-digital="isDigital"
        :is-editor="isEditor"
        @updateLink="onUpdateLink"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
