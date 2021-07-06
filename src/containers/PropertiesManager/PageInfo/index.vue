<template>
  <div class="page-info-properties-container">
    <Properties v-if="isCover" title="Project Information">
      <PageTitle :title-value-left="book.title" :is-disable="true" />
      <PageNumber
        :is-left-number-on="pageInfo.isNumberingOn"
        :position="pageInfo.position"
      />
      <PpProperties :page-info="pageInfo" />
    </Properties>

    <Properties v-if="isSiglePage" title="Page Information">
      <PageTitle title-name="Page title:" title-value-left="aaa" />
      <PageNumber
        title-name="(for this page only)"
        :is-cover="isCover"
        :is-sigle-page="isSiglePage"
        :is-left-number-on="spreadInfo.isLeftNumberOn"
      />
    </Properties>

    <Properties v-if="isSpread" title="Spread Information">
      <PageTitle
        title-name="Spread title:"
        title-value-left="aaa"
        :is-link="isLink"
      />
      <PageNumber
        title-name="(for this spread only)"
        :is-cover="isCover"
        :is-sigle-page="isSiglePage"
        :is-left-number-on="spreadInfo.isLeftNumberOn"
        :is-right-number-on="spreadInfo.isRightNumberOn"
      />
    </Properties>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
