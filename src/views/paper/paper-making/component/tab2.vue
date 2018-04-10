
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
                <div class="item" v-for="(item,index) in orderData">
                    <span>{{item.goodsNo}}</span>
                    <span><Input v-model="item.difficulty" @on-change = 'checkVal' placeholder="" style="width: 180px"></Input></span>
                    <span><Input v-model="item.score" @on-change = 'checkVal' placeholder="" style="width: 180px"></Input></span>
                    <span>
                        <Select v-model="item.diffVal" @on-change = 'changeDiff($event,index)'  style="width:180px" :transfer = 'true'>
                            <Option v-for="it in diff" :value="it.key" :key="it.val">{{ it.key }}</Option>
                        </Select>
                    </span>
                    <span>{{item.difficulty*item.score}}</span>
                </div>
                <!-- <div>
                    <span>合计</span>
                    <span>0</span>
                    <span>0</span>
                    <span>0</span>
                </div> -->
            </div>
            <div class="clearfix margin-bottom-50">
                <Button @click="beginAutoChoice" type="primary" class='fr margin-top-10'>开始自动抽题</Button>
            </div>
            <div v-if="choiceData.length">
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
            <Modal
                v-model="modal1"
                title="错误"
                @on-ok="ok"
                @on-cancel="cancel">
                <p>自动抽题数量不足是否继续手动抽题？</p>
            </Modal>
        </div>
    </Card>

</template>

<script>
import E from 'wangeditor'
export default {
    name: 'aaaa',
    data () {
        return {
            // 弹窗
            modal1:false,
            canAuto:true,
            single:false,
            titleName:'',
            cityList: [],
            model1:'',
            titleID:'',
            ID:'66',
            listID:'',
            diffVal:'',
            isAuto:false,
            searchConName:'',
            diff:[{
                    val:1,
                    key:'简单'
                },{
                    val:2,
                    key:'中等'
                },{
                    val:3,
                    key:'困难'
                }],
            orderData: [
                {
                    goodsNo: '选择题',
                    difficulty:0,
                    score:0,
                    val:'choiceVal',
                    diffVal:'简单',
                    dif:0
                },
                {
                    goodsNo: '填空题',
                    difficulty:0,
                    score:0,
                    val:'blankVal',
                    diffVal:'简单',
                    dif:0
                },
                {
                    goodsNo: '判断题',
                    difficulty:0,
                    score:0,
                    val:'checkVal',
                    diffVal:'简单',
                    dif:0
                },
                {
                    goodsNo: '简答题',
                    difficulty:0,
                    score:0,
                    val:'answerVal',
                    diffVal:'简单',
                    dif:0
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
        //弹窗
        ok () {
            this.$router.go(0)
        },
        cancel () {
            this.$Message.info('取消跳转');
        },
        changeDiff(val,i){
            let dif = '';
            switch (val) {
                case '简单':
                    dif = 0
                    break;
                case '中等':
                    dif = 1
                    break;
                case '困难':
                    dif = 2
                    break;
                default:
                    break;
            }
            this.orderData[i].dif = dif
        },
        checkVal(e){
            if (isNaN(e.data)) {
                this.$Message.error('只能输入数字')
                this.canAuto = false;
            }else{
                this.canAuto = true;
            }
        },
        beginAutoChoice(){
            if (this.isAuto) {
                return
            }
            if (this.titleName.trim()==''||this.titleID.trim()=='') {
                this.$Message.error('必填项输入不正确');
                return
            }
            if(!this.canAuto){
                this.$Message.error('表格内数据只能输入数字');
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
                        "choice": {"num":this.orderData[0].difficulty,"labe":this.orderData[0].score,"difficulty":this.orderData[0].dif},
                        "check":{"num":this.orderData[1].difficulty,"labe":this.orderData[1].score,"difficulty":this.orderData[1].dif},
                        "blank":{"num":this.orderData[2].difficulty,"labe":this.orderData[2].score,"difficulty":this.orderData[2].dif},
                        "answer":{"num":this.orderData[3].difficulty,"labe":this.orderData[3].score,"difficulty":this.orderData[3].dif}
                        })
                }
            }).then(({data:data})=>{
                if (typeof data =='number') {
                    this.ID = data;
                    this.isAuto = true;
                    this.timer = setInterval(()=>this.getOneQuestions(),500)
                }else if(data.status == 0){
                    this.$Message.error(data.message)
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
                    let total = 0
                    this.orderData.forEach(item => {
                        total +=item.difficulty
                    });
                    if (this.choiceData.length<total) {
                        // alert('数量不够')//这里是数量不够
                        this.modal1 = true;
                    }
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
            console.log('type',data);
            this.cityList = data.data;
            this.model1 = data.data[0].name
            this.listID = data.data[0].id
        })
    }
};
</script>
