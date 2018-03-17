
<!-- 试卷制定 -->
<style lang="less">

    @import '../../../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
</style>

<template>

    <Card>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
            <Input v-model="titleName" placeholder="输入试题标题..." style="width: 300px"></Input>

        </div>
        <div>
            <Select v-model="model1" style="width:200px" class='margin-right-10'>
                <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="model2" style="width:200px" class='margin-right-10'>
                <Option v-for="item in cityList2" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="model3" style="width:200px">
                <Option v-for="item in cityList3" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Input v-model="searchConName" icon="search" @on-click="screenOrder" placeholder="搜索..." style="width: 200px" />
            <Checkbox v-model="single" @on-change='chang'>Checkbox</Checkbox>
        </div>
        <div class="clearfix">
            <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                <Table border :columns="orderColumns" :data="orderData"></Table>
            </Row>
            <div class="clearfix">
                <Page :total="100" class='fr padding-top-10'></Page>
            </div>
        </div>
    </Card>

</template>

<script>
import E from 'wangeditor'
export default {
    name: 'aaaa',
    data () {
        return {
            single:false,
            titleName:'',
            cityList: ['电力类','变电类','通用类'],
            cityList2: ['选择题','填空题','判断题'],
            cityList3: ['难','中等','简单'],
            model1: '电力类',
            model2: '选择题',
            model3: '难',
            searchConName:'',
            orderColumns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '试卷标题',
                    key: 'goodsNo',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'difficulty',
                    align: 'center'
                },

                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    render: (h, params) => {
                            return h('div', [
                                h('Checkbox', {
                                    props: {
                                        value:params.row.single
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        onChange: () => {
                                            this.btn(params.index)
                                        }
                                    }
                                }),

                            ])
                    }
                }
            ],

            orderData: [
                {
                    goodsNo: '国际标准说明',
                    difficulty:'中等',
                    single: true,

                },
                {
                    goodsNo: '国际标准说明',
                    difficulty:'中等',
                    single: false,

                },
                {
                    goodsNo: '国际标准说明',
                    difficulty:'中等',
                    single: false,

                },
                {
                    goodsNo: '国际标准说明',
                    difficulty:'中等',
                    single: false,

                },


            ],

        };
    },
    computed: {

    },
    methods:{
        screenOrder(){ //点击搜索


        },
        btn(val){
            console.log(val)

        },
        chang(val){
            console.log(val)

        }
    },
    mounted() {

      }
};
</script>
