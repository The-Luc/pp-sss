<template>
  <v-row>
    <v-col class="section-control">
      <v-btn id="btn-ec-all" data-toggle="collapse" @click="toggleDetail"
        >{{ isCollapse ? 'Expand' : 'Collapse' }} All Sections</v-btn
      >
      <v-btn
        :class="['btn-solid', { 'btn-disabled': isDisableAdd }]"
        @click.native="onAddSection"
      >
        <img src="@/assets/icons/plus.svg" alt="Add section" />
        Add a Section
      </v-btn>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
