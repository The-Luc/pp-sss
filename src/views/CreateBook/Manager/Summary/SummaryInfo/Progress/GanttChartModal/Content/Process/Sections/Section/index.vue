<template>
  <div class="section">
    <ProcessItem :name="section.name" :header-color="section.color">
      <MiniProcess
        class="section-process"
        :description="status"
        :style="{
          marginLeft: section.position,
          width: section.length,
          minWidth: section.length
        }"
      >
        <template #process>
          <ProcessBar :color="section.color" :status="section.status" />
        </template>
      </MiniProcess>

      <MiniProcess
        class="section-due-date"
        :description="section.dueDate"
        :is-display-description-under="true"
      />
    </ProcessItem>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
