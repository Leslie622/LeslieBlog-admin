<template>
  <div class="echart-wrapper">
    <div ref="echartMapRef" class="echart-map"></div>
    <div class="echart-change" @click="echartOptionChange">切换成{{ isMapOption ? '地图' : '图表' }}</div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import apiDataOverview from '@/api/modules/dataOverview'

const echartMapRef = ref(null) //echartMap容器ref
const chinaJson = ref() //地图json
//地图数据
const echartMapData = ref([
  { name: '北京市', value: 4822023 },
  { name: '天津市', value: 731449 },
  { name: '河北省', value: 6553255 },
  { name: '山西省', value: 2949131 },
  { name: '内蒙古', value: 38041430 },
  { name: '辽宁省', value: 5187582 },
  { name: '吉林省', value: 3590347 },
  { name: '黑龙江省', value: 917092 },
  { name: '上海市', value: 632323 },
  { name: '江苏省', value: 19317568 },
  { name: '浙江省', value: 9919945 },
  { name: '安徽省', value: 1392313 },
  { name: '福建省', value: 1595728 },
  { name: '江西省', value: 12875255 },
  { name: '山东省', value: 6537334 },
  { name: '河南省', value: 3074186 },
  { name: '湖北省', value: 2885905 },
  { name: '湖南省', value: 4380415 },
  { name: '广东省', value: 4601893 },
  { name: '广西', value: 1329192 },
  { name: '海南省', value: 5884563 },
  { name: '重庆市', value: 6646144 },
  { name: '四川省', value: 9883360 },
  { name: '贵州省', value: 5379139 },
  { name: '云南省', value: 2984926 },
  { name: '西藏', value: 6021988 },
  { name: '陕西省', value: 1005141 },
  { name: '甘肃省', value: 1855525 },
  { name: '青海省', value: 2758931 },
  { name: '宁夏', value: 1320718 },
  { name: '新疆', value: 8864590 },
  { name: '台湾省', value: 2085538 },
  { name: '香港', value: 19570261 },
  { name: '澳门', value: 9752073 }
])
//echartMap实例
let echartMap: any
//echartMap配置
const echartMapOptions = computed(() => {
  return {
    mapOption: {
      visualMap: {
        left: 'right',
        min: 0,
        max: 20,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text: ['High', 'Low'],
        calculable: true
      },
      series: [
        {
          id: 'population',
          type: 'map',
          roam: true,
          map: 'CN',
          animationDurationUpdate: 600,
          universalTransition: true,
          data: echartMapData.value
        }
      ]
    },
    barOption: {
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          interval: 0
        },
        data: echartMapData.value.map(function (item) {
          return item.name
        })
      },
      animationDurationUpdate: 600,
      series: {
        type: 'bar',
        id: 'population',
        label: {
          show: true,
          position: 'right'
        },
        data: echartMapData.value.map(function (item) {
          return {
            value: item.value
          }
        }),
        universalTransition: true
      }
    }
  }
})
//echartMap默认配置
const isMapOption = ref<boolean>(true)

onMounted(() => {
  getCNJson()
})

onUnmounted(() => {
  //组件销毁后销毁echartMap实例
  echartMap.dispose()
  console.log(echartMap.isDisposed())
})

/* 获取中国地图json */
async function getCNJson() {
  //获取到地图之前开启loading
  echartMap = echarts.init(echartMapRef.value)
  echartMap.showLoading()
  //获取地图
  const res = await apiDataOverview.getCNMapJson()
  chinaJson.value = res.data.chinaJson
  //随后获取游客地址数据
  getVisitorLocation()
}

/* 获取mapdata */
async function getVisitorLocation() {
  const res = await apiDataOverview.getVisitorLocation()
  echartMapData.value = res.data
  //获取游客地址数据成功后开始渲染echart
  echartMap.hideLoading()
  echartInit()
}

/* 渲染echart */
function echartInit() {
  echarts.registerMap('CN', chinaJson.value, {
    海南省: {
      left: 135,
      top: 20,
      width: 10
    }
  })
  echartOptionChange()
}

/* 切换echart配置 */
function echartOptionChange() {
  if (isMapOption.value) {
    echartMap.setOption(echartMapOptions.value.mapOption, true)
  } else {
    echartMap.setOption(echartMapOptions.value.barOption, true)
  }
  isMapOption.value = !isMapOption.value
}
</script>

<style lang="scss" scoped>
.echart-wrapper {
  position: relative;
  height: 100%;
}

.echart-map {
  height: 100%;
}

.echart-change {
  position: absolute;
  top: 0;
  right: 80px;
  padding: 8px;
  font-size: 12px;
  border-radius: 5px;
  border: 2px solid black;
  cursor: pointer;
}
</style>
