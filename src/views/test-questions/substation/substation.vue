
<!-- 商品列表 -->
<style lang="less">
    // @import '@/styles/common.less';
    // @import './orderManagement.less';
    @import '../../../styles/common.less';
</style>

<template>
    <div style="width:1000px;">
        <Row>
            <Col span="24">
                <Card>
                    <div class="margin-bottom-10 clearfix">
                        <div class="fl margin-right-10">
                            <span class="fl" style='line-height:32px;'>

                            题型分类：</span>
                            <Select class='fl margin-right-10' @on-change="selectDif" v-model="model1" style="width:100px" placeholder='选择类型'>
                                <Option v-for="item in pay_type" :value="item" :key="item">{{ item}}</Option>
                            </Select>
                        </div>
                        <Row class='fl margin-right-10'>
                            <Input v-model="searchConName" icon="search" @on-click='' placeholder="关键词，标题" style="width: 200px" />
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
    props:['list'],
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
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'difficulty',
                    align: 'center'
                },
                {
                    title: '上传时间',
                    key: 'created_at',
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

            orderData: [],
            searchConName:'',
            model1:'',
            total:0,//总页数
            current:1,//当前页码
            pageSize:10,//每页数量
            pay_type:['选择题','填空题','判断题','简答题'],
        };
    },
    watch:{
        list(){
            this.orderData = this.list.data;
            console.log(this.orderData);
            
        }
    },
    computed: {
        
    },
    methods:{
        selectDif(val){
            switch (val) {
                case "选择题":
                    let choice;
                    break;
                case "填空题":
                    let blank;
                    break;
                case "判断题":
                    let check;
                    break;
                case "简答题":
                    let answer;
                    break;
                default:
                    break;
            }
        }
    },
    mounted(){
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/question',
            param:{
                type:this.$route.query.path,
                page:1,
                page_count:15
            }
        }).then(({data:data})=>{
            // console.log(data);
            this.list = data
        })
    }
};
</script>
