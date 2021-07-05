<template>
  <div class="page-info-properties-container">
    <Properties v-if="isCover" title="Project Information">
      <PageTitle :title-value-left="book.title" :is-disable="true" />
      <PageNumber :title-name="titleNameNumber" />
      <PpProperties />
    </Properties>

    <Properties v-if="isSiglePage" title="Page Information">
      <PageTitle
        :title-name-left="titleNameLeft"
        title-value-left="aaa"
        :is-disable="false"
      />
      <PageNumber
        :title-name="titleNameNumber"
        :is-cover="isCover"
        :is-sigle-page="isSiglePage"
      />
    </Properties>

    <Properties v-if="isSpread" title="Spread Information">
      <PageTitle
        :title-name-left="titleNameLeft"
        title-value-left="b"
        title-value-right="a"
        :is-disable="false"
        :is-link="isLink"
      />
      <PageNumber
        :title-name="titleNameNumber"
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
