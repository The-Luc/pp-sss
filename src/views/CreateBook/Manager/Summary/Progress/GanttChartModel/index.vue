<template>
  <Modal width="1078" :is-show-header="false">
    <div class="chart-container">
      <div class="chart-header">
        <BlockBar :items="months">
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
      </div>

      <div class="chart-body"></div>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
