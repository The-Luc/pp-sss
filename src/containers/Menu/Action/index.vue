<template>
  <div v-scroll:#scroll-section="onScroll">
    <Menu
      v-if="isOpenMenu"
      nudge-width="180"
      :items="menuItems"
      :menu-x="menuX"
      :menu-y="menuY"
      :content-class="menuClass"
      :is-open="isOpenMenu"
      @onClickOutsideMenu="onClickOutsideMenu"
      @onItemClick="onItemClick"
      @loaded="onMenuLoaded"
    >
      <slot></slot>
    </Menu>
    <Calendar
      v-if="isOpenCalendar"
      :date="dueDate"
      :min-date="minDate"
      :is-open="isOpenCalendar"
      :calendar-width="calendarWidth"
      :calendar-x="subMenuPos.x"
      :calendar-y="subMenuPos.y"
      @clickOutside="onClickOutsideCalendar"
      @change="onChangeDueDate"
    />
    <SectionStatus
      v-if="isOpenStatus"
      :status="status"
      :is-open="isOpenStatus"
      :status-width="statusWidth"
      :status-x="subMenuPos.x"
      :status-y="subMenuPos.y"
      @clickOutside="onClickOutsideStatus"
      @change="onChangeStatus"
    />
    <Assignee
      v-if="isOpenAssignee"
      :users="users"
      :assignee-id="assigneeId"
      :is-open="isOpenAssignee"
      :assignee-width="assigneeWidth"
      :assignee-x="subMenuPos.x"
      :assignee-y="subMenuPos.y"
      @clickOutside="onClickOutsideAssignee"
      @change="onChangeAssignee"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
