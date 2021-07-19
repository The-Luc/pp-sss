<template>
  <div v-scroll:#scroll-section="onScroll">
    <Menu
      v-if="isOpenMenu"
      nudge-width="180"
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
        title="Add a Sheet"
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
      :min-date="minDate"
      :is-open-calendar="isOpenCalendar"
      :calendar-width="calendarWidth"
      :calendar-x="subMenuPos.x"
      :calendar-y="subMenuPos.y"
      @clickOutSide="onClickOutSideCalendar"
      @change="onChangeDueDate"
    />
    <SectionStatus
      v-if="isOpenStatus"
      :status="status"
      :is-open-status="isOpenStatus"
      :status-width="statusWidth"
      :status-x="subMenuPos.x"
      :status-y="subMenuPos.y"
      @clickOutSide="onClickOutSideStatus"
      @change="onChangeStatus"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
