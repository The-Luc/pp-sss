<template>
  <v-select
    class="pp-select"
    :items="items"
    item-text="name"
    item-value="value"
    solo
    :placeholder="placeholder"
    :attach="container"
    :disabled="disabled"
    append-icon=""
    :value="selectedVal"
    return-object
    persistent-hint
    :menu-props="{ zIndex: 9999 }"
    @change="onChange"
    @click="onClick"
    @focus="onFocus"
  >
    <template #prepend-item>
      <slot />
    </template>

    <template #selection="{ item }">
      <v-list-item class="pp-select--item item-selected">
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              <template v-if="isImgOpts">
                <img
                  :src="item.previewImageUrl"
                  style="max-width: 70px"
                  alt="Icon preview image"
                />
              </template>
              <template v-else>
                <span :style="getStyle(item.cssStyle)">{{ item.name }}</span>
              </template>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template #item="{ item, attrs, on }">
      <v-list-item
        v-slot="{ active }"
        class="pp-select--item"
        :data-container="dataContainer"
        v-bind="attrs"
        v-on="on"
      >
        <img
          v-if="!isImgOpts"
          :style="{ visibility: active ? 'visible' : 'hidden' }"
          class="icon-ative"
          :src="activeMenuIcon"
          alt="icon-active"
        />
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              <template v-if="isImgOpts">
                <img
                  :src="item.previewImageUrl"
                  style="max-width: 70px"
                  alt="preview-image"
                />
              </template>
              <template v-else>
                <span :style="getStyle(item.cssStyle)">{{ item.name }}</span>
              </template>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-if="prependedIcon" #prepend>
      <img
        :src="prependedIcon"
        :data-container="dataContainer"
        alt="prepend-icon"
        class="prepend-icon"
      />
    </template>
    <template v-if="appendedIcon && !disabled" #append>
      <img
        :src="appendedIcon"
        :data-container="dataContainer"
        alt="arrow-select"
      />
    </template>
  </v-select>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
