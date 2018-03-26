
<!-- 试卷上传 -->
<style lang="less">
    @import '../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
</style>
<template>
    <Card>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题编号：</h3>
            <Input style="width:200px" v-model="no" class="margin-right-10"></Input>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题分类：</h3>
            <Select v-model="model1" style="width:200px" class='margin-right-10'>
                <Option v-for="item in cityList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select v-model="model2" style="width:200px" class='margin-right-10'>
                <Option v-for="item in cityList2" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="model3" style="width:200px">
                <Option v-for="item in cityList3" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </div>
        <div class="clearfix">
            <h3 class="fl">试题内容：</h3>
            <div class="fl" style='width:650px;'>
                <div ref="editor" style="text-align:left"></div>
            </div>
        </div>
        <div class="clearfix">
            <h3 class="fl">试题答案：</h3>
            <div class="fl" style='width:650px;' v-if='model2 == "选择题"'>
                <div class="choose"  v-for="(item,index) in len" :key="item" style="padding: 5px 0">
                    <!-- <div :ref="'editor'+item" style="text-align:left"></div> -->
                    {{item}}
                    <Input v-model="answer[index]" placeholder="输入选项" style="width: 400px" size="large"></Input>
                    <VueImgInputer class="margin-left-10" :v-model="'picValue'+item" theme="light" size="large"></VueImgInputer>
                    <Checkbox class="is_true" v-model="single[index]">是否正确</Checkbox>
                </div>
                 <Button long @click="addItem" class="margin-top-20">添加选项</Button>
                <div class="clearfix margin-top-20 margin-bottom-30">
                    <Button type="primary" class="fr" @click="submitPaper">确认提交</Button>
                </div>
            </div>
            <div class="fl" style='width:650px;' v-if='model2 == "判断题"'>
                <radio-group v-model="disabledGroup" vertical>
                    <radio label="是"></radio>
                    <radio label="否"></radio>
                </radio-group>
                <div  class="clearfix">
                    <Button type="primary" @click="submitPaper">确认提交</Button>
                </div>
            </div>
            <div class="fl" style='width:650px;' v-if='model2 == "填空题"'>
                <div class="padding-top-10">
                    <Input v-model="value1" type="textarea" :rows="4" placeholder="多个答案请按顺序输入，答案以逗号间隔"></Input>
                </div>
                <div  class="clearfix">
                    <Button type="primary" @click="submitPaper">确认提交</Button>
                </div>
            </div>
        </div>
    </Card>

</template>

<script>
import E from 'wangeditor'
import VueImgInputer from 'vue-img-inputer'
export default {
    name: 'mutative-router',
    data () {
        return {
            no:'',//试题编号
            cityList: [],
            cityList2: ['选择题','填空题','判断题'],
            cityList3: ['难','中等','简单'],
            model1: '',
            model2: '选择题',
            model3: '难',
            answer:[],
            single:[],
            //判断题
            disabledGroup:'是',
            //填空题
            value1:'',
            editorContent:'',//题目内容
            len: 4,//设置默认5个富文本
        };
    },
    components: {
        VueImgInputer
    },
    methods:{
        submitPaper(){
            let type ='';//获取题型id
            this.cityList.forEach(item => {
                if(this.model1 == item.name){
                    type = item.id
                }
            });
            let difficulty = '';//获取提醒难度
            switch(this.model3){
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
            }
            
           switch(this.model2)
            {
            case '选择题':
                let choice = [];
                for (let i = 0; i < this.len; i++) {
                    choice.push({"content":this.answer[i],"answer":this.single[i]||0})                 
                } 
                console.log(type);
                let data = {
                    no:this.no,
                    title:this.editorContent,
                    type,
                    difficulty,
                    option:'choice',
                    options:JSON.stringify({
                        choice,
                    })
                }
                console.log(data);
                
                this.GLOBAL.tokenRequest({
                    method:"post",
                    baseURL:this.GLOBAL.PORER_URL,
                    url:'api/question',
                    data,
                }).then(({data:data})=>{
                    console.log(data);
                    
                })
            break;
            case '填空题':
            
            break;
            case '判断题':

            break;
            default:
            
            }
        },
        addItem(){
            this.len++;
        }
    },
    mounted() {
        this.GLOBAL.tokenRequest({
            baseURL:this.GLOBAL.PORER_URL,
            url:'api/type',
        }).then(({data:data})=>{
            console.log(data.data);
            this.cityList = data.data;
            this.model1 = data.data[0].name
        })
        let  editor = new E(this.$refs.editor)
        editor.customConfig.onchange = (html) => {
            this.editorContent = html
        }
        editor.customConfig.menus = [
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
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create()
      }
};
</script>
<style>
.choose .w-e-text-container{
    height:45px !important;
}
.add_item{
    margin-top:5px;
    text-align: center;
    border:1px dashed #000;
    cursor: pointer;
}
.img-inputer{
    width:50px !important;
    height:40px !important;
}
.img-inputer__placeholder{
    display: none;
}
.choose{
    display: flex;
    align-items: center;
}
.img-inputer__icon{
    height:30px;
}
.is_true{
    margin-left: 25px;
}
</style>

