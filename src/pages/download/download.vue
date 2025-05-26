<template>
  <div class="min-h-screen w-full relative">
    <!-- 背景图 -->
    <img src="@/assets/img/download/bg_download_page.png" class="fixed top-0 left-0 w-full h-full object-cover z-0"/>

    <!-- 主内容区域 -->
    <div class="relative z-10">
      <!-- 顶部标题栏 -->
      <div class="px-4 pt-4 pb-4 flex items-center">
        <!-- 返回箭头 -->
        <div
          class="w-8 h-8 flex items-center cursor-pointer"
          @click="$router.go(-1)"
        >
          <van-icon name="arrow-left" class="text-black text-xl" />
        </div>

        <!-- 居中的标题 -->
        <div class="flex-1 text-center">
          <div class="text-black text-xl font-medium">下载APP</div>
        </div>

        <!-- 占位 -->
        <div class="w-8"></div>
      </div>

      <!-- APP Logo -->
      <div class="flex flex-col items-center mt-12">
        <img src="@/assets/img/login/logo.png" class="w-24 h-24 rounded-[24px] "/>
        <div class="text-xl font-medium mt-6">下载智天集体APP</div>
        <div class="text-black  mt-2">振兴中华 不忘初心 牢记使命</div>
      </div>

      <!-- 下载按钮区域 -->
      <div class="px-8 mt-16">
        <!-- iOS下载按钮 -->
        <div
          class="h-[56px] bg-black rounded-lg flex items-center justify-center px-6 mb-4 cursor-pointer"
          @click="handleDownload('ios')"
        >
          <div class="flex items-center">
            <img src="@/assets/img/download/icon_apple.png" class="w-6 h-6"/>
            <span class="text-white text-lg ml-4">iPhone版本</span>
          </div>
        </div>

        <!-- Android下载按钮 -->
        <div
          class="h-[56px] bg-[#0088FF] rounded-lg flex items-center justify-center px-6 cursor-pointer"
          @click="handleDownload('android')"
        >
          <div class="flex items-center">
            <img src="@/assets/img/download/icon_android.png" class="w-6 h-6"/>
            <span class="text-white text-lg ml-4">Android版本</span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'download',
  methods: {
    handleDownload(type) {
      const urls = {
        ios: 'iOS下载链接',  // 替换为实际的iOS下载链接
        android: 'Android下载链接'  // 替换为实际的Android下载链接
      }
      window.location.href = urls[type]
    }
  }
}
</script>

<style scoped>
/* 可以添加需要的自定义样式 */
</style>
