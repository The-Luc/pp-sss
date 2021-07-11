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
                {{ `${selectedValue.name}: ${selectedValue.sub.name}` }}
              </span>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template #item="{ item, attrs, on }">
      <v-list-item
        v-slot="{ active }"
        :data-id="getDataIdByValue(item)"
        class="pp-select-multi--item"
        v-bind="attrs"
        v-on="on"
      >
        <img
          :style="{ visibility: active ? 'visible' : 'hidden' }"
          class="icon-ative"
          :src="activeMenuIcon"
          alt="icon-active"
        />

        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters align="center" @click="onItemClick($event)">
              <span>{{ item.name }}</span>
            </v-row>

            <SelectSubLevel
              v-if="item.subItems.length > 0"
              :items="item.subItems"
              :parent-value="item.value"
              :selected-val="getSelectedSub(item)"
              @change="onChange"
            />
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

<style lang="scss" src="./style.scss" scoped />
