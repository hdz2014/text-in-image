# Text-in-image
这个是在watermark-on-image的库的框架上修改而来的，能在浏览器环境下对图片在指定位置添加文字的库。
需求来源就是项目上需要对一图章图片在其中添加文号和日期(后来采用了后台方案，此为个人研究成果)。

# 安装
``` shell
yarn add text-in-image
```

# 使用方法
```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <img :src="imageValue" alt="" />
  </div>
</template>

<script>
import { TextMark } from "@/utils/index";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      info: {
        text: "测试文字cccc",
        color: "red",
        font: "bold 28px 楷体",
        position: {
          left: 27,
          top: 18,
          right: 137,
          bottom: 64,
        },
        rotation: 0,
        align: "middle",
      },
      info1: {
        text: "中国很棒",
        color: "blue",
        font: "bold 28px 宋体",
        position: {
          left: 27,
          top: 18,
          right: 137,
          bottom: 64,
        },
        rotation: 30,
        align: "left",
      },
      imageValue: "",
    };
  },
  mounted() {
    let text = new TextMark();
    text.loadSrc("test.png");
    text.markText(this.info);
    text.markText(this.info1);
    text.getImage("png", 1.0).then((images) => {
      this.imageValue = images;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>


```

此为本人第一个前端开源小玩具。