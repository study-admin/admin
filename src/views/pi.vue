<template>
    <div class='wew'>
        <div class="pi_wraper" :class="{show}">
        <h1>{{list.title}}</h1>
        <div v-if="!quse.length">该试卷暂无试题</div>
        <div v-if="quse.length">
            <h2 v-if="choice.length">1.选择题</h2>
            <ul>
                <li class="choice" v-for="(item,index) in choice" :key='index'>
                    <div class="title">{{index+1}}.{{item.title}};<span>( )</span></div>
                    <div class="answer_">
                        <span :class="{red:it.answer}" v-for="(it,id) in item.choice" :key="id">{{id+1 }}. {{ it.content}}</span>
                    </div>
                </li>
            </ul>
            <h2 v-if="blank.length">2.填空题</h2>
            <ul>
                <li class="blank" v-for="(item,index) in blank" :key='index'>
                    <div class="title">{{index+1}}.{{item.title}};</div>
                    <div class="answer_">
            
                        <span v-for="(it,idx) in item.blank" :key="idx">{{idx+1}}.{{ show?it.answer:'_______'}}</span>
                    </div>
                </li>
            </ul>
            <h2 v-if="check.length">3.判断题</h2>
            <ul>
                <li class="check" v-for="(item,index) in check" :key='index'>
                    <div class="title">{{index+1}}.{{item.title}};</div>
                    <div class="answer_">
                        <span :class = {red:item.check[0].answer}>是</span><span>否</span>
                    </div>
                </li>
            </ul>
            <h2 v-if="answer.length">4.简答题</h2>
            <ul>
                <li class="answer" v-for="(item,index) in answer" :key='index'>
                    <div class="title">{{index+1}}.{{item.title}};</div>
                    <div class="answer_">
                        {{show?item.answer[0].content:''}}
                    </div>
                </li>
            </ul>
        </div>
    </div>
    </div>
</template>
<script>
export default {
  data(){
      return{
          show:this.$route.query.is==1,
          id:this.$route.query.id,
          list:{},
          quse:[],
          choice:[],
          blank:[],
          check:[],
          answer:[]
      }
  },
  methods:{
      initList(){
          this.choice = this.quse.filter(item=>item.option == "choice")
          this.blank = this.quse.filter(item=>item.option == 'blank')
          this.check = this.quse.filter(item=>item.option == 'check')
          this.answer = this.quse.filter(item=>item.option == "answer")
          console.log(this.choice,this.blank,this.check,this.answer)
      }
  },
  mounted(){
      console.log(this.show);
      
    this.GLOBAL.tokenRequest({
        baseURL:this.GLOBAL.PORER_URL,
        url:'api/paper/'+this.id,
    }).then(({data:data})=>{
        console.log(data);
        this.list = data
        this.quse = data.question;
        this.initList()
    })
  }
}
</script>
<style scoped>
.body{
    overflow: auto;
}
.pi_wraper{
    padding:10px;
    background-color: #fff;
}
h1{
    text-align: center;
    height:80px;
    font:80px;
}
h2{
    margin-top:30px;
}
.choice{
    margin:10px 0;
}
ul{
    padding-left:20px;
}
.title{
    font:16px/30px "微软雅黑";
    padding:30px 0;
}
.title span{
    margin-left:30px;
}
.answer .answer_{
    height:280px;
}
.answer_{
    padding-left:50px;
    font:12px/30px "微软雅黑";
    height:30px;
}
.answer_ span{
    margin-right:80px;
}
.show .red{
    color:red;
}
.wew{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left:0;
    overflow: auto;
    background-color: #F0F0F0;
    z-index: 1;
    transition: left .3s;
}
</style>

