<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <draggable
        class="section-details"
        v-model="sheets"
        group="sheet"
        :move="onMove"
        @start="drag = true"
        @end="drag = false"
      >
        <div v-for="(sheet, index) in sheets" :key="sheet.id" class="sheet-box">
          <v-row>
            <v-col :class="sheet.type == 'half' ? 'vertical' : 'horizontal'">
              <div class="menu">
                <img
                  @mouseover="setCurrentSheetId(sheet.id)"
                  @mouseleave="setCurrentSheetId()"
                  :class="[
                    'menu-icon',
                    onCheckIsShowMenuDetail(sheet.id) ? 'd-block' : '',
                  ]"
                  :src="moreIcon"
                  @click="onChangeStatusMenuDetail(sheet.id)"
                />
                <MenuDetail
                  v-if="onCheckIsShowMenuDetail(sheet.id)"
                  v-click-outside="onCloseMenu"
                  :sectionId="sectionId"
                >
                  <ButtonDelete
                    title="Delete This Sheet"
                    @click.native="openModal(sheet.id, sectionId)"
                  />
                </MenuDetail>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="sheet-name"
              >{{ startSeq + index }}{{ sheet.name }}</v-col
            >
          </v-row>
        </div>
      </draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
