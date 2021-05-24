<template>
  <Section title="Important Dates">
    <Detail
      v-for="(detail, index) in details"
      :key="index"
      :name="detail.name"
      :description="detail.description"
      :custom-class="detail.customClass"
    />
  </Section>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
