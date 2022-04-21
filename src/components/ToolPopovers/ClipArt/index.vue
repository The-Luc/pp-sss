<template>
  <div class="clip-art-container">
    <PpToolPopover
      title="Clip Art"
      action-text="Select"
      :disabled="selectedClipArtId.length === 0"
      @cancel="onCancel"
      @change="addClipArts"
    >
      <template #action>
        <div class="pp-selected-clip-art">
          <div class="pp-selected-clip-art--header">
            <ClipArtType
              :items="clipArtTypes"
              :selected-val="chosenClipArtType"
              @change="onChangeClipArtType"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div v-if="isShowSearchInput" :key="searchInput" class="search-clipart">
          <input type="text" placeholder="Search" @keyup.enter="onSearch" />
          <div v-if="searchInput !== null" class="search-result">
            {{ clipArts.length }} matches for: <span>{{ searchInput }}</span>
          </div>
        </div>
        <div
          v-if="clipArts.length === 0"
          ref="clipArtContainer"
          class="clip-art-item-container search-item empty"
        >
          <Item
            v-for="(clipArt, index) in clipArtEmptyLength"
            :key="index"
            is-empty
          />
        </div>
        <div
          v-else
          ref="clipArtContainer"
          :class="[
            'clip-art-item-container',
            { 'search-item': isShowSearchInput }
          ]"
        >
          <Item
            v-for="clipArt in clipArts"
            :key="clipArt.id"
            :selected-clip-art-id="selectedClipArtId"
            :clip-art="clipArt"
            @click="selectClipArt"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
