<template>
  <div id="pp-autocomplete" class="pp-autocomplete">
    <v-autocomplete
      :items="albums"
      flat
      label="Select Album"
      solo-inverted
      item-text="name"
      item-value="name"
      :menu-props="{ contentClass: 'dropdown' }"
      attach="#pp-autocomplete"
    >
      <template #item="{ item, parent }">
        <Item :album="item" :parent="parent" />
      </template>

      <template #prepend-item>
        <NewAlbum name="" />
      </template>

      <template #append>
        <img :src="appendedIcon" alt="arrow-select" />
      </template>
    </v-autocomplete>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
