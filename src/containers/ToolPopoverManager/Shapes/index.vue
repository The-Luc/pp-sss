<template>
  <ShapeToolPopover
    :no-shape-length="noShapeLength"
    :shapes="shapes"
    :selected-shapes="selectedShapes"
    @onSelectShape="onSelectShape"
    @onClose="onClose"
    @applyChosenShapes="applyChosenShapes"
  />
</template>

<script src="./script.js" />
