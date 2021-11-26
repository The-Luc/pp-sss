<template>
  <v-menu
    ref="subMenu"
    content-class="pp-select-sub-container"
    absolute
    open-on-hover
    close-on-click
    close-on-content-click
    :activator="activator"
    :nudge-bottom="position.y"
    :nudge-right="position.x"
    :is-sub-activated="isSubActivated"
    @mouseEnterMenu="onMouseEnterMenu"
    @mouseLeaveMenu="onMouseLeaveMenu"
  >
    <v-list class="pp-select-sub" @click.native="onSubContainerClick($event)">
      <template v-for="item in items">
        <v-hover :key="item.value" v-slot="{ hover }">
          <v-list-item
            :ref="getDataIdByValue(item.value)"
            class="pp-select-sub--item"
            :class="getCustomCssClass(item)"
            @click.native="onSubClick(item)"
          >
            <img
              :style="{
                visibility: isSelected(item) ? 'visible' : 'hidden'
              }"
              class="icon-ative"
              :src="activeMenuIcon"
              alt="icon-active"
            />

            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span>{{ item.name }}</span>
                  <span class="hide">{{ hover }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>

            <v-icon
              :style="{
                visibility: isSubmenuExisted(item) ? 'visible' : 'hidden'
              }"
              class="icon-arrow"
            >
              arrow_right
            </v-icon>

            <SubLevel
              v-if="isSubmenuExisted(item)"
              :activator="`.${getDataIdByValue(item.value)}`"
              :items="item.subItems"
              :parent-value="item.value"
              :selected-val="getSelectedSub(item)"
              :position="getSubmenuPosition(item)"
              @change="onSubClick"
              @subEnter="onSubEnter"
              @subLeave="onSubLeave"
            />
          </v-list-item>
        </v-hover>
      </template>
    </v-list>
  </v-menu>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
