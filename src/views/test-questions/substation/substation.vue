
<!-- 商品列表 -->
<style lang="less">
    @import '../../../styles/common.less';
    .complimentary-t{
        width: 100px;
        text-align:right;
        line-height: 32px;
    }
    .w-e-text-container{
        height: 150px !important;
    }
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
                            <Input v-model="searchConName" icon="search" @on-enter='search' @on-click='search' placeholder="编号，标题" style="width: 200px" />
                        </Row>

                    </div>
                    <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                        <Table border :columns="orderColumns" :data="orderData"></Table>
                        <!-- <Spin size="large" fix v-if =canShow></Spin> -->
                    </Row>
                    <Modal
                        v-model="modal1"
                        title="修改"
                        @on-ok="ok"
                        width = '800px'
                        @on-cancel="cancel">
                        <div>
                            <div class="margin-bottom-10 clearfix">
                                <h3 class="fl" style='padding-top:5px;'>试题编号：</h3>
                                <Input style="width:200px" @on-blur = 'changeNo' v-model="no" class="margin-right-10"></Input>
                            </div>
                            <div class="padding-top-10">
                                <h3 class="fl" style='padding-top:5px;'>试题难度：</h3>
                                <!-- <Input v-model="value1" placeholder="..." style="width: 300px"></Input> -->
                                <Select v-model="value3" @on-change = 'changeDiff' style="width:200px">
                                    <Option v-for="item in cityList3" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                        </div>
                    </Modal>
                    <div class="clearfix" style="height:80px;">
                       <Page :total=total class="fr padding-top-10" @on-change='changePage'></Page>
                    </div>
                    <Modal
                        v-model="modal8"
                        title="删除试题"
                        @on-ok="okDel"
                        @on-cancel="cancelDel">
                        <p>确定删除该试题吗</p>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import E from 'wangeditor'
import VueImgInputer from 'vue-img-inputer'
export default {
    name: 'mutative-router',
    components: {
        VueImgInputer
    },
    data () {
        return {
            modal8:false,
            canShow:true,
            orderColumns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '题目',
                    key: 'title',
                    align: 'center',
                    width:300,
                    render:(h,params)=>{
                        return h('div',{
                            style: {
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            },
                            domProps: {
                                     innerHTML: params.row.title
                                },
                        })
                    }
                },
                {
                    title: '编号',
                    key: 'no',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'difficulty',
                    width:100,
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
                    width:200,
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
                                            this.getInfo(params.row.id)
                                        }
                                    }
                                }, '详情'),
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
                                            this.show(params.row)
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
            type:this.$route.query.path,
            // 修改
            modal1:false,

            value1:'',
            cityList:['基础类','其他类','电力类'],//试题分类

            value2:'',
            cityList2:['选择题','填空题','判断题','简答题'],

            value3:'',
            cityList3:['难','中等','简单'],

            editorContent:'',//题目内容
            editor:{},

            //试题答案
            model2: '简答题',
            len: 4,//设置默认5个富文本

            answer:[],
            single:[],
            //判断题
            disabledGroup:'是',
            //填空题
            lengths:0,
            answerT:[],
            //简答
            text1:'',
            changeId:'',
            no:'',
            removeID:''
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
        changeNo(){
            this.changeQuestion('no',this.no)
        },
        getInfo(id){
            this.$router.push({path:'/paper',query:{id}})
        },
        changeDiff(){
            let difficulty = ''
            console.log(this.value3);
            switch (this.value3) {
                case '简单':
                    difficulty = 1
                    break;
                case '中等':
                    difficulty = 2
                    break;
                case '难':
                    difficulty = 3
                    break;
                default:
                    break;
            }
            this.changeQuestion('difficulty',difficulty)
        },
        //点击修改
        show(o){
            console.log(o);
            
            this.no = o.no
            let op = o.option;
            this.no = o.no
            this.changeId = o.id 
            switch (op) {
                case 'choice':
                    this.value2 ='选择题'
                    break;
                case 'blank':
                    this.value2 ='填空题'
                    break;
                case 'check':
                    this.value2 ='判断题'
                    break;
                case 'answer':
                    this.value2 ='简答题'
                    break;
                default:
                    break;
            }
            this.modal1 = true;
        },
        ok () { //确认修改
            // this.$Message.info('Clicked ok');
        },
        changeQuestion(key,value){
            console.log(value);
            
            this.GLOBAL.tokenRequest({
                method:'put',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/public/'+this.changeId,
                data:{
                    table:'question',
                    data:JSON.stringify({
                       key,
                       value, 
                    })
                }
            }).then(({data:data})=>{
                if (data==1) {
                    this.$Message.success('修改成功')
                }else{
                    this.$Message.error('修改失败')
                }
            })
        },
        cancel () { //取消修改
            this.$Message.info('取消修改');
        },
        //试题内容
        addItem(){
            this.len++;
        },
        addD(){
            console.log('点击了添加')
            this.editor.txt.append('<span>(___)</span>')
            this.lengths++ ;
        },
        remove(id){
            this.modal8 = true;
            this.removeID = id;
        },
        okDel(){
            this.GLOBAL.tokenRequest({
                method:'delete',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question/'+this.removeID
            }).then(({data:data})=>{
                this.$Message.success('删除成功');
                this.getList()
            })
        },
        cancelDel(){
            this.$Message.error('取消删除');
        },
        getList(){
            let param = {
                page:this.current,
                page_count:this.pageSize,
            }
            if (this.$route.query.path !='0') {
                param.type = this.$route.query.path;
            }
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param,
            }).then(({data:data})=>{
                this.canShow = false;
                this.$store.commit('setList', data);
            })
        },
        getOptionList(){
            let param = {
                    page:this.current,
                    page_count:this.pageSize,
                    option:this.option,
                }
                if (this.$route.query.path !='0') {
                    param.type = this.$route.query.path;
                }
            this.GLOBAL.tokenRequest({//根据选择的题型拉数据
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param,
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
            let param = {
                    page:this.current,
                    page_count:this.pageSize,
                    option:this.option,
                    keyword:this.searchConName
                }
                if (this.$route.query.path  !='0') {
                    param.type = this.$route.query.path
                }
            this.GLOBAL.tokenRequest({//根据选择的题型拉数据
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param,
            }).then(({data:data})=>{
                 this.$store.commit('setList', data);
            })
        }
    },
    mounted(){
        this.model1 = '';
        let param = {
                page:1,
                page_count:15
            }
            if (this.$route.query.path !='0') {
                param.type = this.$route.query.path
            }
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/question',
            param,
        }).then(({data:data})=>{
            // console.log(data);
            this.canShow = false;
            this.$store.commit('setList', data);
        })
        this.orderData = this.list.data;
    }
};
</script>

