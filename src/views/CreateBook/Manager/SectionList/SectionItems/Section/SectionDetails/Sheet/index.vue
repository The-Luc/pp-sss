<template>
  <v-col class="sheet-box">
    <v-row>
      <DragDropIndicator
        :id="'sheet-left-' + sheet.id"
        custom-class-name="indicator-left"
      />

      <v-col :class="sheet.id < 0 ? 'hide' : ''">
        <v-row>
          <v-col
            :class="['sheet', isHalfSheet() ? 'vertical' : 'horizontal']"
            :data-draggable="sheet.draggable"
            @mouseover="showDragControl"
            @mouseleave="hideDragControl"
          >
            <DragDropControl :id="'sheet' + sheet.id" />

            <div v-if="onCheckActions()" class="menu">
              <img
                :src="moreIcon"
                :class="[
                  onCheckIsShowMenuDetail(sheet.id) ? 'd-block' : '',
                  'menu-icon'
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
                :get-sections="getSectionsForMove()"
              >
                <ButtonDelete
                  title="Delete This Sheet"
                  @click.native="openModal(sequence, sheet.id, sectionId)"
                />
              </MenuDetail>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="sheet-name"> {{ sequence }}{{ sheet.id }} </v-col>
        </v-row>
      </v-col>

      <DragDropIndicator
        :id="'sheet-right-' + sheet.id"
        custom-class-name="indicator-right"
      />
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
