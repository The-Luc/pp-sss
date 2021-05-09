<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="'background-color: ' + color"></span>
    <span class="process first"></span>
    <span class="process"></span>
    <span class="process last"></span>

    <span class="first-release">{{ releaseDate }}</span>
    <Menu :src="moreIcon" nudge-width="160" :items="items">
      <ButtonDelete
        title="Delete This Section"
        @click.native="onOpenModal(sectionId, sectionName)"
      />
    </Menu>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
