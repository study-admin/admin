
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

                        <Select class='fl margin-right-10' @on-change="selectDif" v-model="model1" style="width:100px" placeholder='选择类型'>
                            <Option v-for="item in menuList" :value="item.name" :key="item.id">{{ item.name}}</Option>
                        </Select>
                        <Row class='fl margin-right-10'>
                            <Input v-model="searchConName" icon="search" @on-enter='search' @on-click='search' placeholder="编号／标题" style="width: 200px" />
                        </Row>
                    </div>
                    <div>
                        <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                            <Table border :columns="orderColumns" :data="orderData"></Table>
                        </Row>
                        <div class="clearfix">
                            <Page :total=total class="fr padding-top-10" @on-change='changePage'></Page>
                        </div>
                    </div>
                    <!-- <div v-else style="text-align:center; font-size:26px;">
                        选择类别展示对应试卷
                    </div> -->
                </Card>
                <Modal
                    v-model="model2"
                    title="试卷修改"
                    @on-ok="ok"
                    @on-cancel="cancel">
                    <h3>修改标题<Input v-model="newTitle"></Input></h3>
                    <h3>修改编号<Input v-model="newNo"></Input></h3>                    
                </Modal>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'mutative-router',
    data () {
        return {
            model2:false,
            newTitle:'',
            newNo:'',
            orderColumns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'no',
                    align: 'center'
                },
                {
                    title: '试卷标题',
                    key: 'title',
                    align: 'center',
                    render:(h,params)=>{
                        return h('div',{
                            style: {
                                display: 'flex'
                            },
                            domProps: {
                                     innerHTML: params.row.title
                                },
                        })
                    }
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
                    width:300,
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
                                            this.go(params.row.id)
                                        }
                                    }
                                }, '变更'),
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
                                            this.change(params.row)
                                        }
                                    }
                                }, '修改'),
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
                                            this.show(params.row.id)
                                        }
                                    }
                                }, '试卷'),
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
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '答案卷'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row.id)
                                        }
                                    }
                                }, '删除')
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
            changeId:'',
            oldTitel:'',
            oldNo:'',
        };
    },
    computed: {

    },
    methods:{
        go(id){
            this.$router.push({path:'paper',query:{path:2,pid:id}})
        },
        ok () {
            if (this.oldTitel !=this.newTitle) {
                this.changePaper('title',this.newTitle)
            }
            if (this.oldNo !=this.newNo) {
                this.changePaper('no',this.newNo)
            }
        },
        changePaper(key,value){
            this.GLOBAL.tokenRequest({
                method:'put',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/public/'+this.changeId,
                data:{
                    table:'paper',
                    data:JSON.stringify({
                        key,
                        value,
                    })
                }
            }).then(({data:data})=>{
                if (data) {
                    this.$Message.success('修改成功')
                    this.model2 = false;
                    this.selectDif(this.model1)
                }else{
                    this.$Message.error('修改失败')
                }
            })
        },
        cancel () {
            this.$Message.info('取消修改');
        },
        change(item){
            this.model2 = true;
            this.newNo = item.no;
            this.newTitle = item.title;
            this.changeId = item.id;
            this.oldTitel = item.title;
            this.oldNo = item.no;
        },
        delete(id){
            this.GLOBAL.tokenRequest({
                method:'delete',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper/'+id
            }).then(({data:data})=>{
                if (data == '') {
                    this.$Message.success('试卷删除成功')
                    this.selectDif(this.model1)
                }
            })
        },
        show(id){//试卷
            this.$router.push({path:'/pi',query:{id,is:0}})
        },
        remove(id){//答案卷
            this.$router.push({path:'/pi',query:{id,is:1}})
        },
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
        search(){
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper',
                param:{
                    type:this.type,
                    page_count:10,
                    keyword:this.searchConName
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
            // this.model1 = data.data[0].name
        })
    }
};
</script>
