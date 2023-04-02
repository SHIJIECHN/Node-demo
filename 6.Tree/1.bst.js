class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent; // 
    this.left = null;
    this.right = null;
  }
}

class Tree { // 二插搜索树 我们考虑相同值的情况
  constructor() {
    this.root = null;
  }

  add(element) {
    if (this.root === null) {
      this.root = new Node(element);
      return;
    }
    // 可以用递归，也可以用循环
    let currentNode = this.root;
    // 更新当前节点
    let parent;
    let compare;
    while (currentNode) {
      compare = currentNode.element < element; // 放左还是放右
      parent = currentNode;// 遍历之前先记录节点
      if (compare) {
        // 以右边的为根节点
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }
    // compare;// 放在左边还是右边
    // parent; // 放到谁身上

    let node = new Node(element, parent);
    if (compare) {
      parent.right = node;
    } else {
      parent.left = node;
    }

  }

  // 前序
  preOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      console.log(node.element); // 先遍历自己 
      traverse(node.left); // 先处理左边
      traverse(node.right); // 再处理右边
    }
    traverse(this.root);
  }
  // 中序
  inOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      traverse(node.left); // 先处理左边
      console.log(node.element); // 再遍历自己 
      traverse(node.right); // 再处理右边
    }
    traverse(this.root);
  }

  // 后序
  postOrderTraversal() {
    function traverse(node) { // 写递归先考虑终止条件
      if (node === null) return;
      traverse(node.left); // 先处理左边
      traverse(node.right); // 再处理右边
      console.log(node.element); // 最后遍历自己 
    }
    traverse(this.root);
  }
  // 层序
  levelOrderTraversal(callback) {
    let stack = [this.root];
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      callback(currentNode);
      if (currentNode.left) {
        stack.push(currentNode.left);
      }
      if (currentNode.right) {
        stack.push(currentNode.right);
      }
    }
  }

  reverse(cb) {
    let stack = [this.root];
    let index = 0;
    let currentNode;
    while (currentNode = stack[index++]) {
      cb(currentNode);
      let temp = currentNode.left;
      currentNode.left = currentNode.right;
      currentNode.right = temp;
      if (currentNode.left) {
        stack.push(currentNode.left);
      }
      if (currentNode.right) {
        stack.push(currentNode.right);
      }
    }
  }
}

let tree = new Tree();
[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item)
})

// console.dir(tree, { depth: 1000 });

// webpack ast babal树的遍历，需要在遍历的过程中将当前节点给你传递过来，你来使用。使用回调函数
// tree.levelOrderTraversal((node) => {
//   // 操作更改节点
//   node.element *= 2;
// });
// console.dir(tree, { depth: 1000 });



// 实现二叉树的反转
tree.reverse((node) => { });
console.dir(tree, { depth: 1000 });