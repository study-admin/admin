
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
                    <router-link tag="span" :to="{path: 'pi', query: {id: ID,is:0}}" class="fr" style='line-height:34px;cursor: pointer;'>去打印试卷</router-link>
                    <router-link tag="span" :to="{path: 'pi', query: {id: ID,is:1}}"class="fr" style='line-height:34px;margin-right:15px;cursor: pointer;'>去打印答案</router-link>
                </div>
                <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                    <Table border :columns="orderColumnsT" :data="choiceData"></Table>
                    <div class="clearfix">
                        <!-- <Spin size="large" fix v-if="isAuto">
                            <slot>抽题中,请等待...</slot>
                        </Spin> -->
                    </div>
                </Row>
            </div>
            <Modal
                v-model="modal1"
                title="提示"
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
            ID:'',
            listID:'',
            diffVal:'',
            isAuto:false,
            searchConName:'',
            optionS:'choice',
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
                    dif:1
                },
                {
                    goodsNo: '填空题',
                    difficulty:0,
                    score:0,
                    val:'blankVal',
                    diffVal:'简单',
                    dif:1
                },
                {
                    goodsNo: '判断题',
                    difficulty:0,
                    score:0,
                    val:'checkVal',
                    diffVal:'简单',
                    dif:1
                },
                {
                    goodsNo: '简答题',
                    difficulty:0,
                    score:0,
                    val:'answerVal',
                    diffVal:'简单',
                    dif:1
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
                    align: 'center',
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
            choicData:[],
            checkData:[],
            blankData:[],
            answerData:[],
            a:false
        };
    },
    computed: {

    },
    methods:{
        //弹窗
        ok () {
            this.$router.push({path:'/paper',query:{path:2,pid:this.ID}})
            this.$router.go(0)
        },
        cancel () {
            this.$Message.info('取消手动补充');
        },
        changeDiff(val,i){
            let dif = '';
            switch (val) {
                case '简单':
                    dif = 1
                    break;
                case '中等':
                    dif = 2
                    break;
                case '困难':
                    dif = 3
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
            if (!Number(this.orderData[0].difficulty)&&!Number(this.orderData[1].difficulty)&&!Number(this.orderData[2].difficulty)&&!Number(this.orderData[3].difficulty)) {
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
                        "blank":{"num":this.orderData[1].difficulty,"labe":this.orderData[1].score,"difficulty":this.orderData[1].dif},
                        "check":{"num":this.orderData[2].difficulty,"labe":this.orderData[2].score,"difficulty":this.orderData[2].dif},
                        "answer":{"num":this.orderData[3].difficulty,"labe":this.orderData[3].score,"difficulty":this.orderData[3].dif}
                        })
                }
            }).then(({data:data})=>{
                if (typeof data =='number') {
                    this.ID = data;
                    this.isAuto = true;
                    this.timer = setInterval(()=>this.getOneQuestions(),500)
                }
                if(data.status == 0){
                    console.log(123)
                    alert(data.message)
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
                        total +=Number(item.difficulty)
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
        // getOneQuestions(){
        //     this.getChoiceData()
        //     switch (this.optionS) {
        //         case 'choice':
        //             // num = this.choiceData.filter((item)=>item.option=='选择题').length;
                    
        //             console.log('choice');
        //             if (Number(this.orderData[0].difficulty)==this.choicData.length) {
        //                 this.optionS = 'check' 
        //                 return
        //             }
        //             break;
        //         case 'check':
        //             console.log('check');
        //             // num = this.choiceData.filter((item)=>item.option=='判断题').length
        //             if (Number(this.orderData[1].difficulty)==this.checkData) {
        //                 this.optionS = 'blank'
        //                 return 
        //             }
        //             break;
        //         case 'blank':

        //             console.log('blank');
        //             // num = this.choiceData.filter((item)=>item.option=='填空题').length
        //             if (Number(this.orderData[2].difficulty)==this.blankData.length) {
        //                 this.optionS = 'answer' 
        //                 return
        //             }
        //             break;
        //         case 'answer':
        //             // num = this.choiceData.filter((item)=>item.option=='问答题').length
        //             if (Number(this.orderData[4].difficulty)==this.answerData.length) {
        //                 //全抽完了
        //                 clearInterval(this.timer)
        //                 this.modal1 = this.a
        //                 return
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        //     this.GLOBAL.tokenRequest({
        //         method:'put',
        //         baseURL:this.GLOBAL.PORER_URL,
        //         url:'api/paper/'+this.ID+'/sample_auto',
        //         param:{
        //             option:this.optionS
        //         }
        //     }).then(({data:data})=>{
        //         if (data=='') {
        //             this.a = true
        //             switch (this.optionS) {
        //                 case 'choice':
        //                     this.optionS = 'check'
        //                 case 'check':
        //                     this.optionS = 'blank'
        //                     break;
        //                 case 'blank':
        //                     this.optionS = 'answer' 
        //                     break;
        //                 case 'answer':
        //                     clearInterval(this.timer)
        //                     this.modal1 = this.a
        //                     break;
        //                 default:
        //                     break;
        //             }
        //         }else{
        //             switch (this.optionS) {
        //                 case 'choice':
        //                     this.choicData.push(data) 
        //                     break;
        //                 case 'check':
        //                     this.checkData.push(data) 
        //                     break;
        //                 case 'blank':
        //                     this.blankData.push(data) 
        //                     break;
        //                 case 'answer':
        //                     this.answerData.push(data)
        //                     break;
        //                 default:
        //                     break;
        //             }
        //         }
        //     })
        // },
        // getOneQues1(){
        //     this.getChoiceData()
        //     let n = this.choiceData.filter(item=>{
        //         return item.option =='选择题'
        //     }).length
        //     console.log(n,Number(this.orderData[0].difficulty));
        //     if (n==Number(this.orderData[0].difficulty)) {
        //         this.flag2 = true;
        //     }
        //     this.GLOBAL.tokenRequest({
        //         method:'put',
        //         baseURL:this.GLOBAL.PORER_URL,
        //         url:'api/paper/'+this.ID+'/sample_auto',
        //         param:{
        //             option:'choice'
        //         }
        //     }).then(({data:data})=>{
        //         console.log(data);
        //         if (data =='') {
        //             this.flag2 = true
        //             this.a =true;
        //         }
        //     })
        // },
        // getOneQues2(){
        //     this.getChoiceData()
        //     let n = this.choiceData.filter(item=>{
        //         return item.option =='判断题'
        //     }).length
        //     if (n==Number(this.orderData[1].difficulty)) {
        //         this.flag3 = true;
        //     }
        //     this.GLOBAL.tokenRequest({
        //         method:'put',
        //         baseURL:this.GLOBAL.PORER_URL,
        //         url:'api/paper/'+this.ID+'/sample_auto',
        //         param:{
        //             option:'check'
        //         }
        //     }).then(({data:data})=>{
        //         if (data =='') {
        //             this.flag3 = true
        //             this.a =true;
        //         }
        //     })
        // },
        // getOneQues3(){
        //     this.getChoiceData()
        //     let n = this.choiceData.filter(item=>{
        //         return item.option =='填空题'
        //     }).length
        //     if (n==Number(this.orderData[2].difficulty)) {
        //         this.flag4 = true;
        //     }
        //     this.GLOBAL.tokenRequest({
        //         method:'put',
        //         baseURL:this.GLOBAL.PORER_URL,
        //         url:'api/paper/'+this.ID+'/sample_auto',
        //         param:{
        //             option:'blank'
        //         }
        //     }).then(({data:data})=>{
        //         if (data =='') {
        //             this.flag4 = true
        //             this.a =true;
        //         }
        //     })
        // },
        // getOneQues4(){
        //     this.getChoiceData()
        //     let n = this.choiceData.filter(item=>{
        //         return item.option =='问答题'
        //     }).length
        //     if (n==Number(this.orderData[3].difficulty)) {
        //         // this.flag4 = true;
        //     }
        //     this.GLOBAL.tokenRequest({
        //         method:'put',
        //         baseURL:this.GLOBAL.PORER_URL,
        //         url:'api/paper/'+this.ID+'/sample_auto',
        //         param:{
        //             option:'answer'
        //         }
        //     }).then(({data:data})=>{
        //         if (data =='') {
        //             this.a = true
        //         }
        //     })
        // },
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
                        case 1:
                            item.difficulty = '简单'
                            break;
                        case 2:
                            item.difficulty = '中等'
                            break;
                        case 3:
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

