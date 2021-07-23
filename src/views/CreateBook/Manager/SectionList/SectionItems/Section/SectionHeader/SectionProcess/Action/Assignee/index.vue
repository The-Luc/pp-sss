<template>
  <v-menu
    :value="isOpen"
    content-class="pp-assignee"
    :position-x="assigneeX"
    :position-y="assigneeY"
    :close-on-content-click="false"
    :nudge-width="assigneeWidth"
  >
    <v-list v-click-outside="onClickOutside" dense>
      <v-list-item-group :value="assigneeIndex">
        <v-list-item
          v-for="user in users"
          :key="user.id"
          :ref="`user${user.id}`"
        >
          <v-list-item-icon>
            <v-icon>check_circle</v-icon>
          </v-list-item-icon>

          <v-list-item-content @click="onSelected(user)">
            <v-list-item-title
              class="text-500 text-size-md"
              v-text="user.name"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
