<template>
  <div>
    <div style="height: 80px"></div>
    <div class="row home-intro">
      <div class="col">
        <div>
          <img class="intro-logo" src="/imgs/turner-white.svg" alt="healthy reentry logo" style="margin-bottom: 10px">
          <div class="down-logo">COVID Health Check by<br>Turner Construction</div>

          <div class="text-inherit">
            At Turner Construction the health and safety of our employees is our top priority.
          </div>
            <div class="turner-button"  @click="login()">
               Get Started
            </div>
            <div class="img-container">
              <img class="home-icon" src="/imgs/home-icon.svg" alt="healthy reentry logo" style="margin-bottom: 10px">
            </div>


        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() { 
    return { 
        url: process.env.VUE_APP_DOC_URL, 
        company: process.env.VUE_APP_COMPANY
    }
},
  methods: {
    login() {
      if (this.$auth.isAuthenticated === false) {
        this.$auth.loginWithRedirect();
      }
      else if(!this.$auth.userDB.dateOfConsent){
          this.$router.push('/disclosure');
      } else {
        this.$router.push('/menu');
      }
    }
  }
};
</script>

<style scoped>
.home-intro {
  text-align: center;
}
</style>
