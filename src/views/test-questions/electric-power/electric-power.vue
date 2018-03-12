
<!-- 商品列表 -->
<style lang="less">
    // @import '@/styles/common.less';
    // @import './orderManagement.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div class="margin-bottom-10 clearfix">
                        <div class="fl margin-right-10">
                            <span class="fl" style='line-height:32px;'>

                            题型分类：</span>
                            <Select class='fl margin-right-10' v-model="model1" style="width:100px" placeholder='选择类型'>
                                <Option v-for="item in pay_type" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </div>
                        <Row class='fl margin-right-10'>
                            <Input v-model="searchConName" icon="search" @on-click='' placeholder="..." style="width: 200px" />
                        </Row>

                    </div>
                    <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                        <Table border :columns="orderColumns" :data="orderData"></Table>
                    </Row>

                    <div class="clearfix">

                       <!--  <Page :total=total size="small" class='fr margin-top-20' show-elevator show-sizer show-total
                        @on-change = 'changePage' @on-page-size-change='changePageSize' placement='top'></Page> -->
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'mutative-router',
    data () {
        return {
            orderColumns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '题目',
                    key: 'goodsNo',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'brandName',
                    align: 'center'
                },
                {
                    title: '上传时间',
                    key: 'salePrice',
                    align: 'center'
                },

                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.show(params.index)
                                            this.show(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ])
                    }
                }
            ],

            orderData: [
                {
                    goodsNo: '国际标准说明',
                    brandName:'中等',
                    salePrice: '2018-02-06',

                },
                {
                    goodsNo: '国际标准说明',
                    brandName:'中等',
                    salePrice: '2018-02-06',

                },
                {
                    goodsNo: '国际标准说明',
                    brandName:'中等',
                    salePrice: '2018-02-06',

                },
                {
                    goodsNo: '国际标准说明',
                    brandName:'中等',
                    salePrice: '2018-02-06',

                },


            ],
            searchConName:'',
            model1:'',
            pay_type:[
                '判断题','选择题','填空题'
            ],
            total:0,//总页数
            current:1,//当前页码
            pageSize:10,//每页数量
        };
    },
    computed: {

    },
    methods:{

    },
    mounted(){

    }
};
</script>
