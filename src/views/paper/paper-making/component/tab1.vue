
<!-- 试卷制定 -->
<style lang="less">

    @import '../../../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
</style>

<template>

    <Card>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
            <Input v-model="titleName" placeholder="输入试题标题..." style="width: 300px"></Input>
            <Select v-model="model1" style="width:200px" @on-change="getList" class='margin-right-10'>
                <Option v-for="item in cityList.data" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试卷编号：</h3>
            <Input v-model="titleID" placeholder="输入试题编号..." style="width: 300px"></Input>
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
            <div>
                <div class="margin-bottom-10 clearfix">
                    <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
                    <p class="fl" style='line-height:34px;'>{{titleName}}</p>

                </div>
                <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                    <Table border :columns="orderColumnsT" :data="orderDataT"></Table>
                </Row>
                <div class="clearfix margin-bottom-50">
                    <Button type="primary" class='fr margin-top-10'>确认提交</Button>
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
            ID:'',
            cityList: [],
            cityList2: ['选择题','填空题','判断题','简答题'],
            cityList3: ['难','中等','简单'],
            model1: '',
            model2: '选择题',
            model3: '难',
            optionNum:[0,0,0,0],
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
                                            this.show(params.index,val)
                                        }
                                    }
                                }),

                            ])
                    }
                }
            ],

            orderData: [],

            //下方表格
            orderColumnsT: [

                {
                    title: '题型',
                    key: 'goodsNo',
                    align: 'center'
                },
                {
                    title: '数量（已选）',
                    key: 'difficulty',
                    align: 'center'
                },
                {
                    title: '分数',
                    key: 'difficulty',
                    align: 'center'
                },
            ],

            orderDataT: [
                {
                    goodsNo: '选择题',
                    difficulty:'5',
                    single: 20,

                },
                {
                    goodsNo: '填空题',
                    difficulty:'5',
                    single: 20,

                },
                {
                    goodsNo: '判断题',
                    difficulty:'5',
                    single: 20,

                },
                {
                    goodsNo: '简答题',
                    difficulty:'5',
                    single: 20,

                },
                {
                    goodsNo: '合计：',
                    difficulty:'20',
                    single: 100,

                }


            ],
        };
    },
    computed: {

    },
    methods:{
        screenOrder(){ //点击搜索

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
        show(index,val){ //选题目
            console.log(index)  //下标

            console.log(val) //选中状态值

        },
        changePage(pag){
            this.page = pag;
            console.log(this.page);
            
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
        this.orderDataT.forEach((item,i) => {
            item.difficulty =this.optionNum[i]
        });
      }
};
</script>
