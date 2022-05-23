<template>
  <Properties title="Content Mapping">
    <div class="content-mapping-menu">
      <div class="project_setting">
        <div class="project_setting__title">Project Settings:</div>
        <div class="project_setting__content">
          <div class="config__line">
            Primary Format: <span>{{ primaryFormat }}</span>
          </div>
          <div class="config__line">
            Mapping Functionality:
            <span>{{ enableContentMapping ? 'On' : 'Off' }}</span>
          </div>
        </div>
      </div>
      <div v-if="enableContentMapping" class="page_setting">
        <div class="page_setting__title">Page/Screen Settings:</div>
        <div class="config__line">
          Current {{ isDigital ? 'Screen' : 'Page(s)' }}:
          <span>{{ currentContainerTitle }}</span>
        </div>
        <div class="config__line">
          Mapping Type: <span>{{ mappingType }}</span>
        </div>
        <div class="config__line config__line--status">
          {{ isDigital ? 'Screen' : 'Page' }} Mapping Status:
          <div class="selector-container">
            <Select
              :items="statusOpts"
              :selected-val="selectedStatus"
              @change="onChangeMappingStatus"
            />
          </div>
        </div>
      </div>
      <div class="learn-more">
        To learn more about Content Mapping, click
        <a @click="onClickHelp">here</a>.
      </div>
    </div>
  </Properties>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
