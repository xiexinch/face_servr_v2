
let vm = new Vue({
    el: '#app',
    data: {
        info_list: [],
        images: [],
        currentImageUrls: [],
        currentIndex: 0,
        loading: false,
        finished: false
    },
    created() {
        axios.get('/face/get_faces_info').then(response => {
            this.info_list = response.data
            this.currentImageUrls = this.info_list[0].urls
            console.log(response)
            
            this.finished = true
            this.loading = false
        }).catch(error => {
            alert(error)
        })
    },
    methods: {
      onChange(index) {
        this.currentImageUrls = this.info_list[index].urls
        this.currentIndex = index
      },
      addFace() {
        console.log("click add btn")
        console.log(myService)
        let res = myService.addface()
        alert(res)
      },
      deleteFace() {
        console.log('click delete btn')
        let res = myService.deletUser(this.info_list[this.currentIndex].userid)
        this.info_list.remove(index)
        axios.get('/face/deleteUser?userid='+this.info_list[this.currentIndex].userid).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(response)
        })
        alert(res)
      },
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
          },
    },

})