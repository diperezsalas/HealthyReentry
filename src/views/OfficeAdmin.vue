<template>
    <div class="container container-task">
        <div class="row">
            <div class="col-md-6">
                <h2>Offices</h2>
                <table class="table text-center" ><!--We create a table that needs all the Offices-->
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Address</th>
                                <th scope="col">Office Administrator</th>
                                <th scope="col">Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in arrayTasks" :key="task.id"> <!--We go through the array and load our table-->
                                <td v-text="task.name"></td>
                                <td v-text="task.description"></td>
                                <td v-text="task.content"></td>
                                <td>
                                    <!--Modify button, which loads the form data with the selected task-->
                                    <button class="btn" @click="loadFieldsUpdate(task)">Edit</button>
                                    <!--Button that deletes the task that we select-->
                                    <button class="btn" @click="deleteTask(task)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
            <div class="col-md-6">
                <div class="form-group"><!--Form for the creation or modification of our tasks-->
                    <label>Name</label>
                    <input v-model="name" type="text" class="form-control">

                    <label>Address</label>
                    <input v-model="description" type="text" class="form-control">

                    <label>Office Adminitrators</label>
                    <input v-model="content" type="text" class="form-control">
                </div>
                <div class="container-buttons">
                    <!-- Button that adds the form data, it is only shown if the update variable is equal to 0-->
                    <button v-if="update == 0" @click="saveTasks()" class="btn btn-success">Add</button>
                    <!-- Button that modifies the task that we have previously selected, is only shown if the update variable is different from 0-->
                    <button v-if="update != 0" @click="updateTasks()" class="btn btn-warning">Update</button>
                    <!-- Button that cleans the form and initializes the variable to 0, it is only shown if the update variable is different from 0-->
                    <button v-if="update != 0" @click="clearFields()" class="btn">Back</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return{
                name:"", //Esta variable, mediante v-model esta relacionada con el input del formulario
                description:"", //Esta variable, mediante v-model esta relacionada con el input del formulario
                content:"", //Esta variable, mediante v-model esta relacionada con el input del formulario
                update:0, /*Esta variable contrarolará cuando es una nueva tarea o una modificación, si es 0 significará que no hemos seleccionado
                          ninguna tarea, pero si es diferente de 0 entonces tendrá el id de la tarea y no mostrará el boton guardar sino el modificar*/
                arrayTasks:[], //Este array contendrá las tareas de nuestra bd
            }
        },
        methods:{
            async getTasks(){
                console.log("here")
                let me =this;
                let url = `/api/admin/get-all-users` //Ruta que hemos creado para que nos devuelva todas las tareas
                axios.get(url).then(function (response) {
                    //creamos un array y guardamos el contenido que nos devuelve el response
                    me.arrayTasks = response.data;
                    console.log("tasks" + me.arrayTasks.data)
                })
                .catch(function (error) {
                    // handle error
                    console.log("errores" + error);
                });
            },
            async refreshData() {
                console.log("here2")
                this.isLoading = true;
                let officesSet = new Set();
                 console.log(officesSet)
                let apiurl = `/api/admin/get-all-users`;
                let userData = await this.$api.get(apiurl);
                console.log(userData.data)
                var users = userData.data;
                users.sort((a, b) => (a.name < b.name) ? -1 : 1)
                this.users = users;
                this.users.forEach(u => {
                    let loc = u.location || 'unknown';
                    officesSet.add(loc);
                });
                this.officesList = Array.from(officesSet).map(o => { return { LocationName:o, selected: true } });
                this.officesList.sort((a, b) => a.LocationName < b.LocationName ? -1 : 1);
                //this.updateUsersInView();
                this.isLoading = false;
                console.log(officesList)
                console.log(users)
                

            },
            saveTasks(){
                let me =this;
                let url = '/tareas/guardar' //Route that we have created to send a task and save it
                axios.post(url,{ // these variables are the ones we will send to create the task
                    'name':this.name,
                    'description':this.description,
                    'content':this.content,
                }).then(function (response) {
                    me.getTasks();//we call the getTask () method; so that it refreshes our array and shows the new data
                    me.clearFields();//We clean the fields and initialize the update variable to 0
                })
                .catch(function (error) {
                    console.log(error);
                });   
                
            },
            updateTasks(){/*This function is the same as the previous one, only it also sends the update variable that contains the id of the
                task that we want to modify*/
                let me = this;
                axios.put('/tareas/actualizar',{
                    'id':this.update,
                    'name':this.name,
                    'description':this.description,
                    'content':this.content,
                }).then(function (response) {
                   me.getTasks();//we call the getTask () method; so that it refreshes our array and shows the new data
                   me.clearFields();//We clean the fields and initialize the update variable to 0
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            loadFieldsUpdate(data){ //This function fills in the fields and the variable update, with the task that we want to modify
                this.update = data.id
                let me =this;
                let url = '/tareas/buscar?id='+this.update;
                axios.get(url).then(function (response) {
                    me.name= response.data.name;
                    me.description= response.data.description;
                    me.content= response.data.content;
                    
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                }); 
            },
            deleteTask(data){//This will open a javascript alert and if we accept it will delete the task we have chosen
                let me =this;
                let task_id = data.id
                if (confirm('¿Seguro que deseas borrar esta tarea?')) {
                    axios.delete('/tareas/borrar/'+task_id
                    ).then(function (response) {
                        me.getTasks();
                    })
                    .catch(function (error) {
                        console.log(error);
                    }); 
                }
            },
            clearFields(){/*LClear the fields and initialize the update variable to 0*/
                this.name = "";
                this.description = "";
                this.content = "";
                this.update = 0;
            }
        },
        beforeMount() {
          this.refreshData();
          //this.getTasks();

        },
        mounted() {
           //this.getTasks();
           
        }
    }
</script>