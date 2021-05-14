<template>
  <div class="col-2 sidebar-section">
    <div class="thumbnail-view-container">
      <div
        v-for="section in project.sections"
        :key="section.id"
        class="thumbnail-view-header"
      >
        <div class="header-container" @click="isOpen = !isOpen">
          <div
            class="header-color"
            :style="{ 'background-color': `${section.color}` }"
          ></div>
          <v-icon>arrow_drop_down</v-icon>
          <div class="header-name">
            {{ section.name }}
            <span>(1)</span>
          </div>
        </div>

        <div v-show="isOpen" class="sheet-container">
          <Thumbnail
            v-for="sheet in section.sheets"
            :key="sheet.id"
            :sheet="sheet"
            :edit="false"
            :link="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
