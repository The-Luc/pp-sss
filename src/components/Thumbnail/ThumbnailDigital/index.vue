<template>
  <div>
    <div
      :class="[
        {
          active: isActive
        },
        'thumbnail-view-thumbnail'
      ]"
    >
      <img :src="image" />
      <div v-if="edit" class="thumbnail-edit">
        <router-link tag="div" :to="toLink">
          <v-icon class="icon-edit">edit</v-icon>
        </router-link>
      </div>
    </div>
    <div
      :class="['thumbnail-view-number-page', { 'number-page': leftNumberPage }]"
    >
      {{ orderScreen }}
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
