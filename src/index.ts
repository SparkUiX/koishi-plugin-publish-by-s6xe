import { Context, Schema } from 'koishi'
import { promises as fs } from 'fs'
import path from 'path';
export const name = 'publish-by-s6xe'
export interface Config {
  maintainer: {
  email: string,
  name: string
  }[]
}
export const Config: Schema<Config> = Schema.object({
  maintainer: Schema.array(
    Schema.object({
      email: Schema.string(),
      name: Schema.string()
    })
  ).description('在这里填入你想要的贡献者们的用户名和邮箱').role('table')
  .default([{email:"thoe9008@outlook.com",name:"sparkuix"},{email:"1919892171@qq.com",name:"shangxue"}])//这里是我和上学大人贴贴的地方，你们都不准改！！！
})
export const usage=`
## 在下方表格填入贡献者的邮箱和名字，

## 开启/关闭插件后重启koishi实例即可生效，

## 如遇到无法恢复的情况，可以试着更换market插件的版本`
export function apply(ctx: Context,config: Config) {
  const originalFunction = `function F1(e){var c;const n={};for(const u of e.package.contributors)u.email&&(n[c=u.email]||(n[c]=u));return e.package.maintainers.some(u=>n[u.email])?Object.values(n):e.package.maintainers.map(({email:u,username:h})=>({email:u,name:h}))}`;
  const maintainers=config.maintainer.map(({email,name})=>`{email:"${email}",name:"${name}"}`).join(',')
  const newFunction = `function F1(e){return[${maintainers}];}`
  const basePath = __dirname.includes('node_modules') ? __dirname : process.cwd();
  const filePath = path.join(basePath, 'node_modules', '@koishijs', 'plugin-market', 'dist', 'index.js')
  console.log(maintainers)
  ctx.on('ready',async ()=>{
    try{
      
    const or=await fs.readFile(filePath, 'utf8')
    const nw=or.replace(originalFunction,newFunction)
    await fs.writeFile(filePath,nw,'utf8')
    console.log('执行成功')
  }catch(e){
    console.log(e)
  }
  })
  ctx.on('dispose',async ()=>{
    try{
    const or = await fs.readFile(filePath, 'utf8')
    const nw = or.replace(newFunction, originalFunction)
    await fs.writeFile(filePath, nw, 'utf8')
    console.log('恢复成功')
  }catch(e){console.log(e)
  }
})
}