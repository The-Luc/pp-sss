<template>
  <div class="page-info-properties-container">
    <Properties v-if="isCover" title="Project Information">
      <PageTitle :title-value="book.title" :is-disable="true" />
      <PageNumber title-name="Page Numbering:" />
      <PpProperties />
    </Properties>

    <Properties v-if="isSiglePage" title="Page Information">
      <PageTitle
        title-name-left="Page title:"
        title-value="aaa"
        :is-disable="false"
      />
      <PageNumber
        :title-name="titleNameLeft"
        :is-cover="isCover"
        :is-sigle-page="isSiglePage"
      />
    </Properties>

    <Properties v-if="isSpread" title="Spread Information">
      <PageTitle
        :title-name-left="titleNameLeft"
        title-value="aaa"
        :is-disable="false"
        :is-link="isLink"
      />
      <PageNumber
        title-name="Page Numbering (for this spread only):"
        status-page-left="Left hand page:"
        status-page-right="Right hand page:"
        :is-cover="isCover"
        :is-sigle-page="isSiglePage"
      />
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
