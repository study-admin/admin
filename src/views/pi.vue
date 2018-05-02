<template>
    <div  ref="paperpage" class='wew'>
        <!-- <Button v-if="isShow" style="position: fixed; top:50px; right:200px;" @click="getPDF" type="primary">导出</Button> -->
        <div class="pi_wraper">
        <h1>{{list.title}}{{show?"答案":''}}</h1>
        <p v-if="!show" style="text-align:center; font:bold 16px/18px '微软雅黑'"><span>单位____________________</span><span>姓名_____________</span><span>成绩__________</span></p>
        <p v-else style="text-align:center; font:bold 16px/18px '微软雅黑'">试卷编号:{{list.no}}</p>
        <div v-if="!quse.length">该试卷暂无试题</div>
        <div v-if="quse.length">
            <h2 v-if="choice.length">1.选择题 ({{choice.length}} x {{list.choiceVal}}分 = {{choice.length*list.choiceVal}}分)</h2>
            <ul>
                <li class="choice" v-for="(item,index) in choice" :key='index'>
                    <div v-if="!show">
                        <div class="clearfix title">
                            <span class="fl">{{index+1}}.</span>
                            <div class="fl containter" style="display:block;" >{{htmlc(item.title)}}</div>
                        </div>
                        <div class="answer_">
                            <span v-for="(it,id) in item.choice" :key="id">{{a[id]}}. {{ it.content}}</span>
                        </div>
                    </div>
                    <div v-else class="answer_">
                        <span v-for="(it,id) in item.choice" :key="id">{{it.answer? index+1+'. '+a[id]:''}}</span>  
                    </div>
                </li>
            </ul>
            <h2 v-if="blank.length">2.填空题 ({{blank.length}} x {{list.blankVal}}分 = {{blank.length*list.blankVal}}分)</h2>
            <ul>
                <li class="blank" v-for="(item,index) in blank" :key='index'>
                    <div v-if="!show"> 
                        <div class="title clearfix">
                            <span class="fl">{{index+1}}.</span>
                            <div class=" fl containter" style="display:block;">{{htmlc(item.title)}}</div>
                        </div>
                        <div class="answer_">
                            <!-- <span v-for="(it,idx) in item.blank" :key="idx">{{idx+1}}.{{ show?it.answer:'_______'}}</span> -->
                        </div>
                    </div>
                    <div v-else class="answer_ clearfix"> 
                        <div class="fl" style="margin-right:5px;">{{index+1}}.</div><span class="fl nom" v-for="(it,idx) in item.blank" :key="idx">{{ it.answer}}，</span>
                    </div>
                </li>
            </ul>
            <h2 v-if="check.length">3.判断题 ({{check.length}} x {{list.checkVal}}分 = {{check.length*list.checkVal}}分)</h2>
            <ul>
                <li class="check" v-for="(item,index) in check" :key='index'>
                    <div v-if="!show">
                        <div class="title clearfix">
                            <span class="fl">{{index+1}}.</span>
                            <div class="fl containter" style="display:block;">{{htmlc(item.title)}}</div>
                        </div>
                        <div class="answer_">
                            <!-- <span :class = {red:item.check[0].answer}>是</span><span>否</span> -->
                        </div>
                    </div>
                    <div v-else class="answer_">
                        <span>{{index+1}}. {{item.check[0].answer?'是':'否'}}</span>
                    </div>
                </li>
            </ul>
            <h2 v-if="answer.length">4.简答题  ({{answer.length}} x {{list.answerVal}}分 = {{answer.length*list.answerVal}}分)</h2>
            <ul>
                <li class="answer" v-for="(item,index) in answer" :key='index'>
                    <div class="title clearfix" v-if="!show" >
                        <span class="fl">{{index+1}}.</span>
                        <div class=" fl containter" style="display:block;">{{htmlc(item.title)}}</div>
                    </div>
                    <div class="answer_ containter" style="display:block;" >{{htmlc(show?index+1+'. '+item.answer[0].content:'')}} </div>
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
          answer:[],
          a:['A','B','C','D','E','F','G'],
          isShow:true,
      }
  },
  methods:{
      htmlc(test){  
            test = test.replace(/(\n)/g, "");  
            test = test.replace(/(\t)/g, "");  
            test = test.replace(/(\r)/g, "");  
            test = test.replace(/<\/?[^>]*>/g, "");  
            test = test.replace(/\s*/g, ""); 
            test = test.replace(/\&nbsp;/g,"_");
            test = test.split("p.p1{margin:0.0px0.0px0.0px0.0px;line-height:19.0px;font:13.0px'HelveticaNeue'}").join("")
            return  test;  
        },
      initList(){
          this.choice = this.quse.filter(item=>item.option == "choice")
          this.blank = this.quse.filter(item=>item.option == 'blank')
          this.check = this.quse.filter(item=>item.option == 'check')
          this.answer = this.quse.filter(item=>item.option == "answer")
          console.log(this.choice,this.blank,this.check,this.answer)
      },
      getPDF() {
        this.isShow = false;
        var target = this.$refs.paperpage
        target.style.background = "#FFFFFF";
        let name = this.list.title
        html2canvas(target, {
            onrendered:function(canvas) {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 592.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 592.28/contentWidth * contentHeight;

                var pageData = canvas.toDataURL('image/jpeg', 1.0);

                var pdf = new jsPDF('', 'pt', 'a4');

                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                        pdf.addPage();
                        }
                    }
                }

                pdf.save(name+".pdf");
            }
        })
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
    /* overflow: auto; */
}
.fl{
    float: left;
}
.clearfix::after{
    content:'';
    display: block;
    clear: both;
}
.nom{
    margin-right:10px !important;
}
.pi_wraper{
    padding:50px 80px;
    background-color: #fff;
}
h1{
    text-align: center;
    height:80px;
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
    padding:20px 0;
}
.title span{
    margin-left:30px;
}
.answer .answer_{
    height:280px;
}
.answer_{
    padding-left:50px;
    font:14px/30px "微软雅黑";
}
.answer_ span{
    display: block;
    margin-right:80px;
}
.show .red{
    color:red;
}
.wew{
    /* position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left:0;
    overflow: auto; */
    background-color: #fff;
    /* z-index: 1; */
    transition: left .3s;
}
</style>

