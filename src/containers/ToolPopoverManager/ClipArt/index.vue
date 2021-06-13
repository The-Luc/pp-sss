<template>
  <div class="clip-art-container">
    <PpToolPopover
      title="Clip Art"
      action-text="Select"
      @cancel="onCancel"
      @change="addClipArts"
    >
      <template #action>
        <div class="pp-selected-clip-art">
          <div class="pp-selected-clip-art--header">
            <ClipArtType
              :items="displayClipArtTypes"
              :selected-val="chosenClipArtType"
              @change="onChangeClipArtType"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div class="clip-art-item-container">
          <Item
            v-for="item in clipArt"
            :key="item.id"
            :selected-clip-art-id="selectedClipArtId"
            :clip-art="item"
            @click="selectClipArt"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
