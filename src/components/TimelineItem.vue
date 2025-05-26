<template>
  <div class="flex">
    <div class="relative flex-shrink-0 w-6 mr-4">
      <div :class="['absolute top-0 left-0 w-4 h-4 rounded-full z-10', active ? 'bg-primary' : 'bg-gray-300']"></div>
    </div>
    <div class="flex-1 -mt-1">
<!--      <div class="text-sm text-gray-500">{{ date }}</div>-->
      <div class="font-semibold text-gray-700">{{ title }}</div>
      <div class="text-sm text-gray-600">{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimelineItem",
  props: ['date', 'title', 'description', 'active'],
}
</script>

<style scoped>

</style>
