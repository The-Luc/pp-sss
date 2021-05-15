<template>
  <v-menu
    :value="isOpenCalendar"
    content-class="pp-calendar"
    :position-x="calendarX"
    :position-y="calendarY"
    :close-on-content-click="false"
    :nudge-width="calendarWidth"
  >
    <v-row v-click-outside="onClickOutSideCalendar">
      <v-col cols="5">
        <v-date-picker
          :value="dateSelected"
          :weekday-format="getDay"
          :picker-date.sync="dateSelected"
          class="pp-calendar-date-picker"
          no-title
          :min="minDate"
          :max="dueDateData"
          scrollable
          @change="onSelectedDate"
        />
      </v-col>
      <v-col cols="1">
        <v-divider class="divider" vertical></v-divider>
      </v-col>
      <v-col cols="5">
        <v-date-picker
          :value="monthSelected"
          :picker-date.sync="monthSelected"
          class="pp-calendar-month"
          type="month"
          :min="minDate"
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
