<template>
  <div
    class="shapes-container"
    :class="{
      'empty-shape-container': shapes.length === 0
    }"
  >
    <PpToolPopover
      title="Shapes"
      :disabled="selectedShapes.length === 0"
      @cancel="onClose"
      @change="applyChosenShapes"
    >
      <template #content>
        <div class="shape-item-container">
          <div v-show="shapes.length === 0" class="empty-shape-content">
            <div class="empty-shape-text">
              <span>No Shape</span>
            </div>

            <Item
              v-for="(shape, index) in noShapeLength"
              :key="index"
              is-empty
            />
          </div>

          <Item
            v-for="shape in shapes"
            :key="shape.id"
            :item="shape"
            :selected-val="selectedShapes"
            @click="onSelectShape"
          />
        </div>
      </template>
    </PpToolPopover>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
