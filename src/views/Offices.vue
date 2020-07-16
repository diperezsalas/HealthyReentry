<template>
    <div class="container container-task">
        <div style="height: 80px"></div>
                <h4>Offices</h4>
        <div class="row full-container">
            <div class="col-md-12">


                <div class="row mb-5" style="align-items: flex-end;">
                    <input hidden = true v-model="id" type="text" class="form-control">
                    <div class="col-md-5">
                        <label for="name">Name</label>
                        <input autocomplete="off" placeHolder="Name" v-model="name" type="text" id="name" class="form-control">
                    </div>
                    <div class="col-md-5">
                        <label for="address">Address</label>
                        <input autocomplete="off" placeHolder="Address" v-model="address" type="text" id="address" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <div class="container-buttons">
                            <button v-if="update == 0" @click="saveTasks()" class="btn btn-success">Add</button>
                            <button v-if="update != 0" @click="updateTasks()" class="btn btn-warning">Update</button>
                            <button v-if="update != 0" @click="clearFields()" class="btn">Back</button>
                        </div>
                    </div>
                </div>               
            </div>
            <div class="col-md-12">
                <table class="table table-striped" >
                        <thead>
                            <tr>
                                <th hidden=true scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Address</th>
                                <th class="text-center" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in arrayTasks" :key="task.id"> 
                                <td hidden=true v-text="task._id"></td>
                                <td width="30%" v-text="task.name"></td>
                                <td width="60%" v-text="task.address"></td>
                                <td class="text-center" style="min-width: 110px;" width="10%">
                                    <button style="margin-right: 10px;" class="btn-custom btn btn-info" @click="loadFieldsUpdate(task)"><i class="fa fa-pencil-alt"></i></button>
                                    <button class="btn-custom btn btn-danger" @click="deleteTask(task)"><i class="fa fa-times"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { json } from 'body-parser';

export default {
    data(){
        return{
            id:"",
            name:"", 
            address:"", 
            officeadmin:"", 
            users: [],
            update:0,
            arrayTasks:[], 
            nameToUpdate: '',
            offices: []
        }
    },

    methods:{

        async getAllUsersByOffice(office){
            let apiurl = `/api/admin/get-all-users`;
            let userData = await this.$api.get(apiurl);
            return userData.data.filter((user) => user.location == office);
        },
    
        async refreshData() {
            let me =this;
            this.isLoading = true;
            let officesSet = new Set();
            let apiurl = `/api/admin/get-all-offices`;
            let officeData = await this.$api.get(apiurl);
            var offices = officeData.data;
            offices.sort((a, b) => (a.name < b.name) ? -1 : 1)
            this.offices = offices;
            me.arrayTasks = offices;
            this.isLoading = false; 
        },

        async saveTasks(){
            let me =this;
            let apiurl = `/api/admin/add-office`; 
                    const body = {
                        name: this.name,
                        address: this.address
                    }
                    if (this.offices.find(o=>o.name === this.name)) {
                        alert('That offices is already registered');
                    } else {
                    let res = await this.$api.post(apiurl , body);
                        if (res.data) {
                        me.refreshData();
                        me.clearFields();
                        }else{
                        console.log("error saving location")
                        }
                    }
        },

        async updateTasks(){
            let me = this;
                const body = {
                        id: this.id,
                        name: this.name,
                        address: this.address
                    }
            let apiurl = `/api/admin/update-office`;
            let res = await this.$api.post(apiurl , body);
            if (res.data) {
                let name = this.name;
                this.getAllUsersByOffice(this.nameToUpdate).then((users) => {
                users.forEach((user)=>{
                    this.asignOffice(user, name);
                });
                });
                me.refreshData();
                me.clearFields();
            }else{
                console.log("error updating location")
            }
        },

        async asignOffice(user, name){
            let apiurl = `/api/status/update-user`;
            const body = {
                id: user._id,
                location: name
            }
            let res = await this.$api.post(apiurl , body);
        },

        async loadFieldsUpdate(data){ 
            this.update = data.id    
            let me =this;
            this.isLoading = true;
            let officesSet = new Set();
                
            let apiurl = `/api/admin/search-office?id=` + data._id;
            let response = await this.$api.get(apiurl);
            
            me.id= response.data[0]._id;
            me.name= response.data[0].name;
            me.address= response.data[0].address;
            this.nameToUpdate=response.data[0].name;
            this.isLoading = false;                 
        },

        async deleteTask(data){
             let me =this;
                let task_id = data._id
                if (confirm('Are you sure you want to delete ' + data.name + '?')) {
                    const body = {
                                id: data._id,
                                name: data.name,
                                address: data.address
                            }
                    let apiurl = `/api/admin/delete-office`;
                    let res = await this.$api.post(apiurl , body);
                
                    if (res.data) {
                        this.getAllUsersByOffice(data.name).then((users) => {
                            users.forEach((user)=>{
                                this.asignOffice(user, 'N/A');
                            });
                        });
                    
                        me.refreshData();
                        me.clearFields();

                    }else{
                        console.log("error delete location")
                    }
                }
            },

        clearFields(){/*LClear the fields and initialize the update variable to 0*/
            this.id = "";
            this.name = "";
            this.address = "";
            this.officeadmin = "";
            this.update = 0;
        }
    },
    beforeMount() {
        this.refreshData();
    },
}
</script>

<style scoped>
    .full-container{
        background: white;
        padding: 20px;
        border-radius: 20px;
        margin-top: 30px;
    }
    .btn-custom {
        font-size: 13px;
        width: 35px;
        height: 35px;
    }
</style>