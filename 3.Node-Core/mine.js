function fn(obj) {
  let str = "";
  with (obj) {
    str += `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    `
    arr.forEach((item) => {
      str += `
      <li>1</li>
    `
    })
    str += `
  </body>
  </html>`}
  return str;
}

console.log(fn({ arr: [1, 2, 3] }));