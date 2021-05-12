<template>

    <main class="form-signin">
        <div v-if="auth">
            
            <div class="d-flex justify-content-center">
            
                <button :class="data.btnClass" type="button" @click="startVpn">
                    {{data.btnText}}
                    <span v-if="data.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
            </div>

            <div class="d-flex justify-content-center mt-5" v-if="data.connected">
                <button type="button" class="btn btn-primary circle-btn m-2">Facebook</button>
                <button type="button" class="btn btn-danger circle-btn m-2">Google</button>
                <button type="button" class="btn btn-info circle-btn m-2">Twitter</button>
            </div>

        </div>
    </main>

</template>

<script lang="ts">

import {onMounted, reactive, computed} from 'vue'
import {useStore} from 'vuex'

import {apiHost} from '../config'

export default{
    name:'Home',
    setup() {
        const store = useStore()
        
        const auth = computed( () => store.state.authenticated)

        const data = reactive({
            loading: false,
            connected: false,
            btnText: 'Start VPN',
            btnClass: "btn btn-primary circle-btn"
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
                localStorage.removeItem('vpnConnected');
            }

            if(localStorage.getItem('vpnConnected')=='1'){
             
                data.loading = false;
                data.connected = true;
                data.btnText = 'Connected';
                data.btnClass ="btn btn-success circle-btn" 
            }
        })
       
        const startVpn = async () => {
            
            if(data.connected){
                return false;
            }

            data.loading = true;
            setTimeout(function(){
                data.loading = false;
                data.connected = true;
                data.btnText = 'Connected';
                data.btnClass ="btn btn-success circle-btn" 
                
                localStorage.setItem("vpnConnected",'1')

            },2000)
        }
        return {
            auth,
            data,
            startVpn,
        }
    }
}
</script>

<style scoped>
.circle-btn{
    border-radius: 50%;
    height: 110px;
    width: 110px;
    min-width: 110px;
}
</style>