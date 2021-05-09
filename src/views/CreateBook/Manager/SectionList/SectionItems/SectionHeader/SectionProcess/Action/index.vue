<template>
  <div>
    <Menu
      v-if="isOpenMenu"
      nudge-width="160"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :is-open="isOpenMenu"
      @onClickOutSideMenu="onClickOutSideMenu"
      @onItemClick="onItemClick"
    />
    <Calendar
      v-if="isOpenCalendar"
      :date="releaseDate"
      :is-open-calendar="isOpenCalendar"
      :calendar-width="calendarWidth"
      :calendar-x="calendarX"
      :min-date="minDate"
      :calendar-y="calendarY"
      @onClickOutSideCalendar="onClickOutSideCalendar"
      @onSelectedDay="onSelectedDay"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
