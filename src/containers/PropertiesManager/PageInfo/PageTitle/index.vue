<template>
  <div class="title">
    <InputTitle
      :title-name="isLink ? 'Left hand page title:' : titleName"
      :disabled="disabled"
      :title-value="titleValueLeft"
    />
    <InputTitle
      v-if="isLink"
      title-name="Right hand page title:"
      :title-value="titleValueRight"
    />
  </div>
</template>

<script src="./script.js" />
