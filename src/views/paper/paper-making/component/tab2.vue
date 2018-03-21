<<<<<<< HEAD
<template>
  
</template>
<script>
export default {
  
}
=======

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
                <h3 class="fl" style='padding-top:5px;'>试题结果：</h3>
                <p class="fl" style='line-height:34px;'>222</p>

            </div>
            <Row class="margin-top-10 searchable-table-con1" justify="center" align="middle">
                <Table border :columns="orderColumnsT" :data="orderDataT"></Table>
                <div class="clearfix">
                <Page :total="100" class='fr padding-top-10'></Page>
            </div>
            </Row>

            <div class="clearfix margin-bottom-50">

                <Button type="primary" class='fr margin-top-10'>确认提交</Button>
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
            cityList: ['电力类','变电类','通用类'],
            cityList2: ['选择题','填空题','判断题'],
            cityList3: ['难','中等','简单'],
            model1: '电力类',
            model2: '选择题',
            model3: '难',
            searchConName:'',

            //抽题结果
            orderColumnsT: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '题目',
                    key: 'a',
                    align: 'center'
                },
                {
                    title: '题型',
                    key: 'b',
                    align: 'center'
                },
                {
                    title: '难度',
                    key: 'c',
                    align: 'center'
                },
                {
                    title: '分类',
                    key: 'd',
                    align: 'center'
                },
            ],

            orderDataT: [
                {
                    a: '国际标准说明',
                    b:'选择题',
                    c: '中等',
                    d:'变电类'

                },
                {
                    a: '国际标准说明',
                    b:'选择题',
                    c: '中等',
                    d:'变电类'

                },
                {
                    a: '国际标准说明',
                    b:'选择题',
                    c: '中等',
                    d:'变电类'

                },
                {
                    a: '国际标准说明',
                    b:'选择题',
                    c: '中等',
                    d:'变电类'

                },
                {
                    a: '国际标准说明',
                    b:'选择题',
                    c: '中等',
                    d:'变电类'

                },


            ],
        };
    },
    computed: {

    },
    methods:{

    },
    mounted() {

      }
};
>>>>>>> 1d35599627a6f3c67d11c4a1acffd30ef3b01033
</script>
