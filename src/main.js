import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'
import router from './router'

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

const app = createApp(App).use(router)

app.use(ElementPlus,{
    locale: zhCn,
  })
app.use(VMdEditor)
app.use(router)
app.mount('#app')