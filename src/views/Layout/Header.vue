<template>
  <v-app-bar color="deep-purple accent-4" dense dark app>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-avatar class="flag">
      <img :src="IMG_LOCAL.VietNamFlag" alt="Viet nam" />
    </v-avatar>
    <v-avatar class="flag">
      <img :src="IMG_LOCAL.USAFlag" alt="John" />
    </v-avatar>
    <router-link to="/">
      <v-btn depressed>Home</v-btn>
    </router-link>
    <router-link to="/login" v-if="!token">
      <v-btn depressed>Login</v-btn>
    </router-link>
    <v-btn depressed v-else @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ACTIONS } from "../../store/modules/auth/const";
import IMG_LOCAL from "../../common/constants/image";
import "./Header.scss";

export default {
  data() {
    return {
      IMG_LOCAL
    };
  },
  methods: {
    ...mapActions({
      logout: ACTIONS.LOGOUT
    })
  },
  computed: mapState({
    token: state => state.auth.token
  })
};
</script>
