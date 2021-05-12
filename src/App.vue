<template>

  <Nav/>

  
  <router-view/>

  <notifications position=" center"/>

 
</template>

<script>
import Nav from "@/components/Nav"

export default {
  components: {Nav}
}

</script>

<style>

</style>
