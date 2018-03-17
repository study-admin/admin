
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
            <h3 class="fl" style='padding-top:5px;'>试题分类：</h3>
            <Select v-model="model1" style="width:200px" class='margin-right-10'>
                <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
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
                <div class="choose"  v-for="item in len" :key="item" >
                    <div :ref="'editor'+item" style="text-align:left"></div>
                </div>
                <div class="add_item" @click="addItem"> 添加选项</div>
                <div  class="clearfix">
                    <Button type="primary">确认提交</Button>
                </div>
            </div>
            <div class="fl" style='width:650px;' v-if='model2 == "判断题"'>
                <radio-group v-model="disabledGroup" vertical>
                    <radio label="是"></radio>
                    <radio label="否"></radio>
                </radio-group>
                <div  class="clearfix">
                    <Button type="primary">确认提交</Button>
                </div>
            </div>
            <div class="fl" style='width:650px;' v-if='model2 == "填空题"'>
                <div class="padding-top-10">
                    <Input v-model="value1" type="textarea" :rows="4" placeholder="请输入答案..."></Input>
                </div>
                <div  class="clearfix">
                    <Button type="primary">确认提交</Button>
                </div>
            </div>
        </div>
    </Card>

</template>

<script>
import E from 'wangeditor'
export default {
    name: 'mutative-router',
    data () {
        return {
            cityList: ['电力类','变电类','通用类'],
            cityList2: ['选择题','填空题','判断题'],
            cityList3: ['难','中等','简单'],
            model1: '电力类',
            model2: '选择题',
            model3: '难',

            //判断题
            disabledGroup:'是',
            //填空题
            value1:'',
            editorContent:'',//题目内容
            len: 1,//设置默认5个富文本
        };
    },
    computed: {

    },
    methods:{
        creatEditor(){
            let o = {};
            for (let i = 1; i <this.len+1; i++) {
                o['editor'+i] = new E(this.$refs['editor'+i][0])
                o['editor'+i].customConfig.onchange = (html) => {
                    this['editorContent'+i] = html
                }
                o['editor'+i].customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
                o['editor'+i].customConfig.menus = ['image']
                o['editor'+i].create()
            }
        },
        addItem(){
            this.len++;
            this.creatEditor();
        }
    },
    mounted() {
        console.log(this.$refs);
        
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
        this.creatEditor();
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
</style>

