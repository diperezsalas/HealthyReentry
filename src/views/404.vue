<template>
  <div class="text-center">
    <div style="height: 80px"></div>

    <h1 style="color:white;font-size: 45px;margin: 50px;">404 Page not Found</h1>
    <h5 style="color:white;font-family: 'endurance-light';margin: 50px;">The page you are trying to access does not exist.</h5>
        <router-link :to="{ name: '/' }">
          <md-button class="md-primary md-raised">
             Go to home page
          </md-button>
        </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.text-center {
    padding-top: 20px;
}
</style>
