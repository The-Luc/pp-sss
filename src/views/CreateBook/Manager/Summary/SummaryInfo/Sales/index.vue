<template>
  <Section title="Sales">
    <Detail
      v-for="(detail, index) in details"
      :key="index"
      :name="detail.name"
      :description="detail.description"
    />
  </Section>
</template>

<script src="./script.js"></script>
