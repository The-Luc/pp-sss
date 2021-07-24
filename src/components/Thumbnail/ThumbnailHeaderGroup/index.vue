<template>
  <div
    class="thumbnail-view-item"
    :class="customCssClass"
    @click="toggleContent"
  >
    <div class="thumbnail-view-container">
      <Header
        :name="name"
        :color="color"
        :custom-css-class="customCssClass"
        :total-item="totalItem"
        :is-expanded="isExpanded"
        :is-toggle-content-available="true"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
