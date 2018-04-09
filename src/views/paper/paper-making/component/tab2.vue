
<!-- 试卷制定 -->
<style lang="less">

    @import '../../../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
</style>

<template>

    <Card>
        <div>
            <div class="margin-bottom-10 clearfix">
                <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
                <Input v-model="titleName" placeholder="输入试卷标题..." style="width: 300px"></Input>
                <Select v-model="model1"  @on-change="changeID" style="width:200px" class='margin-right-10'>
                    <Option v-for="item in cityList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="margin-bottom-10 clearfix">
                <h3 class="fl" style='padding-top:5px;'>试卷编号：</h3>
                <Input v-model="titleID" placeholder="输入试卷编号..." style="width: 300px"></Input>
            </div>
            <p style="text-align:center;">输入分数，数量点击自动抽题</p>
            <div class="rowWraper">
                <div class="head">
                    <span>题型</span>
                    <span>数量</span>
                    <span>分数</span>
                    <span>难度</span>
                    <span>总和</span>
                </div>
                <div class="item" v-for="item in orderData">
                    <span>{{item.goodsNo}}</span>
                    <span><Input v-model="item.difficulty" placeholder="" style="width: 180px"></Input></span>
                    <span><Input v-model="item.score" placeholder="" style="width: 180px"></Input></span>
                    <span>
                        <Select v-model="model1"  style="width:180px">
                            <Option v-for="item in 3" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </span>
                    <span>{{item.difficulty*item.score}}</span>
                </div>
                <div>
                    <span>合计</span>
                    <span>0</span>
                    <span>0</span>
                    <span>0</span>
                </div>
            </div>
            <div class="clearfix margin-bottom-50">
                <Button @click="beginAutoChoice" type="primary" class='fr margin-top-10'>开始自动抽题</Button>
            </div>
            <div class="margin-bottom-10 clearfix">
                <h3 class="fl" style='padding-top:5px;'>试题结果：</h3>
                <p class="fl" style='line-height:34px;'>{{titleName}}</p>
            </div>
            <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                <Table border :columns="orderColumnsT" :data="choiceData"></Table>
                <div class="clearfix">
                <Spin size="large" fix v-if="isAuto">
                    <slot>抽题中,请等待...</slot>
                </Spin>
            </div>
            </Row>
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
            cityList: [],
            model1:'',
            titleID:'',
            ID:'66',
            listID:'',
            isAuto:false,
            searchConName:'',
            orderData: [
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
            //抽题结果
            orderColumnsT: [
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
                    title: '题型',
                    key: 'option',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'difficulty',
                    align: 'center'
                },
            ],

            choiceData: [],
            timer:null,
        };
    },
    computed: {

    },
    methods:{
        beginAutoChoice(){
            if (this.isAuto) {
                return
            }
            this.GLOBAL.tokenRequest({
                method:'post',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper',
                data:{
                    title:this.titleName,
                    type:this.listID,
                    no:this.titleID,
                    options:JSON.stringify({
                        "choice": {"num":this.orderData[0].difficulty,"labe":this.orderData[0].score,"difficulty":1},
                        "check":{"num":this.orderData[1].difficulty,"labe":this.orderData[1].score,"difficulty":0},
                        "blank":{"num":this.orderData[2].difficulty,"labe":this.orderData[2].score,"difficulty":0},
                        "answer":{"num":this.orderData[3].difficulty,"labe":this.orderData[3].score,"difficulty":0}
                        })
                }
            }).then(({data:data})=>{
                if (typeof data =='number') {
                    this.ID = data;
                    this.isAuto = true;
                    this.timer = setInterval(()=>this.getOneQuestions(),500)
                }
            })
        },
        changeID(val){
            this.listID = this.cityList.filter((item)=>item.name ==val)[0].id
        },
        getOneQuestions(){
            this.GLOBAL.tokenRequest({
                method:'put',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper/'+this.ID+'/sample_auto',
                param:{
                    option:''
                }
            }).then(({data:data})=>{
                console.log(data);
                if (data =='') {
                    this.isAuto = false;
                    clearInterval(this.timer)
                }
                this.getChoiceData()
            })
        },
        getChoiceData(){
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/paper/'+this.ID,
            }).then(({data:data})=>{
                console.log(data.question);
                data.question.forEach(item => {
                    switch (item.option) {
                        case 'choice':
                            item.option = '选择题'
                            break;
                        case 'blank':
                            item.option = '填空题'
                            break;
                        case 'check':
                            item.option = '判断题'
                            break;
                        case 'answer':
                            item.option = '简答题'
                            break;
                        default:
                            break;
                    }
                    switch (item.difficulty) {
                        case 0:
                            item.difficulty = '简单'
                            break;
                        case 1:
                            item.difficulty = '中等'
                            break;
                        case 2:
                            item.difficulty = '困难'
                            break;
                        default:
                            break;
                    }
                });
                this.choiceData = data.question
            })
        }
    },
    mounted() {
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/type',
        }).then(({data:data})=>{
            console.log('asdasdasd',data);
            this.cityList = data.data;
            this.model1 = data.data[0].name
            this.listID = data.data[0].id
        })
    }
};
</script>
