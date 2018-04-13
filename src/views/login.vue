<style lang="less">
    @import './login.less';
    .login{
        padding-top:50px;
        background-color: #f4fefe;
        // background: url('../image/bg.png') no-repeat #f4fefe;
        // background-size: 100% 600px;
    }
    .login_wraper{
        width:60%;
        margin:30px auto;
        text-align: center;
        // padding-top:450px;
        color:#000;
    }
    .login_wraper input{
        width:180px;
        height:26px;
        outline: none;
        border-radius: 5px;
    }
    .login_wraper span{
        margin-right:10px;
    }
    .primary{
        width:50px;
        height:26px;
        background-color: #39c558;
        color:#fff;
        border:none;
        border-radius: 5px;
    }
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <img style="width:100%; height:500px;" src="../image/bg.png" alt="">
        <div class="login_wraper">
            <span>用户名：<input v-model="form.userName" placeholder="请输入用户名"></input></span>
            <span>密码：<input v-model="form.password" placeholder="请输入密码"></input></span>
            <button class="primary" @click="handleSubmit" type="primary" long>登录</button>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
export default {
    data () {
        return {
            form: {
                userName: '1642586004@qq.com',
                password: 'xyz20130713'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            if (this.form.userName.trim()==''||this.form.password.trim()=='') {
                this.$Message.error('账号密码不得为空')
                return;
            }
            axios.post(this.GLOBAL.PORER_URL+'api/oauth/access_token', {
                grant_type: 'password',
                client_id: 1,
                client_secret:'base64:QHlQ+oBcTcIFdIShPLvPOmu5ZChdY4fcA',
                username:this.form.userName,
                password:this.form.password
            })
            .then(({data:data})=>{
                console.log(data);
                Cookies.set('user', this.form.userName);
                Cookies.set('password', this.form.password);
                Cookies.set('access_token',data.access_token)
                this.$router.push({
                    name: 'home_index',
                    query:{path:1}
                });
            })
            .catch(function (error) {
                this.$Message.error('登录错误')
            });
        }
    },
    mounted(){
        setTimeout(()=>{()=>{
            this.$refs.img.scrollHeight
        },500});
        
    }
};
</script>

<style>

</style>
