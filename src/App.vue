<template>
  <v-app>
    <v-app-bar
        app
        color="dark"
        dark
    >
      <div class="d-flex align-center">
        <v-img
            alt="Dexit Logo"
            class="shrink mr-2"
            contain
            src="/img/logo.png"
            transition="scale-transition"
            width="40"
        />

        <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="/img/name-dark.png"
            width="100"
        />
      </div>

      <v-btn @click="$router.push('swap')" href="" text>
        <span>Token</span>
      </v-btn>
      <v-btn @click="$router.push('pool')" href="" text>
        <span>Pool</span>
      </v-btn>
    </v-app-bar>

    <!--Settings></Settings-->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <app-footer></app-footer>
    </v-footer>
  </v-app>
</template>

<script>
import AppFooter from './components/Footer';
//import Settings from "@/components/Settings";

export default {
  name: 'App',

  components: {
    //Settings,
    AppFooter,
  },

  data: () => ({
    //
  }),
};
</script>
