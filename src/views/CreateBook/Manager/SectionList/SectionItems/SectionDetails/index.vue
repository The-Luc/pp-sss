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
              <!-- <Menu
                class="menu"
                :src="moreIcon"
                nudge-width="160"
                :items="items"
              >
                <ButtonDelete
                  title="Delete This Sheet"
                  @click.native="openModal(sheet.id, sectionId)"
                />
              </Menu> -->
              <div class="menu">
                <img
                  @mouseover="setCurrentSheetId(sheet.id)"
                  @mouseleave="setCurrentSheetId()"
                  :class="[
                    'menu-icon',
                    onCheckIsShowMenuDetail(sheet.id) ? 'd-block' : ''
                  ]"
                  :src="moreIcon"
                  @click="onChangeStatusMenuDetail(sheet.id)"
                />
                <div
                  class="menu-detail"
                  v-if="onCheckIsShowMenuDetail(sheet.id)"
                  v-click-outside="onCloseMenu"
                >
                  <div
                    v-for="(item, index) in items"
                    :key="index"
                    class="menu-item mb-2"
                  >
                    <label class="text-300 text-size-sm text-line-14"
                      >{{ item.title }}:</label
                    >
                    <div class="d-flex mb-3 align-center">
                      <img :src="arrowDown" class="arrow-down" />
                      <span class="text-500 text-size-md d-block">{{
                        item.value
                      }}</span>
                    </div>
                  </div>
                  <ButtonDelete
                    title="Delete This Sheet"
                    @click.native="openModal(sheet.id, sectionId)"
                  />
                </div>
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
