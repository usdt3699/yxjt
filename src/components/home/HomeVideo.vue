<template>
  <div class="w-full video-container">
    <video
      ref="videoPlayer"
      controls
      muted
      playsinline
      :poster="posterImage"
      @loadedmetadata="handleMetadata"
      class="video"
      src='https://temu-temugrouphou.oss-cn-beijing.aliyuncs.com/files/ecb384e9d823d9f4cc5527421a96c650.mp4'
    ></video>
  </div>
</template>

<script>

import defaultPoster from "@/assets/img/poster.png";

export default {
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

      videoHeight: 0,
    };
  },
  computed: {

    posterImage() {
      return this.img || defaultPoster;
    }
  },
  methods: {
    handleMetadata() {
      const videoPlayer = this.$refs.videoPlayer;
      const videoRatio = videoPlayer.videoWidth / videoPlayer.videoHeight;
      this.videoHeight = this.$el.offsetWidth / videoRatio;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleMetadata);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleMetadata);
  },
};
</script>

<style scoped lang="less">
.video-container {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
}
.video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}
</style>
