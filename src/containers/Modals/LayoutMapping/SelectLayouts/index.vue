<template>
  <div id="select-layouts">
    <common-modal
      container="#select-layouts"
      accept-text="Confirm"
      cancel-text="Cancel"
      title="Layout Mapping"
      :is-open-modal="true"
      :is-close-icon-displayed="false"
      :is-accept-button-disabled="false"
      :is-dark-header="true"
      :is-footer-displayed="false"
    >
      <div v-if="isStepThreeDisplayed" class="step-3-container">
        Step 3: Confirm Selections
      </div>
      <div
        :class="[
          'select-layouts__container',
          { 'show-step-three': isStepThreeDisplayed }
        ]"
      >
        <Layouts
          v-if="!isPrintPreviewDisplayed"
          :is-visited="true"
          :layouts="printLayouts"
          :extra-layouts="extraPrintLayouts"
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
        <mapping-preview
          v-else
          :layout="printLayoutSelected"
          @onEdit="editPrintSelection"
        />
        <Layouts
          v-if="!isDigitalPreviewDisplayed"
          class="digital-layout"
          :is-visited="true"
          :layouts="digitalLayouts"
          :extra-layouts="extraDigitalLayouts"
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
        <mapping-preview
          v-else
          :is-digital="true"
          :layout="digitalLayoutSelected"
          @onEdit="editDigitalSelection"
        />
      </div>
      <div v-if="isConfirmDisplayed" style="position:relative; z-index:10">
        <div class="select-layouts__footer">
          <pp-button class="footer-btn cancel" @click="onCancel">
            Cancel
          </pp-button>
          <pp-button class="footer-btn confirm" @click="onConfirm">
            Confirm
          </pp-button>
        </div>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
