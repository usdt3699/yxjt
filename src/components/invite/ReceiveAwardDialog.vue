<template>

</template>

<script>

import axios from "@/net/axios";
import api from "@/net/api";
import {Popup} from "vant";


export default {
  components: {Popup},
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {

    };
  },
  mounted: function () {
    // this.getNewsList();
  },
  methods: {
    closeDialog() {
     this.$emit("close:dialog", false);
    },
    jumpTo(name) {
      this.$router.push({name})
    },
    jumpToPage(id) {
      this.$router.push({
        name: 'newsDetails',
        params: {
          id
        }
      })
    },
    getNewsList: function () {
      axios
          .post(api.newsList, {
                pageNo: 1,
                pageSize: 5,
              }
          )
          .then((res) => {
            this.newsList = res.data;
          })
          .catch((err) => {
            err.msg && this.$toast(err.msg);
          });
    },
  },
};
</script>
<style scoped lang="less">
</style>
