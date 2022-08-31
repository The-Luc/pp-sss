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
          :is-mapping-mode="true"
          @setThemeLayoutForSheet="onConfirmPrintLayout"
          @onChangeTheme="onChangePrintTheme"
          @onChangeLayoutType="onChangePrintLayoutType"
          @editMap="onEditMap"
          @reassignMap="showReassignConfirmModal"
          @deleteMap="showDeleteMapModal"
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
          :themes-options="digitalThemesOptions"
          :layout-types="digitalLayoutTypes"
          :theme-selected="digitalThemeSelected"
          :disabled-theme-opts="isDisableDigitalTheme"
          :disabled-layout-opts="false"
          :layout-type-selected="digitalLayoutTypeSelected"
          :is-digital="true"
          :is-translucent-content="isDigitalOpaque"
          :is-footer-hidden="isDigitalFooterHidden"
          :is-mapping-mode="true"
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

    <!-- DELETE MODAL -->
    <confirm-action
      v-if="isDeleteMapModalDisplayed"
      header="Please Confirm"
      cancel-content="No, keep current layout"
      action-content="Yes, delete the current map"
      width="600"
      @onAccept="onDeleteMap"
      @onCancel="onCloseDeleteConfirmModal"
    >
      Be aware that by selecting “Delete Map” all existing associations <br />
      to the currently mapped layout will be removed.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>

    <!-- REASSIGN MODAL -->
    <confirm-action
      v-if="isReassignModalDisplayed"
      header="Please Confirm"
      cancel-content="No, keep current layout"
      action-content="Yes, select a new digital layout"
      width="600"
      @onAccept="onReassignMap"
      @onCancel="onCloseReassignModal"
    >
      Be aware that selecting a new digital layout will remove all existing
      <br />
      connections to the currently mapped layout.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
