<template>
  <div id="pp-autocomplete" class="pp-autocomplete">
    <v-autocomplete
      :items="albums"
      flat
      label="Select Album"
      solo-inverted
      item-text="name"
      item-value="id"
      :menu-props="{ contentClass: 'dropdown' }"
      attach="#pp-autocomplete"
      :search-input.sync="search"
      @change="onChange"
    >
      <template #item="{ item, parent }">
        <Item :album="item" :parent="parent" />
      </template>

      <template #prepend-item>
        <NewAlbum :name="search" @click.native="onCreateNewAlbum" />
      </template>

      <template #append>
        <img :src="appendedIcon" alt="arrow-select" />
      </template>

      <template #no-data>
        <div class="no-data"></div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
