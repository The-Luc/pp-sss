<template>
  <div>
    <v-alert type="error" v-if="notTrue">Check password</v-alert>
    <form>
      <v-text-field
        label="User"
        required
      ></v-text-field>
      <v-text-field
        type="password"
        label="Password"
        required
      ></v-text-field>
      <v-btn class="mr-4" @click="submit">
        Login
      </v-btn>
      <v-btn @click="clear">
        Clear
      </v-btn>
    </form>
  </div>
</template>

<script src="./Login.js"></script>
