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
        :is-open-menu="isOpenMenu"
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
    <action
      :is-open-menu="isOpenMenu"
      :section-id="section.id"
      :section-name="section.name"
      :assignee-id="section.assigneeId"
      :due-date="section.dueDate"
      :status="section.status"
      :menu-x="menuX"
      :menu-y="menuY"
      @closeMenu="onCloseMenu"
    >
      <div v-if="!isDigital" class="menu-button">
        <button @click="onPreview">Preview</button>
        <button @click="onPdf">PDF</button>
      </div>
    </action>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
