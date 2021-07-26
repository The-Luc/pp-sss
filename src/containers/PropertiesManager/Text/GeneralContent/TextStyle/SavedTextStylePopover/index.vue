<template>
  <div class="saved-style-popover">
    <v-tabs v-model="tabActive" @change="onTabChange">
      <template v-for="tab in tabs">
        <v-tab :key="tab.value">
          {{ tab.label }}
        </v-tab>
        <v-tab-item :key="tab.value">
          <v-list flat>
            <v-list-item-group v-model="selectedItem" @change="onChange">
              <v-list-item
                v-for="(item, index) in tab.items"
                :key="item.id"
                :ref="`style${item.id}`"
              >
                <v-list-item-avatar size="10">
                  <v-icon v-show="selectedItem === index" small>check</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    :style="getStyle(item.cssStyle)"
                    v-text="item.name"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
      </template>
    </v-tabs>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
