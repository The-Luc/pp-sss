<template>
  <v-col class="col-3 section-process">
    <ProcessBar :color="section.color" :status="section.status" />

    <span class="first-release">{{ section.dueDate }}</span>
    <img :src="moreIcon" alt="more icon" @click.stop="toggleMenu" />

    <Action
      :section-id="section.id"
      :section-name="section.name"
      :assignee-id="section.assigneeId"
      :due-date="section.dueDate"
      :status="section.status"
      :menu-class="menuClass"
      :items="menuItems"
      :menu-x="menuX"
      :menu-y="menuY"
      @statusUpdate="onStatusUpdate"
      @dueDateUpdate="onDueDateUpdate"
      @assigneeUpdate="onAssigneeUpdate"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
