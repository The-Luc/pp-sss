<template>
  <div class="page-info-properties-container">
    <Properties v-if="isCover" title="Project Information">
      <PageTitle :left-title-value="book.title" :disabled="true" />
      <PageNumber
        :disabled="disabled"
        :is-left-number-on="pageInfo.isNumberingOn"
        :position="pageInfo.position"
        @change="onChangePageNumber"
      />
      <PpProperties
        :disabled="disabled"
        :page-info="pageInfo"
        @change="onChangePageInfo"
      />
    </Properties>

    <Properties v-if="isFrontCover || isBackCover" title="Page Information">
      <PageTitle
        title-name="Page title:"
        :left-title-value="spreadInfo.leftTitle"
        :right-title-value="spreadInfo.rightTitle"
        @change="changeTitle"
      />
      <PageNumber
        :disabled="disabled"
        title-name="(for this page only)"
        :is-cover="isCover"
        :is-front-cover="isFrontCover"
        :is-back-cover="isBackCover"
        :is-left-number-on="spreadInfo.isLeftNumberOn"
        :is-right-number-on="spreadInfo.isRightNumberOn"
        @change="onChangePageNumber"
      />
    </Properties>

    <Properties v-if="isSpread" title="Spread Information">
      <PageTitle
        title-name="Spread title:"
        :left-title-value="spreadInfo.leftTitle"
        :right-title-value="spreadInfo.rightTitle"
        :is-link="isLink"
        @change="changeTitle"
      />
      <PageNumber
        :disabled="disabled"
        title-name="(for this spread only)"
        :is-cover="isCover"
        :is-front-cover="isFrontCover"
        :is-back-cover="isBackCover"
        :is-left-number-on="spreadInfo.isLeftNumberOn"
        :is-right-number-on="spreadInfo.isRightNumberOn"
        @change="onChangePageNumber"
      />
    </Properties>
  </div>
</template>

<script src="./script.js" />
