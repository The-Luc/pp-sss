<template>
  <div class="saved-style-popover">
    <v-tabs v-model="tabActive">
      <template v-for="tab in tabs">
        <v-tab :key="tab.value">
          {{ tab.label }}
        </v-tab>
        <v-tab-item :key="tab.value" class="items-container">
          <div
            v-for="item in tab.items"
            :key="item.value"
            :class="['item-style', { active: item.id === selectedItem }]"
            @click="onChange(item)"
          >
            <template v-if="item.isCustom">
              <div :style="getStyle(item.style)" class="saved-style-stroke">
                <div class="saved-style"></div>
              </div>
            </template>
            <template v-else>
              <img :class="item.className" :src="item.imageUrl" />
            </template>
          </div>
        </v-tab-item>
      </template>
    </v-tabs>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
