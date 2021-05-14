<template>
  <v-col class="sheet-box">
    <v-row>
      <DragDropIndicator
        :id="'sheet-left-' + sheetId"
        custom-class-name="indicator-left"
      />

      <v-col :class="sheetId < 0 ? 'hide' : ''">
        <v-row>
          <v-col
            :class="[
              'sheet',
              isHalfSheet(sheetType) ? 'vertical' : 'horizontal'
            ]"
            :data-draggable="sheetDraggable"
            @mouseover="showDragControl"
            @mouseleave="hideDragControl"
          >
            <DragDropControl :id="'sheet' + sheetId" />

            <div v-if="onCheckActions(sheetType)" class="menu">
              <img
                :src="moreIcon"
                :class="[
                  onCheckIsShowMenuDetail(sheetId) ? 'd-block' : '',
                  'menu-icon'
                ]"
                @mouseover="setCurrentSheetId(sheetId)"
                @mouseleave="setCurrentSheetId()"
                @click="onChangeStatusMenuDetail(sheetId)"
              />
              <MenuDetail
                v-if="onCheckIsShowMenuDetail(sheetId)"
                v-click-outside="onCloseMenu"
                :section-id="sectionId"
                :sheet-id="sheetId"
                :get-sections="getSectionsForMove()"
              >
                <ButtonDelete
                  title="Delete This Sheet"
                  @click.native="openModal(sequence, sheetId, sectionId)"
                />
              </MenuDetail>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="sheet-name"> {{ sequence }}{{ sheetId }} </v-col>
        </v-row>
      </v-col>

      <DragDropIndicator
        :id="'sheet-right-' + sheetId"
        custom-class-name="indicator-right"
      />
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
