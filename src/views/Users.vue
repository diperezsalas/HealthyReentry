<template>
  <div v-if="userReady" class="px-2 pb-4">
    <div style="height: 80px"></div>

    <!-- Status Update Modal -->
    <div class="modal fade" id="updateConfModal" tabindex="-1" role="dialog" aria-labelledby="updateConfModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="updateConfModalLabel">Updates</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="px-4">
              <b>Status to set: </b>
              <p>

               <strong v-if="userUpdateData.statusCodeToSet === 0" class="statusCircle" style="background:#00C851;"></strong>
               <strong v-else-if="userUpdateData.statusCodeToSet === 1" class="statusCircle" style="background:#FF9800;"></strong>
               <strong v-else-if="userUpdateData.statusCodeToSet === 2" class="statusCircle" style="background:#DC3545;"></strong>

                {{ enumStatusMap.filter(s => s.code === userUpdateData.statusCodeToSet)[0].label }}
         
           
              </p>
            </div>
            <b class="px-4">Persons selected: </b>
            <ul>
              <li v-for="usr in selectedUsers" :key="usr._id">{{ usr.name }}</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-secondary" @click="sendUpdateData">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Graph Download Modal -->
    <div class="modal fade" id="graphDownloadModal" tabindex="-1" role="dialog" aria-labelledby="graphDownloadModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="graphDownloadModalLabel">Download Logged Interactions</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="incubationDays">Incubation days:</span>
              </div>
              <input
                type="number"
                min="1"
                class="form-control"
                style="width: 60px;"
                v-model="incubationDays"
                aria-label="Number of days to check for encounters"
                aria-describedby="incubationDays"
              />
              <p>Encounters will be checked for so many days.</p>
            </div>
            <b class="px-4">Persons selected: </b>
            <ul>
              <li v-for="usr in selectedUsers" :key="usr._id">{{ usr.name }}</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="downloadGraphForSelectedAsCSV">Download</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update User Location Modal -->
    <div class="modal fade" id="updateUserLocationModal" tabindex="-1" role="dialog" aria-labelledby="updateUserLocationLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="updateUserLocationLabel">Update User Location</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="updInviewUserSelectedState(false); clearUpdateData()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedUsers.length > 0">
              <h6>
                <i :class="'fas fa-circle ' + selectedUsers[0].status.css_key"></i>
                {{ selectedUsers[0].name }}
              </h6>
              <p>{{ selectedUsers[0].email }}</p>
              <div class="dropdown">
                <button class="btn btn-secondary-outline dropdown-toggle" type="button" id="locDDMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {{ selectedUsers[0].officeCode }}
                </button>
                <div class="dropdown-menu overflow-auto mx-0" style="max-height:400px" aria-labelledby="locDDMenuButton">
                  <p class="dropdown-item" v-for="ofc in officesList" :key="ofc.LocationID" @click="userUpdateData.locationToSet = ofc.LocationName">
                    {{ ofc.LocationName }}
                  </p>
                </div>
                <p v-if="userUpdateData.locationToSet !== null">
                  <small><i>
                    Will be updated to: {{ userUpdateData.locationToSet }}
                  </i></small>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal" @click="updInviewUserSelectedState(false); clearUpdateData()">Close</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="sendUpdateData">Update</button>
          </div>
        </div>
      </div>
    </div>
      <!-- Update User Office Admin -->
    <div class="modal fade" id="updateUserOfficeAdminModal" tabindex="-1" role="dialog" aria-labelledby="updateUserLocationLabel" aria-hidden="true" > 
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="updateUserLocationLabel">Do you like to change user  profile? </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="updInviewUserSelectedState(false); clearUpdateData()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedUsers.length > 0">
              <h6>
              
                {{ selectedUsers[0].name }}
              </h6>
              <p>{{ selectedUsers[0].email }}</p>
              <div class="dropdown">
                <button class="btn btn-secondary-outline dropdown-toggle" type="button" id="locDDMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                  {{ selectedUsers[0].role}}   
                </button>
                <div class="dropdown-menu overflow-auto mx-0" style="" aria-labelledby="locDDMenuButton">
                  <p class="dropdown-item" v-for="role in role_admin" :key="role.id" @click="selectedUsers[0].roleToSet= role">
                      {{role}}
                      </p>
                </div>
                <p >
                  <small><i>
                    Will be updated to: {{ selectedUsers[0].roleToSet  }}
                  </i></small>
                </p>
              </div> 
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal" @click="updInviewUserSelectedState(false); clearUpdateData();">Close</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="sendUpdateOfficeAdmin(selectedUsers[0])">Update</button>
          </div>
        </div>
      </div>
    </div>

    

    <h4 v-if="$auth.userDB.permissions.admin" >Users</h4>
    <h4 v-if="$auth.userDB.permissions.office_admin && !$auth.userDB.permissions.admin" >{{$auth.userDB.location}} Admin Dashboard</h4>


    <hr class="my-3"/>

    <div class="mb-2 container-box">

      <div class="mb-2 button-section">

        <div style="display:flex; align-items: flex-end; flex-wrap: wrap;">

          <div>
            <small><i>
            <span v-if="$auth.userDB.permissions.admin" class="text-muted ml-3">
              <span v-if="allOfficesSelected">
                All offices selected
              </span>
              <span v-else>
                {{ officesSelectedCount }} offices selected
              </span>
            </span>
            </i></small>

              <div v-if="$auth.userDB.permissions.admin" class="turner-button button2" id="officeListMenu" data-toggle="dropdown" aria-haspopup="true"  style="margin:10px" aria-expanded="false">
                Office List
                <i style="margin-left: 10px" class="fas fa-long-arrow-alt-down"></i>               
              </div>
              <button hidden=true v-else  @click="setOfficeFilterForOneOffice($auth.userDB.location); updateUsersInView();" ref="refreshoffice">
                Refresh 
              </button> 
            <div class="dropdown-menu p-2 custom-dd-size" aria-labelledby="officeListMenu">

              <div class="row">
                <div class="col-12 pl-3">
                  <button class="btn btn-outline-secondary" type="button" @click="setOfficeFilterForAll(true); updateUsersInView();">
                    Select All
                  </button>
                  <button class="btn btn-outline-secondary mx-2" type="button" @click="setOfficeFilterForAll(false); updateUsersInView();">
                    Select None
                  </button>
                </div>
              </div>

              <hr />

              <div class="row overflow-auto mx-0" style="height:400px">
                <div class="col">
                  <p v-for="ofc in officesList" :key="ofc.LocationID" class="pl-4">
                    <input class="form-check-input" type="checkbox" v-model="ofc.selected" @change="updateUsersInView">
                    {{ofc.LocationName}}
                  </p>
                </div>
              <div class="col-6">
                  <p v-for="ofc in officesList.slice(15)" :key="ofc.LocationID">
                    <input class="form-check-input" type="checkbox" v-model="ofc.selected" @change="updateUsersInView">
                    {{ofc.LocationName}}
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div >
            <input  style="min-width: 180px; border-radius: 20px; padding: 20px;margin:10px"
              type="text"
              class="form-control"
              placeholder="Filter by name"
              v-model="nameFilter"
              @keyup="updateUsersInView"
              />
          </div>
        </div>
      </div>


      <div class="d-flex mb-2">

        <div    hidden=true class="mr-auto">

          <button id="actionDropdown" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Mark Status
          </button>
          <div class="dropdown-menu" aria-labelledby="actionDropdown">
            <span class="dropdown-item text-muted"><small><i>Applies to selected persons only</i></small></span>

            <div class="dropdown-divider"></div>
            <div v-if="selectedUsers.length">
              <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
                @click="userUpdateData.statusCodeToSet = 0;">
                <i class="fas fa-circle fa-xs en_green"></i> &nbsp;&nbsp; Mark green</span>
              <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
                @click="userUpdateData.statusCodeToSet = 1;">
                <i class="fas fa-circle fa-xs en_orange"></i> &nbsp;&nbsp; Mark orange</span>
              <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
                @click="userUpdateData.statusCodeToSet = 2;">
                <i class="fas fa-circle fa-xs en_red"></i> &nbsp;&nbsp; Mark red</span>
            </div>
            <!-- <div class="dropdown-divider"></div> -->

            <!-- <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
              @click="userUpdateData.statusCodeToSet = 3;"
            ><i class="fas fa-circle fa-xs en_blue"></i> &nbsp;&nbsp; Mark blue</span> -->

          </div>

        </div>

        <div  hidden=true>
          <button id="downloadDropdown" type="button" class="btn btn-outline-secondary ml-2 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Download
          </button>
          <div class="dropdown-menu" aria-labelledby="downloadDropdown">
            <span class="dropdown-item text-muted"><small><i>Applies to selected persons only</i></small></span>

            <div class="dropdown-divider"></div>

            <span class="dropdown-item" data-toggle="modal" data-target="#graphDownloadModal">
              Download Interactions
            </span>
            <span class="dropdown-item" @click="downloadSelectedAsCSV">
              Download Data
            </span>
            <span class="dropdown-item" @click="downloadOfficeStats">
              Download Office Stats
            </span>
          </div>
        </div>

      </div>

    <div v-if="isLoading" style="background: white;width: 100%;">
          <md-progress-bar md-mode="indeterminate" ></md-progress-bar>
    </div>

      <table style="margin-top:20px;" class="table table-striped table-hover table-sm">

        <thead>
          <tr>
            <th hidden=true style="width: 5%" class="text-center">
              <small hidden=true ><i hidden=true>
                <span hidden=true
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState(true)"
                >
                All
                </span>
                |
                <span hidden=true
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState(false)"
                >
                None
                </span>
                |
                <span hidden=true
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState('invert')"
                >
                Invert
                </span>
              </i></small>
              <br />
              <span
                style="cursor: pointer"
                :class="(sortBy === 'selected' ? '' : ' disabled')"
                @click="sortUsers('selected', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Select
            </th>

           <th  v-if="$auth.userDB.permissions.admin" c  style="width: 5%" class="text-center">
           
              Role
            </th>

            <th  style="width: 10%" class="text-center">
              <span
                style="cursor: pointer"
                :class="(sortBy === 'statusCode' ? '' : ' disabled')"
                @click="sortUsers('statusCode', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Role
            </th>
           
            <th style="width: 25%">
              <span
                style="cursor: pointer"
                :class="(sortBy === 'name' ? '' : ' disabled')"
                @click="sortUsers('name', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Name
            </th>
            <th style="width: 15%" v-if="$auth.userDB.permissions.admin">
              <span
                style="cursor: pointer"
                :class="(sortBy === 'officeCode' ? '' : ' disabled')"
                @click="sortUsers('officeCode', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Office
            </th>
            <th  hidden=true style="width: 20%">
              <span
                style="cursor: pointer"
                :class="(sortBy === 'lastUpdated' ? '' : ' disabled')"
                @click="sortUsers('lastUpdated', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Last Updated 
            </th>
            <th style="width: 15%">
              <span
                style="cursor: pointer"
                :class="(sortBy === 'dateOfConsent' ? '' : ' disabled')"
                @click="sortUsers('dateOfConsent', !sortAsc)"
              >
                {{ (sortAsc) ? '&#x21f5;' : '&#x21c5;' }}
              </span>
              Consent Date
            </th>
          </tr>
        </thead>

        <tbody>
          <tr   class="user-table" v-for="user in usersInView" :key="user.id">
            <td hidden=true style="width: 5%; cursor: pointer;" class="text-center" @click="user.selected = !user.selected">
              {{ (user.selected) ? '&#9745;' : '&#9744;' }}
            </td>
            <td   v-if="$auth.userDB.permissions.admin" style="width: 5%; cursor: pointer;" class="text-center" >
                 
              <div
              
                data-toggle="modal"
                data-target="#updateUserOfficeAdminModal"
                @click="user.selected = true;"
                class="text-secondary">
              <i class="fas fa-users-cog"></i>
             
              </div>
                     
             
             
            
            </td>
            <td  hstyle="width: 5%" class="text-center">
             {{   (user.role) }}
            </td>
         
            <td  style="width: 25%">
              {{ user.name }}
            </td>
            <td style="width: 15%" v-if="$auth.userDB.permissions.admin">
              <span
                data-toggle="modal"
                data-target="#updateUserLocationModal"
                @click="updInviewUserSelectedState(false); clearUpdateData(); user.selected = true;"
                class="text-secondary">
                <i class="fas fa-pen-square" style="cursor: pointer;"></i>
              </span>
              {{ user.officeCode }}
            </td>
            <td  hidden=true style="width: 20%">
              {{ user.lastUpdatedFormatted }}
            </td>
            <td style="width: 15%">
              {{ user.dateOfConsentFormatted }}
            </td>
            
          </tr>
        </tbody>

      </table>

      <div class="row mb-1 mt-5">
        <div class="col-lg-6"></div>
        <div class="col-lg-3 col-md-6 ">

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="pageNav">Items per page:</span>
            </div>
            <select class="form-control" id="pageNav" v-model="itemsOnPage" @change="setItemsOnPage(itemsOnPage)">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
              <option>{{ users.length }}</option>
            </select>
          </div>

        </div>

        <div class="col-lg-3 col-md-6 mb-1">

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="pageNav">Current page:</span>
            </div>
            <input
              type="number"
              min="1"
              class="form-control"
              v-model="pageNo"
              aria-label="Current page number"
              aria-describedby="pageNav"
            />
            <div class="input-group-append">
              <span
                :style="'cursor: ' + (((pageNo-1) < 1) ? 'not-allowed' : 'pointer') "
                @click="setPageNo(pageNo-1)"
                :class="'input-group-text ' + (((pageNo-1) < 1) ? 'disabled' : '') "
                id="pageNav"><i class="fas fa-chevron-left"></i></span>
            </div>
            <div class="input-group-append">
              <span
                :style="'cursor: ' + (((pageNo) * itemsOnPage >= users.length) ? 'not-allowed' : 'pointer') "
                @click="setPageNo(pageNo+1)"
                :class="'input-group-text ' + (((pageNo) * itemsOnPage >= users.length) ? 'disabled' : '') "
                id="pageNav"><i class="fas fa-chevron-right"></i></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>



<script>
import Vue from 'vue';
import {Vuex, mapState} from 'vuex';
import enumStatusMap from "../../server/util/enumStatusMap.js";
import graphToCsv from "../../server/util/csvUtils.js";

function downloadCSV(content, fileName) {
  let dlTrigger = document.createElement('a');
  dlTrigger.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  dlTrigger.setAttribute('download', fileName);
  dlTrigger.style.display = 'none';
  document.body.appendChild(dlTrigger);
  dlTrigger.click();
  document.body.removeChild(dlTrigger);
}

// ref: https://stackoverflow.com/questions/7641791/javascript-library-for-human-friendly-relative-date-formatting
function fuzzyTime(date) {

  var delta = Math.round((+new Date - date) / 1000);

  var minute = 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

  var fuzzy;

  if (isNaN(delta)) {
    fuzzy = '---';
  } else if (delta < 30) {
    fuzzy = 'just now';
  } else if (delta < minute) {
    fuzzy = `${delta} seconds ago`;
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago'
  } else if (delta < hour) {
    fuzzy = `${Math.floor(delta / minute)} minutes ago`;
  } else if (Math.floor(delta / hour) == 1) {
    fuzzy = '1 hour ago'
  } else if (delta < day) {
    fuzzy = `${Math.floor(delta / hour)} hours ago`;
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  } else if (delta < day * 10) {
    fuzzy = `${Math.floor(delta / day)} days ago`;
  } else {
    fuzzy = `${date.toDateString()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  return fuzzy;
}

export default {
  beforeMount() {
    
    },
  created() {
    this.$api.get("/api/status/get-all-offices").then( returnedOffices => {
      this.offices = returnedOffices.data;
    })    
  },
  mounted() {
    this.refreshData();
  },
  data() {
    return {
      
      isLoading: false,
      role: "",
      pageNo: 1,
      itemsOnPage: 10,
      nameFilter: "",
      sortBy: null,
      sortAsc: true,
      officesList: [],
      usersInView: [],
      users: [],
      incubationDays: 2,
      enumStatusMap: enumStatusMap,
      offices: [],
      role_admin: ["Admin","Office Admin", "User"],
      userUpdateData: {
        statusCodeToSet: -1,
        selectedUserIds: [],
        locationToSet: null,
        roleToSet:""
      }
    };
  },
  computed: {
    officesSelectedCount() {
      return this.officesList.reduce((a, c) => a + (c.selected ? 1 : 0), 0);
    },
    allOfficesSelected() {
      
      return this.officesList.every(o => o.selected);
    },
    selectedUsers() {
      return this.usersInView
                  .filter(u => u.selected);
    },
    ...mapState(['userReady'])
  },
  methods: {
  
    async downloadGraphForSelectedAsCSV() {

      let userEmails = this.selectedUsers.map(u => u.email);  
      if (userEmails.length < 1) return;
      this.isLoading = true;
      let postBody = {
        emails: userEmails,
        incubationDays: this.incubationDays
      };
      let res = await this.$api.post(`/api/admin/get-graph`, postBody);
      let allGraphs = res.data;
      let fileTxt = "";
      let c = 0;
      allGraphs.forEach(graph => {
        let gCSV = graphToCsv(graph);
        let u = this.selectedUsers[c];
        fileTxt += `Name,${u.name}\r\nStatus,${u.status.label}\r\nUpdated,${u.lastUpdated}\r\n${gCSV}\r\n`;
        c++;
      });
      //downloadCSV(fileTxt, `encounters(graph)_${new Date().toLocaleDateString()}:${new Date().getHours()}:${new Date().getMinutes()}.csv`);
      this.isLoading = false;
    },
    downloadSelectedAsCSV() {
      let tot = "Print Name, Company, Status,LastUpdated, Do you have a fever?, Do you have shortness of breath?,Do you have a cough?, Have you knowingly been in contact or proximate contact in the past 14 days with anyone who has tested positive for COVID-19 or who has or had symptoms of COVID-19?, Have you tested positive for COVID-19 in the past 14 days?, Have you experienced any symptoms of COVID-19 in the past 14 days?";
      let selectedUsersWithStatus = [];

      for (let user of this.selectedUsers){
        for (let userStatus of user.allStatus){
          let userTemp = { ...user };
          userTemp.status = userStatus;
          let symptoms = [false,false,false,false,false,false];
          for (let symptom of userTemp.status.symptoms) {
            symptoms[symptom] = true;
          }
          userTemp.symptoms = symptoms;
          selectedUsersWithStatus.push(userTemp);
        }
      }

      let csv = selectedUsersWithStatus
                    .map(u => `${u.name},${u.officeCode},${this.enumStatusMap[u.status.status].label},${String(this.moment(u.status.date).format('lll')).replace(/\,/g, '')},${u.symptoms[0]},${u.symptoms[1]},${u.symptoms[2]},${u.symptoms[3]},${u.symptoms[4]},${u.symptoms[5]}`)
                    .reduce((tot, cur) => tot + "\n" + cur, tot);
      downloadCSV(csv, `encounters_${new Date().toLocaleDateString()}:${new Date().getHours()}:${new Date().getMinutes()}.csv`);
    },
    downloadOfficeStats() {
      let csv = "Office,Orange,Red,Total Signups\r\n";
      this.officesList.forEach(o => {
        let locUsers = this.users.filter(u => u.location === o.LocationName);
        let rCount = locUsers.filter(u => u.status.status === 2).length;
        let oCount = locUsers.filter(u => u.status.status === 1).length;
        csv += `${o.LocationName},${oCount},${rCount},${locUsers.length}\r\n`;
      }),
      downloadCSV(csv, `office-stats_${new Date().toLocaleDateString()}:${new Date().getHours()}:${new Date().getMinutes()}.csv`);
    },
    updateUsersInView() {

      let officeArr = this.officesList
                            .filter(o => o.selected)
                            .map(o => o.LocationName);
      let officeFilteredUsers = this.users.filter(u => officeArr.includes(u.location));

      let nameFilteredUsers = officeFilteredUsers;
      if(this.nameFilter !== "") {
        let nfLower = this.nameFilter.toLowerCase();
        nameFilteredUsers = nameFilteredUsers.filter(u => u.name.toLowerCase().includes(nfLower));
      }

      let st = (this.itemsOnPage * (this.pageNo - 1));
      let ed = (this.itemsOnPage * (this.pageNo));
      let pageFilteredUsers = nameFilteredUsers.slice(st, ed);

      this.usersInView = pageFilteredUsers.map(u => {
        let hasStatus = u.status[0] && u.status[0].status !== null && u.status[0].status !== undefined;
        let code = (hasStatus) ? u.status[0].status : -1;
        let status = enumStatusMap.filter(i => i.code === code)[0];
        let updateDate = (hasStatus) ? fuzzyTime(new Date(u.status[0].date)) : '---';

        let symps= [false,false,false,false,false,false];
        let i;
          for (i = 0; i < 5; i++) {
            
             symps[u.status[0].symptoms[i]] = true
          }
      
         if(!u.permissions.office_admin && u.permissions.admin ){
             this.role = "Admin"
         }else if (u.permissions.office_admin && !u.permissions.admin){
             this.role = "Office Admin"
         } else if (u.permissions.office_admin && u.permissions.admin){
           this.role = "Admin"
         }else{
            this.role = "User"
         }

        let user = {
          id: u._id,
          selected: false,
          name: u.name,
          office_admin: u.permissions.office_admin,
          email: u.email,
          officeCode: u.location,
          status: status,
          allStatus: u.status,
          symptoms: symps,
          role: this.role,
          roleToSet: this.roleToSet,
          statusCode: status.code,
          lastUpdatedFormatted: updateDate,
          lastUpdated: hasStatus ? new Date(u.status[0].date) : null,
          dateOfConsent: u.dateOfConsent ? new Date(u.dateOfConsent) : 0,
          dateOfConsentFormatted: u.dateOfConsent ? new Date(u.dateOfConsent).toDateString() : 'Not Available'
        };

        return user;
      });

    },
    async refreshData() {

      this.isLoading = true;
      let officesSet = new Set();

      let apiurl = `/api/admin/get-all-users`;
      let userData = await this.$api.get(apiurl);
      //console.log(userData);
      var users = userData.data;
      users.sort((a, b) => (a.name < b.name) ? -1 : 1)
      this.users = users;
      this.offices.sort((a, b) => a.name < b.name ? -1 : 1);
        officesSet.add('N/A');
      this.offices.forEach(office => {
       
        let loc = office.name || 'unknown';
        officesSet.add(loc);
      });
     /*  this.users.forEach(u => {
        let loc = u.location || 'unknown';
        officesSet.add(loc);
      }); */
      this.officesList = Array.from(officesSet).map(o => { return { LocationName:o, selected: true } });
      this.updateUsersInView();
      this.isLoading = false;

  

    },
    async sendUpdateOfficeAdmin(me){
       
       const body = {
                        id: me.id, 
                        name: me.name,
                        email: me.email,
                        permissions:me.office_admin,
                        roleToSet:me.roleToSet
                        }
                      
        this.isLoading = true;
         let res = await this.$api.post("/api/admin/update-role", body);
        // this.clearUpdateData();
        // this.updInviewUserSelectedState(false);
         this.refreshData();
          this.updateUsersInView();
         this.isLoading = false;                                      


    },
    async sendUpdateData() {

      this.userUpdateData.selectedUserIds = this.selectedUsers
                                                .map(u => { return { userId: u.id }});
                                                console.log(this.selectedUsers);
      this.isLoading = true;
      let res = await this.$api.post("/api/admin/update-users", this.userUpdateData);
      let updatedUsers = res.data;

      updatedUsers.forEach(nu => {
        let idx = this.users.findIndex(u => u._id === nu._id);
        this.users[idx] = nu;
        this.users[idx].status = [this.users[idx].status];
       // console.log(this.users);
        this.refreshData();
        this.updateUsersInView();
        const color = enumStatusMap.filter(s => s.code === this.users[idx].status[0].status)[0].label;
          $('.' + this.users[idx]._id).removeClass(['en_green', 'en_red', 'en_orange']);
          $('.' + this.users[idx]._id).addClass('en_' + color.toLowerCase());
      });

      this.clearUpdateData();
      this.updInviewUserSelectedState(false);

      $(function () {
        $('#updateConfModal').modal('hide');
      });
      
      this.isLoading = false;

    },
    updInviewUserSelectedState(val) {
      this.usersInView.forEach(u => u.selected = (val === 'invert') ? !u.selected : val);
    },
    async clearUpdateData() {
      this.userUpdateData.statusCodeToSet = -1;
      this.userUpdateData.selectedUserIds = [];
      this.userUpdateData.locationToSet = null;
      this.userUpdateData.role = null;
    },
    sortUsers(key, inAsc) {
      this.sortBy = key;
      this.sortAsc = inAsc;
      let i = this.sortAsc ? 1 : -1;
      this.usersInView.sort((a, b) => {
        return (a[this.sortBy] < b[this.sortBy])
        ? -i : (a[this.sortBy] > b[this.sortBy])
        ?  i : 0;
      });
    },
    setPageNo(newNo) {
      if (newNo < 1 || ((newNo-1) * this.itemsOnPage) > this.users.length) return;
      this.pageNo = parseInt(newNo);
      this.updateUsersInView();
    },
    setItemsOnPage(newNo) {
      if (newNo < 1) return;
      this.itemsOnPage = parseInt(newNo);
      this.updateUsersInView();
    },
    setOfficeFilterForAll(val) {
      this.officesList.forEach(o => o.selected = val);
    },
    setOfficeFilterForOneOffice(val) {
    
    
      this.officesList.forEach(o => o.LocationName = val);
  
    }
  }
};
</script>

<style scoped>
.custom-dd-size {
  padding-left: 40px;
  width: 400px !important;
}

#updateConfModalLabel {
  color: black
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.statusCircle {
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  top: 1px;
}

</style>
