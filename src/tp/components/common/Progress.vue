<template>
    <div class="tp-percentage">
        <div class="tp-percentage-main">
            <svg :width="width" :viewBox="viewBox">
                <defs>
                    <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient1">
                        <stop offset="0%" stop-color="#53B7FF"></stop>
                        <stop offset="100%" stop-color="#2980FE"></stop>
                    </linearGradient>

                    <!--<linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient2">-->
                        <!--<stop offset="0%" stop-color="#4352f3"></stop>-->
                        <!--<stop offset="100%" stop-color="#ab5aea"></stop>-->
                    <!--</linearGradient>-->
                </defs>

                <g :transform="matrix">
                    <circle :cx="cxWidth"
                            :cy="cyWidth"
                            :r="rWidth"
                            :stroke-width="strokeWidth"
                            stroke="#f0f1f5"
                            fill="none"
                            :stroke-dasharray="strokeDasharray">
                    </circle>

                    <circle :cx="cxWidth"
                            :cy="cyWidth"
                            :r="rWidth"
                            :stroke-width="strokeWidth"
                            stroke="url('#gradient1')"
                            fill="none"
                            :stroke-dasharray="`${percentageAbove50} ${perimeter}`">
                    </circle>

                    <!--<circle :cx="cxWidth"-->
                            <!--:cy="cyWidth"-->
                            <!--:r="rWidth"-->
                            <!--:stroke-width="strokeWidth"-->
                            <!--stroke="url('#gradient2')"-->
                            <!--fill="none"-->
                            <!--:stroke-dasharray="`${percentageLess50} ${perimeter}`">-->
                    <!--</circle>-->
                </g>
            </svg>

            <span class="tp-percentage-content">
                <div>{{percentage}}%</div>
                <slot></slot>
            </span>
        </div>

    </div>
</template>

<script>
  export default {
    props: {
      percentage: {
        type: [Number, String],
        default: 100
      },
      width: {
        type: Number,
        default: 100
      },
      strokeWidth: {
        type: Number,
        default: 10
      },
      text: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },

    computed: {
      cxWidth() {
        return this.width
      },

      cyWidth() {
        return this.width
      },

      rWidth() {
        return this.width - this.strokeWidth
      },

      perimeter() {
        return Math.round(Math.PI * 2 * this.rWidth)
      },

      strokeDasharray() {
        return `${this.perimeter} ${this.perimeter}`
      },

      percentageEqual() {
        return this.perimeter / 100
      },

      percentageAbove50() {
        return this.percentageEqual * this.percentage
      },

      percentageLess50() {
        return this.percentageEqual * (this.percentage / 2)
      },


      viewBox() {
        return `0 0 ${this.width * 2} ${this.width * 2}`
      },

      matrix() {
        return `matrix(0,-1,1,0,0,${this.width * 2})`
      }
    }
  }

</script>

<style scoped>
    svg {
        transform: rotate(-0.05deg);
    }

    circle {
        transition: stroke-dasharray .3s;
    }

    .tp-percentage {
        display: inline-block;
        text-align: center;
    }

    .tp-percentage-main {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .tp-percentage-content {
        position: absolute;
        text-align: center;
    }
</style>
