Test
<template>
<div>
    <div style="height: 80px"></div>

  <h4>Report Your Health Status</h4>
  <div v-if="latestStatus">
    <div class="text-white text-center mt-3">
        <i class="bright-blue far fa-clock"></i><span class="last-update"> Last Updated on:</span> <span class="last-date">{{showDisplayDate(new Date(latestStatus.date))}}</span>
        <div v-if="latestStatus.status"> 
          <i :class="'fas fa-circle fa-xs ' + enumStatusMap.filter(s => s.code === latestStatus.status)[0].css_key "></i> <span class="symtomps">{{status[latestStatus.status]}}</span>

        </div>
    </div>
  </div>

  <div class="mt-2 alert-info2">
    <div>
      <p class="mb-2">
        Click on a color to see the definition, then select the appropriate color that matches your current status in regards to COVID-19. Click <b>Submit</b>.
      </p>
    </div>
  </div>
  <md-tabs class="mt-3" md-alignment="fixed" :md-active-tab="activeTab" style="min-height: 270px">
    <md-tab class="px-0" id="tab-green" md-label="Green" :md-icon="iconPath[0]" @click="selectStatus(0)" :selectedIndex="activeTab">
      <div class="container">
        <h4 style="color:black" class="mt-2">No Signs or Symptoms</h4>
          <div class="question-muted-row">Do you have a fever? <b class="green">NO</b></div>
          <div class="question-muted-row">Do you have shortness of breath? <b class="green">NO</b></div>
          <div class="question-muted-row">Do you have a cough? <b class="green">NO</b></div>
          <div class="question-muted-row">Have you knowingly been in contact or proximate contact in the past 14 days with anyone who has tested positive for COVID-19 or who has or had symptoms of COVID-19? <b class="green">NO</b></div>
          
           <div class="question-muted-row">Have you tested positive for COVID-19 in the past 14 days? <b class="green">NO</b></div>
           <div class="question-muted-row">Have you experienced any symptoms of COVID-19 in the past 14 days? <b class="green">NO</b></div>
           
      </div>

    </md-tab>
    <md-tab class="px-0" id="tab-orange" md-label="Orange" :md-icon="iconPath[1]" @click="selectStatus(1);" :selectedIndex="activeTab">
      <div class="container">
        <h4 style="color:black" class="mt-2">Possible Exposure</h4>

           <div class="question-row"><input  type="checkbox"  class="symptoms" id="fever2" value=0 v-model="checkedSymptoms"  @change="check($event)">
          <label for="fever2">Do you have a fever?</label></div>
          <div class="question-row"><input type="checkbox" class="symptoms" id="breath2" value=1 v-model="checkedSymptoms" @change="check($event)">
          <label for="breath2">Do you have shortness of breath?</label></div>
          <div class="question-row"><input type="checkbox" class="symptoms" id="cough2" value=2 v-model="checkedSymptoms" @change="check($event)">
          <label for="cough2">Do you have a cough?</label></div>
           <div class="question-row"><input type="checkbox" class="symptoms" id="knowingly2" value=3 v-model="checkedSymptoms" @change="check($event)">
         <label for="knowingly2">Have you knowingly been in contact or proximate contact in the past 14 days with anyone who has tested positive for COVID-19 or who has or had symptoms of COVID-19?</label></div>
          
          <div class="question-row"><input type="checkbox" class="symptoms" id="positive2" value=4 v-model="checkedSymptoms" @change="check($event)">
          <label for="positive2">Have you tested positive for COVID-19 in the past 14 days?</label></div>
           <div class="question-row"><input type="checkbox" class="symptoms" id="symptoms2" value=5 v-model="checkedSymptoms" @change="check($event)">
         <label for="symptoms2">Have you experienced any symptoms of COVID-19 in the past 14 days?</label></div>

        
      </div>
  
    </md-tab>
    <md-tab id="tab-red" md-label="Red" :md-icon="iconPath[2]" @click="selectStatus(2)" :selectedIndex="activeTab">
      <div class="container">
      <h4 style="color:black" class="mt-2">Positive Diagnosis</h4>
         <div class="question-row"><input type="checkbox"  class="symptoms" id="fever" value=0 v-model="checkedSymptoms"  @change="check($event)">
          <label for="fever">Do you have a fever?</label></div>
          <div class="question-row"><input type="checkbox" class="symptoms" id="breath" value=1 v-model="checkedSymptoms" @change="check($event)">
          <label for="breath">Do you have shortness of breath?</label></div>
          <div class="question-row"><input type="checkbox" class="symptoms" id="cough" value=2 v-model="checkedSymptoms" @change="check($event)">
          <label for="cough">Do you have a cough?</label></div>
           <div class="question-row"><input type="checkbox" class="symptoms" id="knowingly" value=3 v-model="checkedSymptoms" @change="check($event)">
          <label for="knowingly"> Have you knowingly been in contact or proximate contact in the past 14 days with anyone who has tested positive for COVID-19 or who has or had symptoms of COVID-19?</label></div>
          
          <div class="question-row"><input type="checkbox" class="symptoms" id="positive" value=4 v-model="checkedSymptoms" @change="check($event)">
          <label for="positive">Have you tested positive for COVID-19 in the past 14 days?</label></div>
           <div class="question-row"><input type="checkbox" class="symptoms" id="symptoms" value=5 v-model="checkedSymptoms" @change="check($event)">
         <label for="symptoms">Have you experienced any symptoms of COVID-19 in the past 14 days?</label></div>
        
         <li hidden=true>Taken a COVID-19 test and received a positive result, <b>OR</b></li>
        <li hidden=true>Received an isolation order from your country, state or local government, or a public health authority.</li>

      </div>
    </md-tab>
    
  </md-tabs>
  
  <!-- Button trigger modal -->

    <md-dialog-actions class="mx-4 my-2">
      
      <router-link :to="{ name: 'menu' }">
          <div class="add-office" v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.admin"> Back</div>  
      </router-link>
        <div class="turner-button" @click="showModal()" id="nextBtn">
        Submit
      </div>
   </md-dialog-actions>


   <li hidden=true><span>Checked Symptoms: {{ checkedSymptoms}}</span></li>


  <!-- Modal -->
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
    <md-dialog-title>Review Your Health Status</md-dialog-title>
    <md-subheader class="mx-2 mb-0">
      Review the details below then click <b class="ml-1 mr-0 px-0">Submit</b>. To edit, click <b class="ml-1 mr-0 px-0">Go Back</b>.
    </md-subheader>
    <md-content class="mx-4">

      <div class="card mx-auto">
        <div class="card-header">
          <h6>Status Detail</h6>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><b class="mr-2">Name:</b> {{user.name}}</li>
          <li class="list-group-item"><b>Status:</b>
            <div class="col mt-2 text-center">
              <md-icon :md-src="iconPath[selectedStatus]" />
              <p class="my-2">{{status[selectedStatus]}}</p>
            </div>
          </li>
        </ul>
      </div>
    </md-content>



    <md-dialog-actions class="mx-4 my-2">
      <md-button @click="showDialog=false">Go Back</md-button>
      <md-button class="md-accent md-raised text-white" @click="showDialog=false; submitEncounter()">Submit</md-button>
    </md-dialog-actions>
  </md-dialog>

  <!-- notifications -->

</div>
</template>
<script>
// import store from "store/index.js";
import Vuex from 'vuex';
import enumStatusMap from "../../server/util/enumStatusMap.js";

let tabIds = ["tab-green", "tab-orange", "tab-red", "tab-blue"]
export default {
  created() {
    this.$api.get("/api/status/get-current").then(returnedStatus => {
      this.latestStatus = returnedStatus.data;
      let curStatus = returnedStatus.data;
      let symptoms = returnedStatus.data.symptoms;

      for (let symp of symptoms) {
        this.symps[symp] = true;
        this.checkedSymptoms.push(symp);
      }


      if (curStatus) {
        this.latestStatus = curStatus;

        if (curStatus.status !== null) {
          this.activeTab = tabIds[curStatus.status];
          this.selectedStatus = curStatus.status;
           this.disableSubmit = true;
          if (this.latestStatus.status === 3 || this.latestStatus.status === 0) this.disableSubmit = false; //always disabled for blue

          if (this.latestStatus.status !== 3) { //hahs status and not blue
            if (this.latestStatus.status > 0) { //either orange or red
              this.iconPath[0] = "/imgs/lens-green-disabled2.svg"
              this.disableSubmit = true;
              if (this.latestStatus.status === 2) this.iconPath[1] = "/imgs/lens-orange-disabled2.svg" //red
                 this.disableSubmit = true;
            }
          } 
        }
      } else {
        this.selectedStatus = 0; //default to green
      }
    });
  },
  mounted() {

    // TEST TEST TEST
    // use this when status submitted -- this saves number
    // $.post("/api/encounters/get-graph", { status: "yellow"}).then(getEncounters => {
    //  console.log("encounters in last 14 days", getEncounters);
    // });
    // use this when status change to yellow and up critical ones... this need string
    // $.post("/api/status/report", { status: 1 }).then(savedStatus => {
    //  console.log("status Saved", savedStatus);
    // });
    const buttonWidth = screen.width * 0.6 > 280 ? screen.width * 0.7 : 280;

    // window.$("#nextBtn").css("width", buttonWidth + 'px');


  },
  data() {
    
    return {
      checkedSymptoms: [],
      enumStatusMap: enumStatusMap,
      showDialog: false,
      submitSuccess: false,
      notificationDuration: 4000,
      selectedStatus: null,
      symps: [false,false,false,false,false,false],
      latestStatus: {
        status: null
      },
      enableBlue: false,
      status: ["No Signs or Symptoms",
        " Possible Exposure",
        "Positive Diagnosis"
      ],
      activeTab: "tab-green",
      iconPath: [
        "/imgs/lens-green.svg",
        "/imgs/lens-orange.svg",
        "/imgs/lens-red.svg"
      ]
    };
  },
  watch: {
  },
  computed: Vuex.mapState({
    user: state => state.user,
  }),
  methods: {
    showModal(){
      if(this.latestStatus.status == 0){
        if(!this.checkedSymptoms.length == 0 || this.selectedStatus == 0){
          this.showDialog = true;  }
      }else if(this.latestStatus.status == 1){
           console.log(this.latestStatus.status)
           this.showDialog=false; 
      }else if(this.latestStatus.status==2){
          console.log(this.latestStatus.status)
          this.showDialog=false; 
      }
    },
    selectStatus(status){
      this.selectedStatus=status;


      if (this.selectedStatus == 0) {
        this.symps[4] = [false,false,false,false,false,false];
        this.checkedSymptoms = [];
      }

      if (this.selectedStatus == 1) {
        this.symps[4] = false;
        this.activeTab = tabIds[1]
        this.checkedSymptoms = this.checkedSymptoms.filter(e => e != '4');
      }
      if (this.selectedStatus == 2) {
        this.symps[4] = true;
        this.activeTab = tabIds[2]
        if(!this.checkedSymptoms.find(e => e == 4)) {
          this.checkedSymptoms.push("4");
        }
      }

    },
    check(e) {


          this.symps= [false,false,false,false,false,false];
          
          for (let i = 0; i < 5; i++) {
            
             this.symps[this.checkedSymptoms[i]] = true
          }
       
    if(this.symps[4] === true){
      this.selectedStatus = 2;
      this.activeTab = tabIds[2];
    } else {
      this.selectedStatus = 1;
      this.activeTab = tabIds[1];
    }

    // if(this.checkedSymptoms[4] != true){
    //   console.log("GO TO RED")
    //   this.activeTab = tabIds[2];
    // } 

    // if(this.checkedSymptoms.length==6){
    //   console.log("GO TO RED")
    //   this.activeTab = tabIds[2];
    // } 
    
     if(this.checkedSymptoms.length==0){
      this.selectedStatus = 0;
      this.activeTab = tabIds[0]; 
    } 

    },
    showDisplayDate(date) {
      return this.moment(date).format('ll');
    },
    submitEncounter() {
      // use this when status submitted -- this saves number
      const body = {
        status: this.selectedStatus,
        symptoms: this.checkedSymptoms
      }
      this.$api.post("/api/status/report", body).then(savedStatus => {
        this.latestStatus = savedStatus;

        if (savedStatus) {
          this.$emit("statusMsg");

          this.$router.push({
            name: 'menu'
          }); //return back to menu after saving

        }
      });
    }
  }
};
</script>

<style scoped>
.md-tabs+.md-tabs {
  margin-top: 24px;
}
.md-dialog /deep/ .md-dialog-container {
  transform: none;
}
.symptoms{
  margin: 10px 
}
.green {
  color: green;
} 
label {
    display: inline-block;
    margin-bottom: inherit;
    padding: 10px;
}
.question-row {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    background: #fafafa;
    transition: all .3s;
}
.question-row:hover{
     background: #efefef;
}

.question-muted-row {
      padding: 5px;
      background: #fafafa;
      font-size: 13px;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
  }
.turner-button {
    margin: 0;
}
.md-dialog-actions {
  margin: 0 !important;
  background: white;
  padding: 30px;
  border-radius: 0 0 20px 20px;
}
</style>
