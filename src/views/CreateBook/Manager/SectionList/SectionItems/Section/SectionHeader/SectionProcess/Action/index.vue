<template>
  <div v-scroll:#scroll-section="onScroll">
    <Menu
      v-if="isOpenMenu"
      ref="sectionMenu"
      nudge-width="180"
      :is-close-menu="isCloseMenu"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :content-class="menuClass"
      :is-open="isOpenMenu"
      @onClickOutSideMenu="onClickOutSideMenu"
      @onItemClick="onItemClick"
    >
      <ButtonAdd
        v-if="isShowAdd"
        title="Add a sheet"
        @click.native="onAddSheet(sectionId)"
      />
      <ButtonDelete
        v-if="isShowDelete"
        class="btn-delete"
        title="Delete This Section"
        @click.native="onOpenModal(sectionId, sectionName)"
      />
    </Menu>
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
      :status="status"
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
