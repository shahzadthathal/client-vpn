<template>
    
    <main class="form-signin">
        <form @submit.prevent="submit">
            <!-- <img class="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"> -->
            <h1 class="h3 mb-3 fw-normal">Sign in</h1>
            
            <div class="form-floating">
                <input v-model="data.username" type="text" class="form-control"  placeholder="Username">
                <label>Username</label>
            </div>

            <div class="form-floating">
                <input v-model="data.password" type="password" class="form-control" placeholder="Password">
                <label>Password</label>
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
    name:'Login',

    setup() {

        const data = reactive({
            username:'',
            password:''
        })
        const router = useRouter()

        const submit = async() => {
            await fetch(apiHost+"login",{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                //credentials:'include',
                body:JSON.stringify(data)
            }).then(async response => {
                    const resData = await response.json();
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (resData && resData.message) || response.status;
                        notify({
                            title: "Error",
                            text: error,
                            type:'error'
                        });
                    }else{

                        let user = resData.data
                        //Save user data
                        localStorage.setItem('token',user.accessToken)
                        localStorage.setItem('username',user.username)

                        notify({
                            title: "Success",
                            text: "Login complete.",
                            type:'success'
                        });
                        await router.push('/')
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