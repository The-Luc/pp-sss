<template>
  <v-row align="center" justify="space-around">
    <v-btn depressed color="primary" @click="handleClick(400)">
      400
    </v-btn>
    <v-btn depressed color="primary" @click="handleClick(401)">
      401
    </v-btn>
    <v-btn depressed color="error" @click="handleClick(403)">
      403
    </v-btn>
    <v-btn depressed color="error" @click="handleClick(404)">
      404
    </v-btn>
    <v-btn depressed color="blue" @click="handleIsDialog">
      {{ $t("error.modalManager") }}
    </v-btn>
  </v-row>
</template>
<script src="./Error.js" />
