#! /usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk';
import figlet from 'figlet'
import create from '../lib/create.mjs';
program
  // 定义命令和参数
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    create(name,options)
  })
  
program
.command('as [value]')
.description('inspect and modify the config')
.option('-g, --get <path>', 'get value from option')
.option('-s, --set <path> <value>')
.option('-d, --delete <path>', 'delete option from config')
.action((value, options) => {
  console.log(value, options)
})

// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

program
// 监听 --help 执行
.on('--help', () => {
   // 使用 figlet 绘制 Logo
   console.log('\r\n' + figlet.textSync('Z6', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));

  // 新增说明信息
  console.log(`\r\nRun ${chalk.cyan(`z6 <command> --help`)} for detailed usage of given command\r\n`)
})


program
   // 配置版本号信息
  .version(`v1.1.1`)
  .usage('<command> [option]')
  
// 解析用户执行命令传入参数
program.parse(process.argv);
