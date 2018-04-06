
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

                        <!-- <Row class='fl margin-right-10'>
                            <Input v-model="searchConName" icon="search" @on-click='' placeholder="..." style="width: 200px" />
                        </Row> -->
                        <Select class='fl margin-right-10' @on-change="selectDif" v-model="model1" style="width:100px" placeholder='选择类型'>
                            <Option v-for="item in menuList" :value="item.name" :key="item.id">{{ item.name}}</Option>
                        </Select>
                    </div>
                    <div v-if="model1">
                        <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                            <Table border :columns="orderColumns" :data="orderData"></Table>
                        </Row>
                        <div class="clearfix">
                            <Page :total=total class="fr padding-top-10" @on-change='changePage'></Page>
                        </div>
                    </div>
                    <div v-else style="text-align:center; font-size:26px;">
                        选择类别展示对应试卷
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
                    titel:'编号',
                    key:'no',
                    align: 'center'
                },
                {
                    title: '试卷标题',
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '生成时间',
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
                                }, '试卷'),
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
                                }, '答案卷')
                            ])
                    }
                }
            ],

            orderData: [

            ],
            searchConName:'',
            model1:'',
            type:'',//拉取试题的参数
            menuList:[],
            total:0,//总页数
            current:1,//当前页码
            pageSize:10,//每页显示数量
        };
    },
    computed: {

    },
    methods:{
        changePage(val){  //切换页码时
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper',
                param:{
                    type:this.type,
                    page:val,
                    page_count:10,
                }
            }).then(({data:data})=>{
                console.log(data);
                this.orderData = data.data;
                this.total = data.meta.pagination.total;
            })
        },
        selectDif(val){
            this.type = this.menuList.filter((item)=>item.name==val)[0].id
            console.log(this.type);
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper',
                param:{
                    type:this.type,
                    page_count:10,
                }
            }).then(({data:data})=>{
                console.log(data);
                this.orderData = data.data;
                this.total = data.meta.pagination.total;
            })
        }
    },
    mounted(){
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/type',
        }).then(({data:data})=>{
            console.log(data.data);
            this.menuList = data.data;
        })
    }
};
</script>
