<template>
  <div id="layout-mapping">
    <common-modal
      container="#layout-mapping"
      accept-text="Confirm"
      cancel-text="Cancel"
      title="Layout Mapping"
      :is-open-modal="true"
      :is-close-icon-displayed="false"
      :is-accept-button-disabled="false"
      :is-dark-header="true"
      :is-footer-displayed="false"
      @cancel="onCancel"
      @accept="onConfirm"
    >
      <div class="layout-mapping__container">
        <Layouts
          v-if="!isPrintPreviewDisplayed"
          :is-visited="true"
          :layouts="printLayouts"
          :layout-id="printLayoutId"
          :text-display="printText"
          :themes-options="themesOptions"
          :layout-types="printLayoutTypes"
          :theme-selected="printThemeSelected"
          :disabled-theme-opts="isDisablePrintTheme"
          :disabled-layout-opts="false"
          :layout-type-selected="printLayoutTypeSelected"
          :is-footer-hidden="isPrintFooterHidden"
          @setThemeLayoutForSheet="onConfirmPrintLayout"
          @onChangeTheme="onChangePrintTheme"
          @onChangeLayoutType="onChangePrintLayoutType"
          @onClose="onCancel"
        />
        <div v-else>Review Print</div>
        <Layouts
          v-if="!isDigitalPreviewDisplayed"
          :is-visited="true"
          :layouts="digitalLayouts"
          :layout-id="digitalLayoutId"
          :text-display="digitalText"
          :themes-options="themesOptions"
          :layout-types="digitalLayoutTypes"
          :theme-selected="digitalThemeSelected"
          :disabled-theme-opts="isDisableDigitalTheme"
          :disabled-layout-opts="false"
          :layout-type-selected="digitalLayoutTypeSelected"
          :is-digital="true"
          :is-translucent-content="isDigitalOpaque"
          :is-footer-hidden="isDigitalFooterHidden"
          @setThemeLayoutForSheet="onConfirmDigitalLayout"
          @onChangeTheme="onChangeDigitalTheme"
          @onChangeLayoutType="onChangeDigitalLayoutType"
          @onClose="onCancel"
        />
        <div v-else>Review Print</div>
      </div>
      <div v-if="isConfirmDisplayed">
        <div class="apply-warning-footer">
          <pp-button class="pp-btn-save" is-active @click="onCancel">
            Cancel
          </pp-button>
          <pp-button class="pp-btn-cancel" @click="onCancel">
            Confirm
          </pp-button>
        </div>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
