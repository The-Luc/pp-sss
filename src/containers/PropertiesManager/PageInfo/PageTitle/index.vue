<template>
  <div class="title">
    <InputTitle
      :title-name="isLink ? 'Left hand page title:' : titleName"
      :disabled="isDisabled"
      :title-value="titleValueLeft"
    />
    <InputTitle
      v-if="isLink"
      title-name="Right hand page title:"
      :disabled="isDisabled"
      :title-value="titleValueRight"
    />
  </div>
</template>

<script src="./script.js" />
