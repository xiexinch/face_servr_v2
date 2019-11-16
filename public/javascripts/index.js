
let vm = new Vue({
    el: '#app',
    data: {
        info_list: [],
        images: [],
        currentImageUrl: "",
        loading: false,
        finished: false
    },
    created() {
        axios.get('/face/get_faces_info').then(response => {
            this.info_list = response.data
            this.currentImageUrl = this.info_list[0].url
            console.log(response)
            console.log(this.currentImageUrl)
            this.finished = true
            this.loading = false
        }).catch(error => {
            alert(error)
        })
    },
    methods: {
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
              for (let i = 0; i < 1; i++) {
                this.info_list.push(this.info_list.length + 1);
              }
              // 加载状态结束
              this.loading = false;
      
              // 数据全部加载完成
              if (this.list.length >= 1) {
                this.finished = true;
              }
            }, 500);
          }
    },
})