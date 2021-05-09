<template>
  <v-row>
    <v-col class="section-control">
      <v-btn id="btn-ec-all" data-toggle="collapse" v-on:click="toggleDetail"
        >{{ isCollapse ? 'Expand' : 'Collapse' }} All
        Sections</v-btn
      >
      <v-btn class="btn-solid" @click.native="addSection">
        <img src="@/assets/icons/plus.svg" />
        Add a Section
      </v-btn>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
