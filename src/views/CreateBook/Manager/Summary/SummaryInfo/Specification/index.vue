<template>
  <Section title="Specification">
    <Detail
      v-for="(detail, index) in details"
      :key="index"
      :name="detail.name"
      :description="detail.description"
    />
  </Section>
</template>

<script src="./script.js"></script>
