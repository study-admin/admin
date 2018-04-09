
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
                            <Input v-model="searchConName" icon="search" @on-click='search' placeholder="关键词，标题" style="width: 200px" />
                        </Row>

                    </div>
                    <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                        <Table border :columns="orderColumns" :data="orderData"></Table>
                    </Row>

                    <div class="clearfix" style="height:80px;">
                       <Page :total=total class="fr padding-top-10" @on-change='changePage'></Page>
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
                                            this.remove(params.row.id)
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
            total:0,//总条数
            current:1,//当前页码
            pageSize:10,//每页显示数量
            pay_type:['选择题','填空题','判断题','简答题'],
            option:'',//对应当前题型参数
            type:this.$route.query.path
        };
    },
    watch:{
        list(){
            this.orderData = this.list.data;
            this.total = this.list.meta.pagination.total;
            console.log(this.orderData,this.list.meta.pagination,this.total);
            
        },
        $route(){
            this.model1 = '';
        }
    },
    computed: {
        list(){
            return this.$store.state.app.list
        },
    },
    methods:{
        remove(id){
            console.log(id);
            this.GLOBAL.tokenRequest({
                method:'delete',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question/'+id
            }).then(({data:data})=>{
                this.$Message.success('删除成功');
                this.getList()
            })
        },
        getList(){
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param:{
                    type:this.$route.query.path,
                    page:this.current,
                    page_count:this.pageSize,
                }
            }).then(({data:data})=>{
                 this.$store.commit('setList', data);
            })
        },
        getOptionList(){
            this.GLOBAL.tokenRequest({//根据选择的题型拉数据
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param:{
                    type:this.$route.query.path,
                    page:this.current,
                    page_count:this.pageSize,
                    option:this.option,
                }
            }).then(({data:data})=>{
                 this.$store.commit('setList', data);
            })
        },
        selectDif(val){
            switch (val) {
                case "选择题":
                    this.option = 'choice';
                    break;
                case "填空题":
                    this.option = 'blank'
                    break;
                case "判断题":
                    this.option = 'check';
                    break;
                case "简答题":
                    this.option = 'answer';
                    break;
                default:
                    break;
            }
            this.getOptionList()
        },
        changePage(val){  //切换页码时
            this.current = val
            if (this.model1 !='') {
                this.getOptionList()
            }else{
                this.getList()
            }
        },
        search(){
            this.GLOBAL.tokenRequest({//根据选择的题型拉数据
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param:{
                    type:this.$route.query.path,
                    page:this.current,
                    page_count:this.pageSize,
                    option:this.option,
                    keyword:this.searchConName
                }
            }).then(({data:data})=>{
                 this.$store.commit('setList', data);
            })
        }
    },
    mounted(){
        this.model1 = '';
        // if (this.option !='') {
        //     this.getOptionList();
        // }else{
        //     this.getList()
        // }
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
            this.$store.commit('setList', data);
        })
        this.orderData = this.list.data;
        
    }
};
</script>
