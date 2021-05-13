<template>
  <div>
    <Menu
      v-if="isOpenMenu"
      nudge-width="160"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :is-open="isOpenMenu"
      :section-status="sectionStatus"
      @onClickOutSideMenu="onClickOutSideMenu"
      @onItemClick="onItemClick"
    />
    <Calendar
      v-if="isOpenCalendar"
      :date="dueDate"
      :is-open-calendar="isOpenCalendar"
      :calendar-width="calendarWidth"
      :calendar-x="calendarX"
      :min-date="minDate"
      :calendar-y="calendarY"
      @onClickOutSideCalendar="onClickOutSideCalendar"
      @onSelectedDate="onSelectedDate"
    />
    <SectionStatus
      v-if="isOpenStatus"
      :section-status="sectionStatus"
      :is-open-status="isOpenStatus"
      :status-width="statusWidth"
      :status-x="statusX"
      :status-y="statusY"
      @onClickOutSideStatus="onClickOutSideStatus"
      @onSelectedStatus="onSelectedStatus"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
