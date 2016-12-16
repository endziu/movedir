const fs = require('fs-extra')
const parse = require('minimist')
const Task = require('data.task')

const args = parse(process.argv.slice(2))
const [ srcDir, dstDir ] = args._

const help = () => console.log
(`
  will delete everything from destination folder
  and fill it with stuff from source folder.
  if destination folder does not exist it will be created
-----

  Use like this:
  $ node moveBuild /path/to/src /path/to/dest
`)

if(args.h || args.help) {
  help()
  process.exit(0)
}

if (!srcDir || !dstDir) {
  help()
  process.exit(1)
}

const emptyDir = (path) => 
  new Task((rej, res) =>
    fs.emptyDir(path, (err,success) => err ? rej(err) : res(success)))

const copyDir = (src, dst) =>
  new Task ((rej, res) =>
    fs.copy(src, dst, (err,success) => err ? rej(err) : res(success)))


const doStuff = () =>
  emptyDir(dstDir)
    .chain(() => copyDir(srcDir, dstDir))

doStuff()
  .fork(
    e => console.log(e),
    x => console.log('nailed it!')
  )
