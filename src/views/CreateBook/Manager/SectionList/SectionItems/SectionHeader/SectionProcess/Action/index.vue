<template>
  <v-menu
    :value="isOpenCalendar"
    content-class="pp-calendar"
    :position-x="calendarPosition.x"
    :position-y="calendarPosition.y"
    :close-on-content-click="false"
    :nudge-width="calendarWidth"
    @input="onMenuToggle"
  >
    <v-row>
      <v-col cols="5">
        <v-date-picker
          :value="dateSelected"
          :picker-date.sync="dateSelected"
          class="pp-date-picker"
          no-title
          :min="nowDate"
          :max="dueDateData"
          scrollable
        />
      </v-col>

      <v-divider class="mx-4" vertical></v-divider>
      <v-col cols="5">
        <v-date-picker
          :value="monthSelected"
          :picker-date.sync="monthSelected"
          class="pp-calendar-month"
          type="month"
          :min="nowDate"
          :max="dueDateData"
          no-title
          scrollable
          @change="onChangeMonth"
        >
          <v-btn text color="primary" @click="onGoCurrentDate">
            Go to today
          </v-btn>
        </v-date-picker>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
