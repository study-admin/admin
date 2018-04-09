<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .ivu-menu-vertical{
        width: 200px !important;
        
    }
</style>
<template>
    <div class="home-main clearfix">
        <div class="fl home-main-h" style="width:200px;">
            <Menu :theme="theme3" :active-name="num" @on-select='btn'>
                <MenuGroup title="试卷管理">
                        <MenuItem name="1">
                                <Icon type="document-text"></Icon>
                                试题上传
                        </MenuItem>
                </MenuGroup>
                <MenuGroup title="试题分类">
                        <MenuItem :name="item.id" v-for="(item,index) in menuList">
                                <Icon type="heart"></Icon>
                                {{item.name}}
                        </MenuItem>
                </MenuGroup>
                <MenuGroup title="试卷管理">
                        <MenuItem name="2">
                                <Icon type="heart"></Icon>
                                试卷制定
                        </MenuItem>
                        <MenuItem name="3">
                                <Icon type="heart"></Icon>
                                试卷列表
                        </MenuItem>
                </MenuGroup>
            </Menu>
        </div>
        <div class="fl home-main-b">
            <paper-upload v-if="$route.query.path == 1"></paper-upload>
            <substation v-if="$route.query.path> 3"></substation>
            <paper-making v-if="$route.query.path == 2"></paper-making>
            <paper-list v-if="$route.query.path == 3"></paper-list>
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
export default {
    name: 'home',
    components:{
        paperUpload,
        substation,
        paperMaking,
        paperList
    },
    data () {
        return {
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
        btn(val){ //点击左侧菜单栏
            this.$router.push({
                path:'/paper',
                query:{
                    path:val
                }
            })
            this.GLOBAL.tokenRequest({
                baseURL:this.GLOBAL.PORER_URL,
                url:'api/question',
                param:{
                    type:val,
                    // sort:[{
                    //         "field": "no",
                    //         "rule": "desc"
                    // }],
                    page:1,
                    page_count:15
                }
            }).then(({data:data})=>{
                // console.log(data);
                this.$store.commit('setList', data);
            })
            
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
        })
    }
};
</script>
