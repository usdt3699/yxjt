<template>
  <div class="h-screen">
    <router-view />
    <Nav></Nav>
  </div>
</template>
<script>
import Nav from "@/components/Nav";
export default {
  name: "index",
  components: { Nav },
};
</script>

<style scoped>
.page-container {
}
</style>
