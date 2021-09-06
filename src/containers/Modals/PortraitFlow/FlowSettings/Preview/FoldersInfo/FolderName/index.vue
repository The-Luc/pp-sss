<template>
  <div class="folder-name-container">
    <v-menu
      v-model="menu"
      min-width="324"
      max-width="324"
      absolute
      transition="slide-x-transition"
      attach
    >
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" :class="{ 'btn-active': menu }" v-on="on">
          [+]
        </div>
      </template>

      <div class="name-list">
        <p v-for="(item, index) in folderNames" :key="index">
          {{ item }}
        </p>
      </div>
    </v-menu>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
