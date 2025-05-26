<template>
  <div class="relative">
    <!-- 生成的邀请卡片 -->
    <invite-card-generator
      :code="code"
      :url="url"
      :invite-count="inviteCount"
      @card-generated="onCardGenerated"
    />

    <!-- 按钮组浮层 -->
    <div v-if="isCardGenerated" class="absolute inset-0 flex">
      <div class="flex-1 flex items-center justify-end pr-8">
        <div class="space-y-3 mt-6">
          <div
            class="bg-[#4cd964] rounded-[22px] py-2 px-8 flex items-center justify-center cursor-pointer"
            @click="onCopy(code)"
          >
            <span class="text-white text-sm whitespace-nowrap">复制邀请码</span>
          </div>
          <div
            class="bg-[#ff3b30] rounded-[22px] py-2 px-8 flex items-center justify-center cursor-pointer"
            @click="onCopy(url)"
          >
            <span class="text-white text-sm whitespace-nowrap">复制推广链接</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InviteCardGenerator from './InviteCardGenerator.vue'

export default {
  name: "InviteQrCode",

  components: {
    InviteCardGenerator
  },

  data() {
    return {
      isCardGenerated: false
    }
  },

  props: {
    code: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    inviteCount: {
      type: Number,
      default: 0
    }
  },

  methods: {
    onCardGenerated(imageUrl) {
      this.isCardGenerated = true;
    },

    onCopy(text) {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$toast("复制成功！");
    },
  },
};
</script>
