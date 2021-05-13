<template>
  <div class="col-2 sidebar-section">
    <div class="thumbnail-view-container">
      <div class="thumbnail-view-header">
        <div>
          <div
            class="header-color"
            :style="{ 'background-color': 'blue' }"
          ></div>
          <v-icon>arrow_drop_down</v-icon>
          <div class="header-name">
            Cover
            <span>(1)</span>
          </div>
        </div>
      </div>
      <template v-for="section in project.sections">
        <div v-for="sheet in section.sheets" :section="section" :key="sheet.id">
          <Thumbnail :sheet="sheet" :edit="false" :link="false" />
        </div>
      </template>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
