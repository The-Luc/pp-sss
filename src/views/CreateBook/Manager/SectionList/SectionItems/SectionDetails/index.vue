<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <Draggable
        v-model="sheets"
        class="section-details"
        group="sheet"
        :move="onMove"
        @start="drag = true"
        @end="drag = false"
      >
        <div v-for="(sheet, index) in sheets" :key="sheet.id" class="sheet-box">
          <v-row>
            <v-col
              :class="sheet.type == sheetTypes.HALF ? 'vertical' : 'horizontal'"
            >
              <div v-if="onCheckActions(sheet.type)" class="menu">
                <img
                  :src="moreIcon"
                  :class="[
                    onCheckIsShowMenuDetail(sheet.id) ? 'd-block' : '',
                    'menu-icon',
                  ]"
                  @mouseover="setCurrentSheetId(sheet.id)"
                  @mouseleave="setCurrentSheetId()"
                  @click="onChangeStatusMenuDetail(sheet.id)"
                />
                <MenuDetail
                  v-if="onCheckIsShowMenuDetail(sheet.id)"
                  v-click-outside="onCloseMenu"
                  :section-id="sectionId"
                  :sheet-id="sheet.id"
                  :get-sections="getSections"
                >
                  <ButtonDelete
                    title="Delete This Sheet"
                    @click.native="
                      openModal(startSeq + index, sheet.id, sectionId)
                    "
                  />
                </MenuDetail>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="sheet-name">{{ startSeq + index }}</v-col>
          </v-row>
        </div>
      </Draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
