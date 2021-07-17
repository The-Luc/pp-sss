<template>
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
      @change="onChange"
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
  </div>
</template>

<script src="./script" />
