<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <ListThumbContainer
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :name="section.name"
        :color="section.color"
        :is-enable="checkIsEnable(section)"
      >
        <Thumbnail
          :to-link="`/book/${bookId}/edit/print/edit-screen/${sheet.id}`"
          :number-page="numberPage(sheet)"
          :sheet-type="sheet.type"
          :link-type="sheet.link"
          :thumbnail-url="sheet.thumbnailUrl"
          :is-enable="checkIsEnable(section)"
          @change="changeLinkStatus(sheet.id, sheet.link)"
        />
      </ListThumbContainer>
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
