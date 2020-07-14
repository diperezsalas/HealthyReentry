<template>
<!-- <div class="mx-auto" style="transform: translateY(150%)"> -->
<div>
  <div v-if="showAlert" class="alert alert-success" role="alert">
    You have sucessfully changed your office to {{user.location}}
  </div>
  <div style="height: 80px"></div>
  <div style="height: 42px;" >
    <div v-if="latestStatus">
      <div  class="text-white text-center">
          <i class="bright-blue far fa-clock"></i><span class="last-update"> Last Updated on:</span> <span class="last-date">{{showDisplayDate(new Date(latestStatus.date))}}</span>
          <div> 
            <i :class="'fas fa-circle fa-xs ' + enumStatusMap.filter(s => s.code === latestStatus.status)[0].css_key "></i> <span class="symtomps">{{status[latestStatus.status]}}</span>
          </div>
      </div>
    </div>
  
  </div>

<section class="buttons-sections menu">
  <div class="center">
    <div v-if="user" class="control-button">
      <div style="position:relative;">
        <router-link class="mx-auto" :to="{ name: 'status', params: { id: user._id}}">
          <div class="text-white menu-link">
            <i class="menu-icon far fa-clock"></i> 
            <div>Report Your Status</div>
            <i class="arrow fas fa-arrow-right"></i>
          </div>
          <!-- <md-button class="md-raised md-accent menu-button">
            <h6 class="my-3 text-white">Report Your Health Status</h6>
          </md-button> -->
        </router-link>
          <div class="color-hover"></div>
      </div>
  </div>
  </div>
  <div class="center bottom">
    <div v-if="user" class="control-button">
      <div>
        <router-link class="mx-auto" :to="{ name: 'encounter', params: { id: user._id}}">
          <div class="text-white menu-link">
            <i class="menu-icon fas fa-microphone-alt"></i>
            <div>Record Encounter</div>
            <i class="arrow fas fa-arrow-right"></i>
          </div>
          <!-- <md-button class="md-raised md-accent menu-button" style="margin-top: 16px;">
            <h6 class="mb-0 text-white">Record an Encounter</h6>
          </md-button> -->
        </router-link>
      </div>
       </div>
  </div>
  </section>

  
  <!-- Modal -->
  <md-dialog :md-close-on-esc="false" :md-click-outside-to-close="false" :md-active.sync="showDialog" :md-fullscreen="false">
    <md-dialog-title>Welcome {{user.name}}</md-dialog-title>
    <md-subheader class="mx-2 mb-0">
      You are not assigned to any office. Please select your office location and press submit.
    </md-subheader>
    <br>
    <md-content class="mx-4">

    <div class="card mx-auto">
        
      <select class="form-control" id="selectedOffice" v-model="selectedOffice">
        <option disabled value="">Select your office</option>
        <option :value='office.name' v-for="office of offices" :key="office.name">
          {{office.name}}
        </option>
        
      </select>

     

      
      </div>
     
      
    </md-content>
     
       <md-dialog-actions class="mx-4 my-2">
         
         <router-link :to="{ name: 'officeadmin' }">
             <div class="add-office" v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.admin"> Add Office</div>  
         </router-link>
           <div class="turner-button" style="margin:initial" @click="assignOffice()">
               Submit
          </div>
        </md-dialog-actions>
     
  
  </md-dialog>
</div>
</template>
<script>

// import store from "store/index.js";
const statusColors = ["#00C851", "#FF9800", "#DC3545"]

import {Vuex, mapState} from 'vuex';
import enumStatusMap from "../../server/util/enumStatusMap.js";

export default {
  // props: ["user"],
  created() {
    this.$api.get("/api/status/get-current").then(returnedStatus => {
      this.latestStatus = returnedStatus.data;
    });
      this.$api.get("/api/status/get-all-offices").then( returnedOffices => {
       this.offices = returnedOffices.data;
    }),
    setTimeout(()=>{
        if(!this.user.location || this.user.location == '' || this.user.location == 'N/A'){
          this.showDialog = true;
        }
      }, 5000);

  },
  mounted() {
    this.mapButtonCSS();
  },
  updated() {
    this.mapButtonCSS();
  },
  data() {
    return {
      showDialog: false,
      enumStatusMap: enumStatusMap,
      latestStatus: null,
      offices: [],
      showAlert: false,
      selectedOffice: '',
      status: ["No Signs or Symptoms",
        "Possible Exposure",
        "Positive Diagnosis"
      ],
    };
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    mapButtonCSS() {
      const buttonWidth = screen.width * 0.6 > 310 ? screen.width * 0.7 : 310;

      // window.$("#mainControls").css("transform", 'translateY(' + (screen.height /7) + 'px)');
      // window.$("#controlButtons").css("transform", 'translatex(-8px)');
      window.$(".btn-lg").css("width", buttonWidth + 'px');
      window.$("#statusCard").css("width", buttonWidth + 'px');

      // window.$("#statusCard").css("max-width", buttonWidth + 'px');
    },
    showDisplayDate(date) {
      return this.moment(date).format('ll');
    },

    async assignOffice() {
      if (selectedOffice.value != '') {
        const body = {
                          id: this.user._id,
                          location: selectedOffice.value
                      }
        let apiurl = `/api/status/update-user`;
        let res = await this.$api.post(apiurl , body).then(()=>{
          this.user.location = selectedOffice.value;
          this.showDialog = false;
          this.showAlert = true;
        });
      }
    }
    
  }
};
</script>

<style scoped>
.md-button {
  height: 7vh;
  /* background-color: #72DDF7; */
}

#body-section {
  margin-top: 0;
}

</style>
