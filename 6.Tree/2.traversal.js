class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}

class Tree {
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
}

let tree = new Tree();
[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item)
})

console.log(tree);