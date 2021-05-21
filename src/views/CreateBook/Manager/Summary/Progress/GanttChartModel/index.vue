<template>
  <Modal width="1078" :is-show-header="false">
    <div class="chart-container">
      <div class="chart-header">
        <BlockBar :items="months" />
      </div>

      <div class="chart-body"></div>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
