<template>
  <div
    class="backgrounds-container"
    :class="{
      'empty-background-container': backgrounds.length === 0
    }"
  >
    <PpToolPopover
      title="Backgrounds"
      @cancel="onClose"
      @change="onApplyChosenBackground"
    >
      <template #action>
        <div class="pp-backgrounds-action-container">
          <TypeSelection
            :items="displayBackgroundTypes"
            :selected-val="selectedBackgroundType"
            @change="onChangeBackgroundType"
          />

          <PageTypeSelection
            v-if="!isPageTypeHidden"
            :items="displayBackgroundPageType"
            :disabled="isPageTypeDisabled"
            :selected-val="selectedBackgroundPageType"
            @change="onChangeBackgroundPageType"
          />
        </div>
      </template>

      <template #content>
        <div class="background-item-container">
          <div
            v-show="backgrounds.length === 0"
            class="empty-background-content"
          >
            <div class="empty-background-text">
              <span>No Background</span>
            </div>

            <Item
              v-for="(background, index) in noBackgroundLength"
              :key="index"
              is-empty
            />
          </div>

          <Item
            v-for="background in backgrounds"
            :ref="`background${background.id}`"
            :key="background.id"
            :item="background"
            :selected-val="selectedBackground"
            @click="onSelectBackground"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
