<template>
  <div class="animation-control-container">
    <div class="animation-control-header">
      <span>{{ title }}</span>
    </div>
    <div class="animation-control-body">
      <div
        v-for="(config, index) in items"
        :key="index"
        :class="[
          'animation-control-item',
          { active: selectedItem === config.id }
        ]"
        @click="onClickItem(config.id)"
      >
        <div :class="['animation-order', { 'play-out': isPlayOut }]">
          <span>{{ config.order }}</span>
        </div>
        <div class="animation-type">
          <span v-if="config.type">{{ config.type }}</span>
        </div>
        <div class="animation-name">
          <span :class="{ 'empty-type': !config.type }">
            {{ config.name }}
          </span>
        </div>
        <div class="animation-style">
          <span>{{ config.style }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
