<template>
  <div>
    <md-toolbar class="md-primary" >
      
      <div @click="login()" class="logo-nav">
          <img class="intro-logo" src="/imgs/turner-white.svg" alt="healthy reentry logo" style="max-width: 50px;">
          <div class="logo-text">COVID Health Check</div>
      </div>
   
      <div class="d-flex align-items-center" style="margin-left:auto;margin-right:4px;">
        
        <div v-if="$auth.userDB" class="display-name">
          {{$auth.userDB.name}}
        </div>

        <div v-if="$auth.isAuthenticated && $auth.userDB" style="margin-top:2px;">
          <md-menu md-size="small" md-align-trigger>
            <md-button class="md-icon-button" style="width=32px" md-menu-trigger>
              <!-- <md-avatar style="transform: scale(0.8);">
                <img :src="$auth.userDB.picture" alt="Avatar">
              </md-avatar> -->
              <md-icon class="fa fa-user-circle"></md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item disabled>{{$auth.userDB.name}}</md-menu-item>
                 <md-menu-item v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.office_admin && !$auth.userDB.permissions.admin">
                <router-link :to="{ name: 'admin' }">
                  {{$auth.userDB.location}} Admin 
                </router-link>
              </md-menu-item>
              <md-menu-item v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.admin">
                <router-link :to="{ name: 'admin' }">
                  Admin View
                </router-link>
              </md-menu-item>
                <md-menu-item  v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.admin">
               <router-link :to="{ name: 'officeadmin' }">
                  Offices
               </router-link>
               </md-menu-item> 
              <!-- <md-menu-item>Profile</md-menu-item> -->
              <md-menu-item @click="logout()">Log out</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
        <a v-else class="md-title md-dense mr-2" style="margin-left:auto" @click="login()" href="#!">
          Login
        </a>
      </div>

    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  created() {
  },
  data() {
    return {
      url: process.env.VUE_APP_DOC_URL
    };
  },
  methods: {
    login() {
      if (this.$auth.isAuthenticated === false) this.$auth.loginWithRedirect();
      else this.$router.replace("/menu");
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>

<style scoped>
#appHeader {
  background-color: rgb(52, 58, 64);
}
.md-primary {
  position: relative;
  width: 100%;
  background-color: transparent !important;
  box-shadow: none;
  padding: 0 20px;
}

.logo-text {
    font-size: 10px;
    color: rgba(255,255,255,0.7);
}
.display-name {
    font-size: 9px;
}
.display-name{
  position: absolute;
  right: 50px;
}
.md-icon-button {
  margin-right: -15px !important;
}
.logo-nav {
  cursor: pointer;
}

</style>
