<template>
    <main class="form-signin">
        <form @submit.prevent="submit">
            <!-- <img class="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"> -->
            <h1 class="h3 mb-3 fw-normal">Register</h1>
            
            <div class="form-floating">
                <input v-model="data.username" type="text" class="form-control"  placeholder="Username">
                <label>Username</label>
            </div>

            <div class="form-floating">
                <input v-model="data.password" type="password" class="form-control" placeholder="Password">
                <label>Password</label>
            </div>

            <div class="form-floating">
                <input v-model="data.confirm_password" type="password" class="form-control" placeholder="Password">
                <label>Confirm Password</label>
            </div>

            <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
        </form>
    </main>
</template>

<script lang="ts">
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import { notify } from "@kyvg/vue3-notification";
import {apiHost} from '../config'

export default{
    name:'Register',
    setup() {

        const data = reactive({
            username:'',
            password:'',
            confirm_password:''
        })

        const router = useRouter()

        const submit = async() => {
            await fetch(apiHost+"register",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            }).then(async response => {
                    const resData = await response.json();
                    if (!response.ok) {
                        // get error message from body or default to response status
                        let error = (resData && resData.message) || '';
                        if(resData.errors){
                            resData.errors.forEach(element => {
                                console.log(element)
                                error += element.msg +"<br>"
                            });
                        }
                        notify({
                            title: "Error",
                            text: error,
                            type:'error'
                        });

                    }else{
                        notify({
                            title: "Success",
                            text: "Registeration complete.",
                            type:'success'
                        });
                        await router.push('/login')
                    }

            }).catch(error => { 
                notify({
                    title: "Error",
                    text: error,
                    type:'error'
                }); 
            });
        }

        return {
            data,
            submit
        }
    }
}
</script>

<style scoped>

</style>