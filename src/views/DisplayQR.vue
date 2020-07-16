<template>
<div>
  <div class="px-2">
    <h4 class="text-muted">Display QR Code</h4>
    <div class="card mt-2">
      <div class="card-body bg-info p-2 text-white">
        <p class="mb-0">Show your below QR code to a {{companyInitials}} employee in order for them to locate your name in the app. When done, click <b>Back</b> to return to the homepage.</p>
      </div>
    </div>
  </div>

  <div class="d-flex">
    <canvas class="mx-auto" id="canvas"></canvas>
  </div>

  <md-list>
    <md-list-item class="mx-auto py-0">
      <md-button class="mx-auto">
        <router-link :to="{ name: 'menu' }"> <p class="text-muted mb-0">Back</p> </router-link>
      </md-button>
    </md-list-item>
  </md-list>

</div>
</template>
<script>
import QRCode  from 'qrcode';

export default {
  created() {
    if (this.$auth.userDB) this.user = this.$auth.userDB;
  },
  mounted() {

    const screenSize = screen.width > screen.height? screen.height : screen.width;
    var viewScale = 4;
    if (screenSize > 300) viewScale = screenSize/60;
   
    QRCode.toCanvas(document.getElementById('canvas'), process.env.VUE_APP_URL + "encounter/" + this.user.email, {"scale": viewScale}, function (error) {
      if (error) console.error(error)
    })
  },
  data() {
    return {
      user: null,
      companyInitials: process.env.VUE_APP_COMPANY_INITIALS
    };
  },
};
</script>
