<template>
  <!-- 客服按钮（可拖动） -->
  <div
    class="fixed text-center z-50 cursor-move"
    :style="{right: currentPosition.right + 'px', bottom: currentPosition.bottom + 'px'}"
    @touchstart.prevent="dragStart"
    @touchmove.prevent="dragMove"
    @touchend="dragEnd"
  >
    <img
      class="w-[60px] h-[60px] mx-auto"
      src="@/assets/img/home/ic_kefu.png"
    />
  </div>
</template>

<script>
export default {
  name: "CustomerService",
  props: {
    // 接收位置参数
    position: {
      type: Object,
      default: () => ({
        right: 15,
        bottom: 80
      })
    }
  },
  data() {
    return {
      currentPosition: {
        right: this.position.right,
        bottom: this.position.bottom
      },
      isDragging: false,
      dragStartTime: 0,
      startClientX: 0,
      startClientY: 0
    };
  },
  watch: {
    position: {
      handler(newVal) {
        this.currentPosition.right = newVal.right;
        this.currentPosition.bottom = newVal.bottom;
      },
      deep: true
    }
  },
  mounted() {
    // 如果需要从本地存储恢复位置
    const savedPos = localStorage.getItem('customerServicePos');
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        this.currentPosition = pos;
      } catch (e) {
        console.error('解析客服位置失败', e);
      }
    }
  },
  methods: {
    // 拖动相关方法
    dragStart(event) {
      // 记录触摸起始位置
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      // 记录元素初始位置
      this.startRight = this.currentPosition.right;
      this.startBottom = this.currentPosition.bottom;
      // 记录开始拖动的时间
      this.dragStartTime = new Date().getTime();
      // 标记正在拖动
      this.isDragging = true;
      // 记录初始点击位置，用于判断是否是拖动
      this.startClientX = event.touches[0].clientX;
      this.startClientY = event.touches[0].clientY;
    },

    dragMove(event) {
      // 计算移动距离
      const moveX = this.startX - event.touches[0].clientX;
      const moveY = this.startY - event.touches[0].clientY;

      // 更新位置，注意right值是从右侧计算的，所以增加moveX时right增加
      // bottom值是从底部计算的，增加moveY时bottom增加
      this.currentPosition.right = this.startRight + moveX;
      this.currentPosition.bottom = this.startBottom + moveY;

      // 边界检查，防止拖出屏幕
      const minRight = 0;
      const maxRight = window.innerWidth - 60; // 假设按钮宽度约为60px
      const minBottom = 0;
      const maxBottom = window.innerHeight - 60; // 假设按钮高度约为60px

      if (this.currentPosition.right < minRight) this.currentPosition.right = minRight;
      if (this.currentPosition.right > maxRight) this.currentPosition.right = maxRight;
      if (this.currentPosition.bottom < minBottom) this.currentPosition.bottom = minBottom;
      if (this.currentPosition.bottom > maxBottom) this.currentPosition.bottom = maxBottom;
    },

    dragEnd(event) {
      // 判断是否是点击而非拖动
      const dragEndTime = new Date().getTime();
      const dragDuration = dragEndTime - this.dragStartTime;

      // 判断移动距离
      const moveDistance = Math.sqrt(
        Math.pow(this.startClientX - (event.changedTouches ? event.changedTouches[0].clientX : this.startClientX), 2) +
        Math.pow(this.startClientY - (event.changedTouches ? event.changedTouches[0].clientY : this.startClientY), 2)
      );

      // 如果拖动时间小于200毫秒且移动距离小于10像素，则认为是点击
      if (dragDuration < 200 && moveDistance < 10) {
        this.$emit('contact');
      }

      // 重置拖动状态
      this.isDragging = false;

      // 保存位置，以便页面刷新后恢复
      localStorage.setItem('customerServicePos', JSON.stringify(this.currentPosition));
    }
  }
};
</script>

<style scoped>
/* 悬浮效果 */
img {
  transition: transform 0.2s;
}
img:active {
  transform: scale(0.95);
}
</style> 