<template>
  <group-item :is-name-displayed="false">
    <pp-select
      data-container="transition-properties"
      :items="targets"
      :placeholder="unSelectedValue"
      @change="onTargetChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
