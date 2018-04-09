
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
                            <Input v-model="searchConName" icon="search" @on-click='search' placeholder="关键词，标题" style="width: 200px" />
                        </Row>

                    </div>
                    <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                        <Table border :columns="orderColumns" :data="orderData"></Table>
                    </Row>
                    <Modal
                        v-model="modal1"
                        title="修改"
                        @on-ok="ok"
                        width = '800px'
                        @on-cancel="cancel">
                        <div>
                            <div class="padding-top-10 display">
                                <span class="fl complimentary-t margin-right-10">试题分类</span>
                                <!-- <Input v-model="value1" placeholder="..." style="width: 300px"></Input> -->
                                <Select v-model="value1" style="width:200px" transfer>
                                    <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div class="padding-top-10 display">
                                <span class="fl complimentary-t margin-right-10">试题类型</span>
                                <!-- <Input v-model="value1" placeholder="..." style="width: 300px"></Input> -->
                                <Select v-model="value2" style="width:200px">
                                    <Option v-for="item in cityList2" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div class="padding-top-10">
                                <span class="fl complimentary-t margin-right-10">试题难度</span>
                                <!-- <Input v-model="value1" placeholder="..." style="width: 300px"></Input> -->
                                <Select v-model="value3" style="width:200px">
                                    <Option v-for="item in cityList3" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div class="clearfix padding-top-10">
                                <span class="fl complimentary-t margin-right-10">试题内容</span>
                                <div class="fl paper_main" style='width:650px;'>
                                    <div ref="editor" style="text-align:left"></div>
                                </div>
                            </div>
                            <div class="clearfix">
                                <span class="fl complimentary-t margin-right-10">试题答案：</span>
                                <div class="fl" style='width:650px;' v-if='model2 == "选择题"'>
                                    <div class="choose"  v-for="(item,index) in len" :key="item" style="padding: 5px 0">
                                        <!-- <div :ref="'editor'+item" style="text-align:left"></div> -->
                                        {{item}}
                                        <Input v-model="answer[index]" placeholder="输入选项" style="width: 400px" size="large"></Input>
                                        <VueImgInputer class="margin-left-10" :v-model="'picValue'+item" theme="light" size="large"></VueImgInputer>
                                        <Checkbox class="is_true" v-model="single[index]">是否正确</Checkbox>
                                    </div>
                                    <Button long @click="addItem" class="margin-top-20">添加选项</Button>
                                </div>
                                <div class="fl" style='width:650px;' v-if='model2 == "判断题"'>
                                    <radio-group v-model="disabledGroup" vertical>
                                        <radio label="是"></radio>
                                        <radio label="否"></radio>
                                    </radio-group>
                                </div>
                                <div class="fl" style='width:650px;' v-if='model2 == "填空题"'>
                                    <!-- <button v-on:click="getContent">查看内容</button> -->
                                    <Button @click="addD">点击生成答案</Button>
                                    <div>

                                        <div class="choose"  v-for="(item,index) in lengths" :key="item" style="padding: 5px 0">
                                            <Input v-model="answerT[index]" style="width: 400px" size="large"></Input>

                                        </div>
                                    </div>
                                </div>
                                <div class="fl" style='width:650px;' v-if='model2 == "简答题"'>
                                    <div class="padding-top-10">
                                        <Input v-model="text1" type="textarea" :rows="4" placeholder=""></Input>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </Modal>
                    <div class="clearfix" style="height:80px;">
                       <Page :total=total class="fr padding-top-10" @on-change='changePage'></Page>
                    </div>
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
                                            this.show(params.row.id)
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
        //点击修改
        show(){
            this.modal1 = true;
        },
        ok () { //确认修改
            this.$Message.info('Clicked ok');
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
        //初始化付文本
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.onchange = (html) => {
            this.editorContent = html
        }
        this.editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ]
        this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        this.editor.create()
        
    }
};
</script>
