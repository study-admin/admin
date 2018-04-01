
<!-- 试卷制定 -->
<style lang="less">

    @import '../../../styles/common.less';
    .w-e-text-container{
        height: 200px !important;
    }
</style>

<template>

    <Card style="width:1000px;">
        <Tabs value="name1">
            <TabPane label="手动抽题" name="name1"><tab1></tab1></TabPane>
            <TabPane label="自动抽题" name="name2"><tab2></tab2></TabPane>

        </Tabs>
    </Card>

</template>

<script>
import tab1 from './component/tab1.vue'
import tab2 from './component/tab2.vue'
export default {
    name: 'mutative-router',
    components:{
        tab1,
        tab2
    },
    data () {
        return {


        };
    },
    computed: {

    },
    methods:{

    },
    mounted() {

      }
};
</script>
