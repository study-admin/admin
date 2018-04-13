<template>
  <div>
    <Card style="width:1000px">
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题编号：</h3>
            <div style="padding-left:100px;line-height:35px;">{{list.no}}</div>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题标题：</h3>
            <div style="line-height:35px;display:flex;" v-html ="list.title"></div>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题类型：</h3>
            <div style="padding-left:100px;line-height:35px;">
                {{list.option=='choice'?'选择题':list.option=='blank'?'填空题':list.option=='check'?'判断题':list.option=='answer'?'简答题':''}}
            </div>
        </div>
        <div class="margin-bottom-10 clearfix">
            <h3 class="fl" style='padding-top:5px;'>试题答案：</h3>
            <ul style="padding-left:100px;">
                <li style="line-height:34px;display:flex;" v-for="(item,index) in list.options?list.options.choice:[]" :key="index">{{index+1}}. {{item.content}}</li>
            </ul>
            <ul style="padding-left:100px;">
                <li style="line-height:34px;display:flex;" v-for="(item,index) in list.options?list.options.blank:[]" :key="index">{{index+1}}. {{item.answer?item.answer:' '}}</li>
            </ul>
            <ul style="padding-left:100px;">
                <li style="line-height:34px;display:flex;" v-if="list.options">{{list.options?list.options.answer?list.options.answer.content:'':''}}</li>
            </ul>
            <ul style="padding-left:100px;">
                <li style="line-height:34px;display:flex;" v-if="list.options">{{list.options?list.options.check?list.options.check.answer==1?'正确':'错误':'':''}}</li>
            </ul>
        </div>
    </Card>
  </div>
</template>
<script>
export default {
  data(){
      return{
          id:'',
          list:{}
      }
  },
  mounted(){
      console.log(this.$route.query.id);
      
    this.id = this.$route.query.id,
    this.GLOBAL.tokenRequest({
        baseURL:this.GLOBAL.PORER_URL,
        url:'api/question/'+this.id,
    }).then(({data:data})=>{
        console.log(data);
        this.list = data
    })
  }
}
</script>
<style>
a{
    display: flex;
    ;justify-content: flex-start
}
</style>

