<template>

    <div class="container-fluid" v-if="auth">
        <div class="row">
            <div class="col-md-3 col-lg-2 d-md-block">
            
            </div>

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
               
                <h2>Login Logger</h2>

                <div class=" mt-5 mb-5">
                    Start Date
                    <input name="startDate" type="date" v-model="data.startDate">
                    End date
                    <input name="endDate" type="date" v-model="data.endDate">
                    
                    <button type="button" class="btn btn-primary m-2" @click="getRecords()">Submit
                        <span v-if="data.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                </div>
                
                <div class="table-responsive">

                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                            <th scope="col">Date</th>
                            <th scope="col">User Count</th>
                            <th scope="col">PC Login Count</th>
                            <th scope="col">iOS Login Count</th>
                            <th scope="col">Android Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,i) in data.records" v-bind:key="i">
                                <th scope="row">{{item.login_date}}</th>
                                <td>{{item.user_count}}</td>
                                <td>{{item.pc_count}}</td>
                                <td>{{item.ios_count}}</td>
                                <td>{{item.android_count}}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </main>
        </div>
    </div>


</template>

<script lang="ts">

import {onMounted, reactive, computed} from 'vue'
import {useStore} from 'vuex'
import { notify } from "@kyvg/vue3-notification";
import {apiHost} from '../config'

export default{
    name:'Logger',
    setup() {
        const store = useStore()
        
        const auth = computed( () => store.state.authenticated)

        const data = reactive({
            loading: false,
            records: [],
            startDate: null,
            endDate: null,
        })

        onMounted( async()=>{

            if(localStorage.getItem('token')){
                let token = localStorage.getItem('token')
                await fetch(apiHost+"me",{
                    method:'GET',
                    headers:{"Authorization":"Bearer "+token},
                }).then(async response => {
                    const resData = await response.json();
                    try{
                        if(resData.data.id){
                            //Update vuex store
                            await store.dispatch("setAuth", true)

                            if(resData.data.role==1){
                                await store.dispatch("setAdmin", true)   
                            }else{
                                await store.dispatch("setAdmin", false) 
                            }
                        }else{
                            await store.dispatch("setAuth", false)
                            await store.dispatch("setAdmin", false)
                            localStorage.removeItem('vpnConnected');
                        }
                    }catch(err){
                        await store.dispatch("setAuth", false)
                        await store.dispatch("setAdmin", false)
                        localStorage.removeItem('vpnConnected');
                    }
                }).catch(error => {
                    console.log("err")
                    console.log(error)
                })
            }else{
                await store.dispatch("setAuth", false)
            }
            
        })

        const getRecords = async () => {
            let token = localStorage.getItem('token')

            console.log(data.startDate)
            console.log(data.endDate)

            if(!data.startDate || !data.endDate){
                notify({title: "Warning",text: "Please select dates",type:'warn'});
                return false
            }
            
            let query = "?startDate="+data.startDate+"&endDate="+data.endDate
            await fetch(apiHost+"show/login/logger"+query,{
                    method:'GET',
                    headers:{"Authorization":"Bearer "+token},
                }).then(async response => {
                    data.loading = false;
                    const resData = await response.json();
                    console.log(resData.data)
                    try{
                      data.records = resData.data
                      if(resData.data.length==0){
                        notify({title: "Completed",text: "No data found in selected dates.",type:'info'});
                      }
                    }catch(err){
                        console.log(err)
                    }
                }).catch(error => {
                    data.loading = false;
                    console.log("err")
                    console.log(error)

                     notify({title: "Error",text: error,type:'error'});
                })
        }
       
        
        return {
            auth,
            data,
            getRecords,
        }
    }
}
</script>

<style scoped>

</style>