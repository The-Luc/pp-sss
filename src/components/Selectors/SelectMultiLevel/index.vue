<template>
  <v-select
    class="pp-select-multi"
    :items="items"
    item-text="name"
    item-value="value"
    solo
    :attach="container"
    :disabled="disabled"
    append-icon=""
    :value="selectedValue"
    persistent-hint
    :menu-props="{ zIndex: 9999 }"
  >
    <template #selection>
      <v-list-item class="pp-select-multi--item item-selected">
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center">
              <span>
                {{ displaySelected }}
              </span>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template #item="{ item, attrs, on }">
      <v-hover v-slot="{ hover }">
        <v-list-item
          v-slot="{ active }"
          :ref="getDataIdByValue(item)"
          class="pp-select-multi--item"
          :class="getDataIdByValue(item)"
          v-bind="attrs"
          v-on="on"
        >
          <div
            class="option-wrapper"
            @click="onItemClick($event, item.subItems, item.value)"
          >
            <img
              :style="{ visibility: active ? 'visible' : 'hidden' }"
              class="icon-ative"
              :src="activeMenuIcon"
              alt="icon-active"
            />

            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span>{{ item.name }}</span>
                  <span class="hide">{{ hover }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>

            <v-icon
              :style="{
                visibility: isSubmenuExisted(item) ? 'visible' : 'hidden'
              }"
              class="icon-arrow"
            >
              arrow_right
            </v-icon>
          </div>

          <SelectSubLevel
            v-if="isSubmenuExisted(item)"
            :activator="`.${getDataIdByValue(item)}`"
            :items="item.subItems"
            :parent-value="item.value"
            :selected-val="getSelectedSub(item)"
            :position="getSubmenuPosition(item)"
            @change="onChange"
          />
        </v-list-item>
      </v-hover>
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

<style lang="scss" src="./style.scss" scoped />
