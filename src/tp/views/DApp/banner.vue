<template>
  <div class="home-banner container-layout">

    <el-carousel :interval="5000">
      <el-carousel-item
        v-for="(item, index) in bannerList"
        :key="index"
        indicator-position="outside"
        style="text-align: center">
        <el-image class="img-url pointer"
                  fit="fill"
                  :src="item.img_url"
                  :alt="item.title"
                  @click.native="goImgDetail(item)"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ElectronHelpers from '../../../util/ElectronHelpers'

export default {
  name: 'home-banner',
  props: {
    bannerList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      carouselHeight: 170
    }
  },
  computed: {
    ...mapGetters(['language',])

  },
  watch: {
    async language () {
      // this.$store.dispatch('GET_BANNER_LIST')
    },
    // clientWidth () {
    //   setTimeout(() => {
    //     this.imgChangeSize()
    //   }, 200)
    // }
  },
  methods: {
    goImgDetail (item) {
      ElectronHelpers.openLinkInBrowser(item.object.url)
    },

    // imgChangeSize () {
    //   if (process.client) {
    //     const imgList = this.$el.querySelectorAll('.el-carousel__item img')
    //     // let height = 0
    //     for (let value in imgList) {
    //       if (imgList[value].clientWidth && imgList[value].style) {
    //         imgList[value].style.height = imgList[value].clientWidth / 2.16 + 'px'
    //         this.carouselHeight = imgList[value].clientWidth / 2.16
    //       }
    //     }
    //   }
    // }
  },

  mounted () {
    // setTimeout(() => {
      // this.imgChangeSize()
    // }, 1000)
  }
}
</script>

<style lang="scss" scoped>
  .home-banner {
    padding: 15px ;
  }

  .img-url {
    width: 100%;
    border-radius: 8px;
  }
</style>
