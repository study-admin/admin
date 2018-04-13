<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .ivu-menu-vertical{
        width: 200px !important;
    }
    .ivu-menu-item-group-title{
        background-color: #3b6f79;
        font-size:22px !important;
        color:#fff !important;
    }
    .inde2{
        // text-align: center !important;
        color:rgb(0, 0, 0) !important;
        font-size:16px !important;
        cursor: pointer;
    }
    .ivu-menu-item{
        position: relative;
        color:rgb(32, 32, 32) !important;
    }
    .ivu-menu-item-active{
        background-color: #f7f7f7 !important;
    }
    .add{
        position: relative;
    }
    .add::after{
        content: '+添加';
        position: absolute;
        right:5px;
        top:0;
        font-size:15px;
    }
    .del{
        position: absolute;
        top:18px;
        right:5px;
        margin-left:50px;
        padding:0 20px;
        background: red;
        border-radius: 5px;
    }
    .del:hover{
        color:#fff;
    }
    .home-main-b{
        padding-top:50px;
    }
</style>
<template>
    <div class="home-main clearfix">
        <div class="fl home-main-h" style="width:200px;height:100%; background:#fff">
            <Menu :theme="theme3" style="background:#ccc;" :active-name="num" @on-select='btn'>
                <MenuGroup title="试题管理">
                        <MenuItem name="1">
                            <h4 class="inde2" style="text-algin:center;">试题上传</h4>
                        </MenuItem>
                        <h4 class="inde2 add" @click = "add" style="line-height:50px;height:50px;padding-left:24px;">试题分类</h4>
                        <MenuItem :name="item.id" v-for="(item,index) in menuList">
                                <span>{{item.name}}</span><span @click="delItem(item.id)" class="del" v-if= item.id >删除</span>
                        </MenuItem>
                </MenuGroup>
                <MenuGroup title="试卷管理">
                        <MenuItem name="2">
                                <h4 class="inde2" style="text-algin:center;">试卷制定</h4>
                        </MenuItem>
                        <MenuItem name="3">
                                <h4 class="inde2" style="text-algin:center;">试卷列表</h4>
                        </MenuItem>
                </MenuGroup>
            </Menu>
            <Modal
                v-model="isShow"
                title="请输入分类名称"
                @on-ok="ok"
                @on-cancel="cancel">
                <Input v-model="addVal"></Input>
            </Modal>
        </div>
        <div class="fl home-main-b">
            <paper-upload v-if="$route.query.path == 1"></paper-upload>
            <substation v-if="$route.query.path> 3|| $route.query.path==0"></substation>
            <paper-making v-if="$route.query.path == 2"></paper-making>
            <paper-list v-if="$route.query.path == 3"></paper-list>
            <question-info v-if="$route.query.id"></question-info>
        </div>
    </div>
</template>

<script>
// 试卷上传
import paperUpload from '../paper-upload/paper-upload.vue'
// 试题分类
import substation from '../test-questions/substation/substation.vue'
// 试卷制定
import paperMaking from '../paper/paper-making/paper-making.vue'
// 试卷列表
import paperList from '../paper/paper-list/paper-list.vue'

//详情
import questionInfo from '../question/question.vue'
export default {
    name: 'home',
    components:{
        paperUpload,
        substation,
        paperMaking,
        paperList,
        questionInfo
    },
    data () {
        return {
            addVal:'',
            isShow:false,
            theme3: 'dark',
            num:"1",//当前菜单
            menuList:[],
            list:[],
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        delItem(id){
            this.GLOBAL.tokenRequest({
                method:'delete',
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/type/'+id
            }).then(({data:data})=>{
                if (data=='') {
                    this.$Message.success('删除成功')
                    this.GLOBAL.tokenRequest({
                        baseURL:this.GLOBAL.PORER_URL,
                        url:'api/type',
                    }).then(({data:data})=>{
                        console.log(data.data);
                        this.menuList = data.data;
                        this.menuList.unshift({
                            created_at:null,
                            id:0,
                            name:"全部",
                        })
                        console.log(this.menuList);
                        
                    })
                }else{
                    this.$Message.error('删除失败')
                }
            })
        },
        btn(val){ //点击左侧菜单栏
            this.$router.push({
                path:'/paper',
                query:{
                    path:val
                }
            })
            let param = {
                    page:1,
                    page_count:15
                }
                if (val !=0) {
                    param.type =val
                }
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param,
            }).then(({data:data})=>{
                // console.log(data);
                this.$store.commit('setList', data);
            })
            
        },
        cancel(){
            this.$Message.info('取消添加')
        },
        ok(){
            this.GLOBAL.tokenRequest({
                method:"post",
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/type',
                data:{
                    name:this.addVal
                }
            }).then(({data:data})=>{
                if (data.data.id) {
                    this.$Message.success('添加成功')
                    this.GLOBAL.tokenRequest({
                        baseURL:this.GLOBAL.PORER_URL,
                        url:'api/type',
                    }).then(({data:data})=>{
                        console.log(data.data);
                        this.menuList = data.data;
                        this.menuList.unshift({
                                        created_at:null,
                                        id:0,
                                        name:"全部",
                                    })
                    })
                }else{
                    this.$Message.error('添加失败')
                }
            })
        },
        add(){
            this.isShow = true;
        }
    },
    mounted(){
        console.log(this.$route.query.path)
        this.num= this.$route.query.path;
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/type',
        }).then(({data:data})=>{
            console.log(data.data);
            this.menuList = data.data;
            this.menuList.unshift({
                            created_at:null,
                            id:0,
                            name:"全部",
                        })
        })
    }
};
</script>
