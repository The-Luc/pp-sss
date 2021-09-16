<template>
  <div id="portrait-folder">
    <CommonModal
      title="Select Portrait Folders"
      accept-text="Select"
      container="#portrait-folder"
      width="796"
      :is-open-modal="isOpenModal"
      :is-accept-button-disabled="isDisableSelect"
      @cancel="onCancel"
      @accept="onSelect"
    >
      <div class="content-portrait-folder">
        <div class="content-title">
          Select the portrait folder(s) that you wish to flow
        </div>

        <div
          class="portrait-folder-item-container"
          :class="{
            'empty-container': isEmpty
          }"
        >
          <template v-if="isEmpty">
            <div class="empty-portrait-folder-text">
              There are no portrait folders in this community. To add portraits,
              upload your PSPA archive in the “Portraits Manager” tab in the
              Community Console.
            </div>

            <Item
              v-for="index in noPortraitFolderLength"
              :key="index"
              is-empty
            />
          </template>

          <template v-else>
            <Item
              v-for="portraitFolder in portraitFolders"
              :key="portraitFolder.id"
              :portrait-folder="portraitFolder"
              :selected-folder-ids="selectedFolderIds"
              @click="selectedPortraitFolder"
            />
          </template>
        </div>
      </div>
    </CommonModal>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
