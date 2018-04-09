
<!-- 试卷制定 -->
<style lang="less">

    @import '../../../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
    .rowWraper{
        width:100%;
        border:1px solid #ccc;
        font: 14px/32px "微软雅黑";
    }
    .rowWraper div{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .rowWraper span{
        width:30%;
        text-align: center;
        border:1px solid #c1c1c1;
    }
</style>

<template>

    <Card>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
            <Input v-model="titleName" placeholder="输入试卷标题..." style="width: 300px"></Input>
            <Select v-model="model1" style="width:200px" @on-change="getList" class='margin-right-10'>
                <Option v-for="item in cityList.data" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试卷编号：</h3>
            <Input v-model="titleID" placeholder="输入试卷编号..." style="width: 300px"></Input>
        </div>
        <div v-if="!ID" class="clearfix margin-bottom-50">
            <Button type="primary" @click="beginCheck" class='fr margin-top-10'>开始抽题</Button>
        </div>
        <div v-if="ID">
            <div>
                <!-- <Select v-model="model1" style="width:200px" @on-change="getList" class='margin-right-10'>
                    <Option v-for="item in cityList.data" :value="item.name" :key="item.id">{{ item.name }}</Option>
                </Select>-->
                <Select v-model="model2" style="width:200px" @on-change="getOp" class='margin-right-10'>
                    <Option v-for="item in cityList2" :value="item" :key="item">{{ item }}</Option>
                </Select> 
                <span>此页面自动保存，勾选即添加，取消勾选即撤销</span>
                <!-- <Select v-model="model3" style="width:200px" @on-change="getList">
                    <Option v-for="item in cityList3" :value="item" :key="item">{{ item }}</Option>
                </Select> -->
                <!-- <Input v-model="searchConName" icon="search" @on-click="screenOrder" placeholder="搜索..." style="width: 200px" /> -->
            </div>
            <div class="clearfix">
                <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                    <Table border :columns="orderColumns" :data="orderData"></Table>
                </Row>
                <div class="clearfix">
                    <Page :total="total" @on-change='changePage' class='fr padding-top-10'></Page>
                </div>
            </div>
            <div class="clearfix">
                <!-- 已选 -->
                <h3 class="fl" style='padding-top:5px;'>已选试题：{{titleName}}</h3>
                <Row class="margin-top-10 searchable-table-con1 fl" justify="center" align="middle">
                    <Table border :columns="orderColumns1" :data="choiceData"></Table>
                </Row>
            </div>
            <div style="margin-bottom:20px;margin-top:30px;">
                <!-- <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                    <Table border :columns="orderColumnsT" :data="orderDataT"></Table>
                </Row> -->
                <p style="text-align:center;">输入分数，点击任意位置即保存</p>
                <div class="rowWraper">
                    <div class="head">
                        <span>题型</span>
                        <span>数量</span>
                        <span>分数</span>
                        <span>总和</span>
                    </div>
                    <div v-for="item in orderDataT">
                        <span>{{item.goodsNo}}</span>
                        <span>{{item.difficulty}}</span>
                        <span><Input @on-blur ="changeScore(item)" v-model="item.score" placeholder="" style="width: 230px"></Input></span>
                        <span>{{item.difficulty*item.score}}</span>
                    </div>
                    <div>
                        <span>合计</span>
                        <span>{{totalScore.difficulty}}</span>
                        <span>{{totalScore.score}}</span>
                        <span>{{totalScore.total}}</span>
                    </div>
                </div>
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
            titleID:'',
            listID:'',//类型id／第一个参数
            total:1,
            pag:1,
            ID:'60',
            totalScore:{},
            cityList: [],
            cityList2: ['选择题','填空题','判断题','简答题'],
            // cityList3: ['难','中等','简单'],
            model1: '',
            model2: '选择题',
            // model3: '难',
            searchConName:'',
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
                                        'on-change': (val) => {
                                            this.show(params.row,val)
                                        }
                                    }
                                }),

                            ])
                    }
                }
            ],
            orderColumns1: [
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
                }
            ],
            orderData: [],
            choiceData:[],
            totalScore:{
                difficulty:0,
                score:0,
                total:0,
            },
            //下方表格
            orderDataT: [
                {
                    goodsNo: '选择题',
                    difficulty:0,
                    score:0,
                    val:'choiceVal'
                },
                {
                    goodsNo: '填空题',
                    difficulty:0,
                    score:0,
                    val:'blankVal'
                },
                {
                    goodsNo: '判断题',
                    difficulty:0,
                    score:0,
                    val:'checkVal'
                },
                {
                    goodsNo: '简答题',
                    difficulty:0,
                    score:0,
                    val:'answerVal'
                },
            ],
        };
    },
    computed: {

    },
    methods:{
        screenOrder(){ //点击搜索

        },
        getTotalScore(){
            console.log(123);
            
            let difficulty =0;
            let score = 0;
            let total = 0;
            for (let i = 0; i < this.orderDataT.length; i++) {
                difficulty += this.orderDataT[i].difficulty;
                score += Number(this.orderDataT[i].score)
                total += this.orderDataT[i].difficulty*Number(this.orderDataT[i].score)
            }
            this.totalScore = {
                difficulty,
                score,
                total,
            }
        },
        changeScore(item){
            if (isNaN(item.score)) {
                this.$Message.error('分数只允许输入纯数字');
                return
            }
            this.GLOBAL.tokenRequest({
                method:'put',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/public/'+this.ID,
                data:{
                    table:'paper',
                    data:JSON.stringify({
                        "key": item.val,
		                "value": item.score
                    })
                }
            }).then(({data:data})=>{
                // console.log('分数修改成功');
                this.$Message.success('分数修改成功');
                this.getTotalScore()
            })
        },
        beginCheck(){
            if(this.titleName.trim()&&this.titleID.trim()){
                console.log(this.listID);
                
                this.GLOBAL.tokenRequest({
                    method:'post',
                    baseURL:this.GLOBAL.PORER_URL,
                    url:'api/paper',
                    data:{
                        title:this.titleName,
                        type:this.listID,
                        no:this.titleID,
                        options:JSON.stringify({
                            "choice": {"num":0,"labe":0,"difficulty":0},
                            "check":{"num":0,"labe":0,"difficulty":0},
                            "blank":{"num":0,"labe":0,"difficulty":0},
                            "answer":{"num":"0","labe":0,"difficulty":0}
                            })
                    }
                }).then(({data:data})=>{
                    if (typeof data =='number') {
                        this.ID = data;
                        console.log(data);
                        
                    }
                })
            }
        },
        getListID(val){
            this.listID = this.cityList.data.filter(item=>item.name==val)[0].id
            this.getData();
        },
        getList(val){
            this.getListID(val);
        },
        getOp(val){
           this.getData();
        },
        getChoiceData(){
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper/'+this.ID,
            }).then(({data:data})=>{
                console.log(data);
                this.choiceData = data.question;
                //重置数据
                this.orderDataT= [{
                        goodsNo: '选择题',
                        difficulty:0,
                        score:0,
                        val:'choiceVal'
                    },
                    {
                        goodsNo: '填空题',
                        difficulty:0,
                        score:0,
                        val:'blankVal'
                    },
                    {
                        goodsNo: '判断题',
                        difficulty:0,
                        score:0,
                        val:'checkVal'
                    },
                    {
                        goodsNo: '简答题',
                        difficulty:0,
                        score:0,
                        val:'answerVal'
                    }],
                data.question.forEach(item => {
                    switch (item.option) {
                        case 'choice':
                            this.orderDataT[0].difficulty++
                            break;
                        case 'blank':
                            this.orderDataT[1].difficulty++
                            break;
                        case 'check':
                            this.orderDataT[2].difficulty++
                            break;
                        case 'answer':
                            this.orderDataT[3].difficulty++
                            break;
                        default:
                            break;
                    }
                });
                this.getTotalScore();
            })
        },
        show(item,val){ //选题目
            console.log(item.id)
            console.log(val) //选中状态值
            if (val) {//选择添加
                this.GLOBAL.tokenRequest({
                    method:'post',
                    baseURL:this.GLOBAL.PORER_URL,
                    url:'api/paper/'+this.ID+'/question',
                    data:{
                        question_id:item.id
                    }
                }).then(({data:data})=>{
                    if (data=='') {
                        this.getChoiceData()
                        this.$Message.success('试题添加成功');
                    }
                })
            }else{
                this.GLOBAL.tokenRequest({
                    method:'delete',
                    baseURL:this.GLOBAL.PORER_URL,
                    url:'api/paper/'+this.ID+'/question?id='+item.id
                }).then(({data:data})=>{
                    if (data=='') {
                        this.getChoiceData();
                        this.$Message.success('试题移除成功');
                    }
                })
            }
            
        },
        changePage(pag){
            this.page = pag;
            this.getData()
        },
        getData(){
            let option = '';
            switch (this.model2) {
                case '选择题':
                    option = 'choice'
                    break;
                case '填空题':
                    option = 'blank'
                    break;
                case '判断题':
                    option = 'check'
                    break;
                case '简答题':
                    option = 'answer'
                    break;
                default:
                    break;
            }
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param:{
                    type:this.listID,
                    page:this.page,
                    page_count:10,
                    option,
                }
            }).then(({data:data})=>{
                this.total = data.meta.pagination.total;
                data.data.forEach(item => {
                    item.difficulty= item.difficulty ==1?'简单':item.difficulty ==2?'中等':item.difficulty ==3?'困难':'无';
                });
                this.orderData = data.data
            })
        }
    },
    mounted() {
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/type',
        }).then(({data:data})=>{
            console.log(data);
            this.cityList = data;
            this.model1 = this.cityList.data[0].name
            this.getListID(this.model1);
            this.getData();
        })
      }
};
</script>
