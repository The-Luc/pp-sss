<template>
  <v-select
    class="pp-select"
    :items="items"
    item-text="name"
    item-value="value"
    solo
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
    <template #selection="{ item }">
      <v-list-item class="pp-select--item item-selected">
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <template v-if="isImgOpts">
                <img :src="item.previewImageUrl" style="max-width: 70px" />
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
              <template v-if="isImgOpts">
                <img :src="item.previewImageUrl" style="max-width: 70px" />
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
      <img :src="prependedIcon" alt="prepend-icon" class="prepend-icon" />
    </template>
    <template v-if="appendedIcon && !disabled" #append>
      <img :src="appendedIcon" alt="arrow-select" />
    </template>
  </v-select>
</template>

<script src="./script.js" />
