<template>
  <Modal width="560" :is-close-out-side="false" :is-show-header="false">
    <div class="modal-generate-pdf">
      <div class="modal-generate-pdf__title">
        Your PDF is generating. This process takes approximately
        {{ duration }} minutes. When the PDF is ready, you'll receive a link in
        your email.
      </div>
      <div class="container-btn">
        <PpButton is-active class="btn-close" @click="onClose">
          Close
        </PpButton>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style scoped lang="scss" src="./style.scss" />
