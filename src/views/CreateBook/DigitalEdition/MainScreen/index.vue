<template>
  <div v-scroll.self="onCloseMenu" class="row thumbnail-view-row">
    <template v-for="section in sections">
      <thumbnail-item
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :name="section.name"
        :color="section.color"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageName(sheet)"
        :to-link="`/book/${bookId}/edit/digital/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        :is-digital="true"
        :is-admin="section.isAdmin"
        :is-more-activated="selectedSheet === sheet.id"
        @toggleMenu="toggleMenu($event, sheet.id)"
      >
        <action
          v-if="selectedSheet === sheet.id"
          :is-open-menu="selectedSheet === sheet.id"
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
        </action>
      </thumbnail-item>
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
