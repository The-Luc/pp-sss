<template>
  <Modal width="1078" :is-show-header="false">
    <div class="chart-container">
      <div class="chart-header">
        <BlockBar :items="months" custom-class="months">
          <template v-for="slot in slots" #[`slot`+slot.id]>
            <EventFlag
              v-for="slotData in slot.slots"
              :key="slotData.id"
              :position="slotData.position"
              :description="slotData.name"
              :event-date="slotData.value"
              :is-short="slotData.isShort"
            />
          </template>
        </BlockBar>

        <BlockBar :items="monthNames" custom-class="month-names">
          <template v-for="slot in slotNames" #[`slot`+slot.id]>
            <span :key="slot.id" class="text-500">
              {{ slot.name }}
            </span>
          </template>
        </BlockBar>
      </div>

      <div class="chart-body"></div>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
