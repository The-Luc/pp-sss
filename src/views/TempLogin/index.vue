<template>
  <div class="login-container">
    <div v-if="!isLoggedIn" class="login-content">
      <v-text-field
        v-model="email"
        label="Email"
        :rules="rules"
        hide-details="auto"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="rules"
        hide-details="auto"
        @keydown.enter="onClickLogin"
      ></v-text-field>
      <PpButton
        class="login-btn"
        :is-active="true"
        :is-disabled="isDisabledLogin"
        @click="onClickLogin"
        >Login</PpButton
      >
    </div>
    <div v-if="isLoggedIn" class="select-book">
      <v-text-field
        v-model="selectedBookId"
        label="Enter book Id (default 2749)"
        hide-details="auto"
      ></v-text-field>
      <pp-button
        class="login-btn"
        :is-active="true"
        :is-disable="false"
        @click="goToManager"
        >Select</pp-button
      >
    </div>
  </div>
</template>

<script src="./script" />

<style lang="scss" src="./style.scss" scoped />
