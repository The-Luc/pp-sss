<template>
  <v-col class="col-3 section-process">
    <ProcessBar :color="section.color" :status="section.status" />

    <span class="first-release">{{ section.dueDate }}</span>
    <img :src="moreIcon" alt="more icon" @click.stop="toggleMenu" />

    <action
      v-if="isOpenMenu"
      :key="componentKey"
      :is-open-menu="isOpenMenu"
      :section-id="section.id"
      :section-name="section.name"
      :assignee-id="section.assigneeId"
      :due-date="section.dueDate"
      :status="section.status"
      :menu-class="menuClass"
      :menu-x="menuX"
      :menu-y="menuY"
      @closeMenu="onCloseMenu"
      @loaded="onMenuLoaded"
    >
      <button-add
        v-if="isShowAdd"
        title="Add a Sheet"
        @click.native="onAddSheet"
      ></button-add>
      <button-delete
        v-if="isShowDelete"
        class="btn-delete"
        title="Delete This Section"
        @click.native="onOpenModal"
      ></button-delete>
    </action>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
