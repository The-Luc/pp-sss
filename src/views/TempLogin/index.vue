<template>
  <div>
    <div class="pp-selector-container">
      <span class="pp-selector-container-title">Users:</span>

      <v-select
        class="pp-select"
        :items="users"
        item-text="name"
        item-value="value"
        solo
        return-object
        persistent-hint
        :menu-props="{ zIndex: 9999 }"
        @change="onChangeUser"
      >
        <template #selection="{ item }">
          <v-list-item class="pp-select--item item-selected">
            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span>{{ item.name }} ({{ item.role }})</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template #item="{ item, attrs, on }">
          <v-list-item class="pp-select--item" v-bind="attrs" v-on="on">
            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span :style="item.role === 'ADMIN' && { color: 'red' }">
                    {{ item.name }} ({{ item.role }})
                  </span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>

      <span class="pp-selector-container-title" style="margin-left: 10px;">
        Cover Option:
      </span>

      <v-select
        class="pp-select"
        :items="covers"
        item-text="name"
        item-value="value"
        solo
        return-object
        persistent-hint
        :menu-props="{ zIndex: 9999 }"
        @change="onChangeCover"
      >
        <template #selection="{ item }">
          <v-list-item class="pp-select--item item-selected">
            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span>{{ item.name }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template #item="{ item, attrs, on }">
          <v-list-item class="pp-select--item" v-bind="attrs" v-on="on">
            <v-list-item-content>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <span>{{ item.name }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>

      <span class="pp-selector-container-title" style="margin-left: 10px;">
        Max Page:
      </span>

      <v-text-field
        ref="maxPageInput"
        v-model="maxPage"
        @blur="onSubmit"
        @keyup.enter="onEnter"
        @keydown.esc="onCancel"
      />
    </div>
    <div style="text-align: center;">
      <div style="display: inline-block; width: 150px;">
        <PpButton :is-active="true" :is-disabled="false" @click="goToManager"
          >Login</PpButton
        >
      </div>
    </div>
  </div>
</template>

<script src="./script" />
